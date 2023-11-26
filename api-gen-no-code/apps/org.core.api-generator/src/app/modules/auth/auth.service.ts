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

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly crudService: CrudService,
    private readonly jwtService: JwtService,
    private readonly bscriptService: BCryptService,
    private readonly nodeCache: NodeCache,
  ) { }

  private readonly logger = new Logger(AuthService.name);

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  async canExecThisAPI(token: any, request: Request) {
    const userId = token.userId;
    const { method, baseUrl } = request;

    const match = baseUrl.replace(`/api/v1/app/${WORKSPACE_VARIABLE.APP_ID}/schema/`, '');
    const tableName = match.split('/')[0];

    const cacheKey = PolicyModel.getKeyCachePolicyByUser(AUTH_CACHE_KEY.POLICY, userId);

    let policySet = this.nodeCache.get(cacheKey) as Set<string>;

    if (!policySet) {
      this.logger.verbose(`\n Cache miss: ${cacheKey}`)
      await this.getAuthorizeInfoInDB(userId);
      policySet = this.nodeCache.get(cacheKey) as Set<string>;
      this.logger.verbose(`\n Input cache succces: ${cacheKey}`)
    }
    const policyKey = PolicyModel.getKeyCachePolicyAPI(userId, tableName, method);
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
    const [roles, apis, accounts] = await Promise.all([
      this.crudService.query({
        appid: appId,
        schema: '_core_role'
      }, {} as any, {} as any),

      this.crudService.query({
        appid: appId,
        schema: '_core_generated_apis'
      }, {} as any, {} as any),

      this.crudService.query({
        appid: appId,
        schema: '_core_account'
      }, {
        selects: ['id', 'metadata'] // roleIds
      }, {
        id: userId,
      })
    ]);

    const policy = new PolicyModel(roles, apis, accounts).extractToPolicy();
    this.nodeCache.set(cacheKey, policy);
    return policy;
  }


}
