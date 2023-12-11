/* eslint-disable @typescript-eslint/no-explicit-any */
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { UserLoginDTO } from './dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../crud-pg/services/crud-pg.service';
import { WORKSPACE_VARIABLE } from '../shared/variables/workspace.variable';
import { JwtService } from '@nestjs/jwt';
import { BCryptService } from './bscript.service';
import { WrongUsernameOrPasswordError } from './errors/login..error';
import { ITokenPayLoad, IUserLogin } from './interfaces/user-login.interface';
import { RegisterDTO } from './dtos/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { IRegister } from './interfaces/register.interface';
import NodeCache from 'node-cache';
import { AUTH_CACHE_KEY } from './variables/cache.const';
import { PolicyModel } from './model/policy.model';
import { Request } from 'express';
import _ from 'lodash';
import { LightWeightRepository } from '../light-weight-module/repository/light-weight.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly crudService: CrudService,
    private readonly jwtService: JwtService,
    private readonly bscriptService: BCryptService,
    private readonly nodeCache: NodeCache,
    private readonly lightWeightRepo: LightWeightRepository,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  // Nếu có api nào truy cập thuọc điều kiện bên dưới -> Invalid cache cập nhật lại quyền cho đúng
  executeTaskFollowPrivatePolicy(request: Request) {
    // Invalid cache policy
    const policyTableList = ['_core_account', '_core_role', '_core_generated_apis'];
    if (
      policyTableList.includes(PolicyModel.extractTableName(request))
      && (request.method !== 'GET' && !request.baseUrl.includes('query'))
    ) {
      this.nodeCache.flushAll(); // <-- Xóa hết khỏi nghỉ nhiều
      this.logger.verbose(`Invalid policy cache when update role`);
    }

  }

  isRequestRequireResourceInWhiteList = async (request: Request) => {
    // Kiểm tra white list ở custom api và cả generated api.
    this.logger.verbose(`1. Check is this request contain in white list or public apis`)
    if (_.includes(PolicyModel.API_WHITE_LIST, request.baseUrl)) {
      return true;
    }
    try {
      const publicApiSet = await this.getPublicApis() as Set<string>;
      let key = '';
      if (request.baseUrl.includes('api/v1/custom')) {
        key = PolicyModel.getKeyCachePublicAPI(request.baseUrl.replace('/api/v1/custom/', ''), 'custom');
      } else {
        const tableName = PolicyModel.extractTableName(request);
        key = PolicyModel.getKeyCachePublicAPI(tableName, PolicyModel.getActionFromRequest(request));
      }


      const right = publicApiSet.has(key) ?? false;
      this.logger.log(`Current request ${right ? 'have' : 'do not have'} role: ${key}`);
      return right;
    } catch (error) {
      this.logger.error(`Error: isRequestRequireResourceInWhiteList ${error}`)
      return false;
    }
  }

  async canExecThisAPI(token: any, request: Request) {
    const userId = token.userId;

    const cacheKey = PolicyModel.getKeyCachePolicyByUser(AUTH_CACHE_KEY.POLICY, userId);

    let policySet = this.nodeCache.get(cacheKey) as Set<string>;

    if (!policySet) {
      this.logger.verbose(`\n Cache miss: ${cacheKey}`)

      await this.getAuthorizeInfoInDB(userId);
      policySet = this.nodeCache.get(cacheKey) as Set<string>;

      this.logger.verbose(`\n Input cache succces: ${cacheKey}`)
    }

    const tableName = PolicyModel.extractTableName(request);
    let policyKey = ''
    if (request.baseUrl.includes('/api/v1/custom/')) {
      policyKey = PolicyModel.getKeyCachePolicyAPI(userId, request.baseUrl.replace('/api/v1/custom/', ''), 'custom');
    } else {
      policyKey = PolicyModel.getKeyCachePolicyAPI(userId, tableName, PolicyModel.getActionFromRequest(request));
    }

    this.logger.log(`\nUser ${userId} just exec api with role: ${policyKey}`)

    return policySet.has(policyKey) ?? false;
  }

  async login(userLoginDto: UserLoginDTO): Promise<IUserLogin> {
    const { password, username } = userLoginDto;
    const appId = WORKSPACE_VARIABLE.APP_ID.toString();

    // USER
    const userInSystem = await this.crudService.query({
      appid: appId,
      schema: '_core_account'
    }, {
      selects: ['id', 'metadata', 'username', 'password']
    }, {
      and: [
        { username: username },
      ]
    });
    const foundUser = userInSystem[0];

    if (!foundUser) {
      return Promise.reject(new WrongUsernameOrPasswordError());
    }

    const isRightPassword = await this.bscriptService.comparePassword(password, foundUser.password);

    if (!isRightPassword) {
      return Promise.reject(new WrongUsernameOrPasswordError());
    }

    // TOKEN
    const tokenPairId = uuidv4();
    const tokenPayload: ITokenPayLoad = {
      userId: foundUser?.id ?? '_',
      tokenId: tokenPairId
    }

    const accessToken = this.jwtService.sign(tokenPayload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(
      {
        ...tokenPayload,
        accessTokenId:
          tokenPairId
      },
      { expiresIn: '7d' }
    );

    const userLogin: IUserLogin = {
      info: {
        id: foundUser.id,
        metadata: foundUser.metadata,
        username: foundUser.username
      },
      token: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    }
    return userLogin
  }

  async register(registerDto: RegisterDTO) {
    const { username, info, password } = registerDto;
    const appId = WORKSPACE_VARIABLE.APP_ID.toString();

    const passwordHashed = await this.bscriptService.hashPassword(password);
    const roles = await this.crudService.query({
      appid: appId,
      schema: '_core_role'
    }, {
      selects: ['id', 'metadata']
    }, {});

    const arrayRoleDefautlWhenLogin = _.filter(roles, (role) => role?.metadata?.defaultWhenRegister == true);

    const saveUserResult = await this.crudService.insert(appId, '_core_account',
      [{
        username: username,
        password: passwordHashed,
        metadata: {
          info: info,
          roleIds: arrayRoleDefautlWhenLogin.map((role) => role.id)
        },
        enable: true,
      }]);

    const registerResult: IRegister = {
      id: saveUserResult[0].id,
      metadata: saveUserResult[0].metadata,
      created_at: saveUserResult[0].created_at,
      username: saveUserResult[0].username,
      enable: saveUserResult[0].enable,
    }
    return registerResult;
  }

  async getAuthorizeInfoInDB(userId: string) {
    // Cache cho từng user;
    const cacheKey = PolicyModel.getKeyCachePolicyByUser(AUTH_CACHE_KEY.POLICY, userId);
    const appId = WORKSPACE_VARIABLE.APP_ID.toString();
    const [roles, apis, accounts, customApi] = await Promise.all([
      this.crudService.query({
        appid: appId,
        schema: '_core_role'
      }, {} as any, {
        enable: 'true'
      }),

      this.crudService.query({
        appid: appId,
        schema: '_core_generated_apis'
      }, {} as any, {
        enable: 'true'
      }),

      this.crudService.query({
        appid: appId,
        schema: '_core_account'
      }, {
        selects: ['id', 'metadata'] // roleIds
      }, {
        id: userId,
      }),

      this.lightWeightRepo.getAllCustomApi(),
    ]);

    const policy = new PolicyModel(roles, apis, accounts, customApi).extractToPolicy();
    this.nodeCache.set(cacheKey, policy);
    return policy;
  }


  // Lấy danh sách public api để cache để khỏi validate (white list)
  private getPublicApis = async () => {
    const publicApisInCache = this.nodeCache.get(AUTH_CACHE_KEY.PUBLIC_APIs);

    if (publicApisInCache) {
      return publicApisInCache;
    }

    const appId = WORKSPACE_VARIABLE.APP_ID.toString();

    const queryResult = await this.crudService.query({
      appid: appId,
      schema: '_core_generated_apis'
    }, {
      selects: ['table_name', 'action'],
    }, {
      and: [
        { enable: 'true', },
        { authentication: 'NO_AUTH' }
      ]
    }) as any[];

    const customApiQuery = await this.lightWeightRepo.getPublicCustomApi();

    // Api path as table name and action only post:

    const publicApiSet = new Set(queryResult.map(
      (element) => PolicyModel.getKeyCachePublicAPI(element.table_name, element.action))
    );

    for (let index = 0; index < customApiQuery.length; index++) {
      const element = customApiQuery[index];
      publicApiSet.add(PolicyModel.getKeyCachePublicAPI(element.api_path, element.action))
    };

    console.log(publicApiSet);
    this.nodeCache.set(
      AUTH_CACHE_KEY.PUBLIC_APIs,
      publicApiSet
    );

    return publicApiSet;
  }


}
