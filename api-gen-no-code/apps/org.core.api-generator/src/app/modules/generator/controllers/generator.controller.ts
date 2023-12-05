import { Body, Controller, Get, HttpCode, Param, Post, Query, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExecuteScriptDto } from '../dto/script.dto';
import { GeneratorService } from '../services/generator.service';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { ErrorBase, ResponseBase } from '../../../infrastructure/format/response.base';
import { QueryParamDataDto } from '../../crud-pg/controller/query-filter.dto';
import { CreateApplicationDto } from '../dto/create-app.dto';
import { SQLTransformerDto } from './mll.query.dto';
import { SQLToAPIService } from '../services/sql-to-api.service';

@ApiTags('Api Generator')
@Controller('generator')
export class GeneratorController {
  constructor(
    private readonly service: GeneratorService,
    private readonly sql: SQLToAPIService,
  ) { }

  @Post('execute-script')
  async executeScript(@Body() exe: ExecuteScriptDto) {
    return new ResponseBase(200, 'Execute script successs', await this.sql.executeScript(exe.script));
  }
  @Post('execute-script-again')
  async executeScriptAgain(@Body() exe: ExecuteScriptDto) {
    return new ResponseBase(200, 'Execute script successs', await this.sql.executeScriptAgain(exe.script));
  }

  @Get('app/:appid/schema')
  async getSchemasByAppId(
    @Param('appid') appId: number,
  ) {
    const ownerID = 'test_owner_id';
    return new ResponseBase(200, 'Get schemas success', await this.service.getSchemasByAppId(appId, ownerID));
  }

  @Post('app/:appid/script')
  @HttpCode(201)
  async executeCreateDbScript(
    @Param('appid') appId: number,
    @Body() scripts: ExecuteScriptDto
  ) {
    const ownerID = 'test_owner_id';

    const executeResult = await this.service.executeCreateDatabaseScript(appId, ownerID, scripts);
    return new ResponseBase(201, 'Execute create databsse by script success', executeResult);
  }

  @Post('app')
  async createApp(@Body() createAppDto: CreateApplicationDto) {
    const ownerID = 'test_owner_id';
    const appCreated = await this.service.createApp(ownerID, createAppDto);
    if (appCreated !== true) {
      if (appCreated.errno === -111)
        return new ResponseBase(-111, 'Không thể kế nối đến databsse', appCreated);
    }
    return new ResponseBase(200, 'Create app success', appCreated);
  }

  @Get('app/:appid/script')
  async getScriptByAppId(
    @Param('appid') appId: number,
  ) {
    const ownerID = 'test_owner_id';
    try {
      const script = await this.service.getCreateDbScriptByAppId(appId, ownerID);
      if (script?.length === 0) {
        return new ResponseBase(404, `Not found script by app id ${appId}`);
      }
      return new ResponseBase(200, 'Get create data base script success', script);
    } catch (error) {
      return new ResponseBase(601, error.message);
    }
  }

  @Get('app/:appid/api')
  async getApisByAppId(
    @Param('appid') appId: number,
  ) {
    const ownerID = 'test_owner_id';

    try {
      const apis = await this.service.getApisByAppId(appId, ownerID);
      return new ResponseBase(200, `Get apis by ${appId} success`, apis);
    } catch (error) {
      return new ErrorBase(error);
    }
  }

  @Get('workspace')
  @HttpCode(200)
  async isExistedWorkspace() {
    const isExistedWorkspace = await this.service.isExistedWorkspace();
    return new ResponseBase(200, 'Check is exited workspace success', {
      isExisted: isExistedWorkspace,
      woskspaceId: 2023
    });
  }

  @Post('workspace')
  @HttpCode(201)
  async createWorkspace(@Body() createAppDto: CreateWorkspaceDto) {
    const appCreated = await this.service.createWorkspace(createAppDto);
    if (appCreated !== true) {
      if (appCreated.errno === -111)
        return new ResponseBase(-111, 'Không thể kế nối đến databsse', appCreated);
    }
    return new ResponseBase(200, 'Create app success', appCreated);
  }

  @Get('workspace/:id')
  @HttpCode(200)
  async getWorkspaceById(
    @Param('id') id: string,
    @Query() queryParamDataDto: QueryParamDataDto,
  ) {
    const workspace = await this.service.getWorkspaceById(id, queryParamDataDto);
    return new ResponseBase(200, 'Get workspace info success', workspace);
  }
  @Get('workspace/:id/app')
  @HttpCode(200)
  async getAppsByWorkspaceId(@Param('id') id: number) {
    const ownerID = 'test_owner_id';
    const apps = await this.service.getAppsByWorkspaceId(ownerID, id)
    return new ResponseBase(200, 'Get app by workspace id success', apps);
  }


  @Post('app/:appid/transformer')
  @HttpCode(200)
  async getSQLTransfromer(
    @Param('appid') appId: number,
    @Body() sqlTransformerDto: SQLTransformerDto,
  ) {
    const ownerID = 'test_owner_id';
    const result = await this.service.getSQLTransformer(ownerID, appId, sqlTransformerDto);
    return new ResponseBase(200, 'getSQLTransfromer', {
      result: result,
      saveAsAPIPath: `api/v1/app/${appId}/transformer/api`
    });
  }

  @Get('app/:appid/api/doc')
  @Render('api-doc')
  async getApiDocsTemplate(
    @Param('appid') appId: number,
  ) {
    const ownerID = 'test_owner_id';
    const apis = await this.service.getApiGeneratedHbsView(appId, ownerID);
    return { viewData: apis };
  }
}
