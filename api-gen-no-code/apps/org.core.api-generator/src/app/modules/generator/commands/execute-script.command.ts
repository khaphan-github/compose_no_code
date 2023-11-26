import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ExecuteScriptDto } from '../dto/script.dto';
import { DataSource, DataSourceOptions, UpdateResult } from 'typeorm';
import { Logger } from '@nestjs/common';
import _ from 'lodash';
import { AST, Option, Parser } from 'node-sql-parser';
import { ExecutedSQLScriptEvent } from '../events/execute-sql-create-db.event';
import { CanNotUpdateResultError } from '../../crud-pg/errors/can-not-update-result.error';
import { NullAttributeError } from '../../shared/errors/null-attribute.error';
import { CanNotExecuteQueryError } from '../../crud-pg/errors/can-not-execute-query.error';
import { EAppTableColumns } from '../../../core/models/application.model';
import { APPLICATIONS_TABLE_NAME } from '../../../core/variables/application-table.variables';
import { DbQueryDomain } from '../../../core/db.query.domain';

export class ExecuteScriptCommand {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly appId: number,
    public readonly ownerId: string,
    public readonly script: ExecuteScriptDto,
  ) { }
}
// DOCS: https://orkhan.gitbook.io/typeorm/docs/select-query-builder
@CommandHandler(ExecuteScriptCommand)
export class ExecuteScriptCommandHandler
  implements ICommandHandler<ExecuteScriptCommand> {
  private readonly dbQueryDomain!: DbQueryDomain;
  private readonly queryParser!: Parser;

  private readonly logger!: Logger;

  constructor(
    private readonly eventBus: EventBus,
  ) {
    this.dbQueryDomain = new DbQueryDomain();
    this.queryParser = new Parser();

    this.logger = new Logger(ExecuteScriptCommandHandler.name);
  }

  // DONE
  async execute(command: ExecuteScriptCommand) {
    const { appId, ownerId, script, workspaceConnections } = command;

    if (_.isNil(appId)) throw new NullAttributeError('appId');
    if (_.isNil(script.script)) throw new NullAttributeError('script');
    if (_.isNil(workspaceConnections)) throw new NullAttributeError('workspaceConnections');

    // #region init necessary static data

    // Docs: https://www.npmjs.com/package/node-sql-parser
    // TODO: Database type:
    const parserOptions: Option = {
      database: 'Postgresql',
    }

    // #endregion init necessary static data
    let workspaceTypeormDataSource: DataSource;

    try {
      workspaceTypeormDataSource = await new DataSource(workspaceConnections).initialize();
    } catch (error) {
      await workspaceTypeormDataSource?.destroy();
      return Promise.reject(new CanNotExecuteQueryError(appId, '', error.message));
    }

    // let scriptTableRenamed: string;
    let renamedParser: AST | AST[];
    let createDBSCriptParser: AST | AST[];

    try {
      createDBSCriptParser = this.queryParser.astify(script.script, parserOptions);
      // renamedParser = this.dbQueryDomain.convertTableNameByAppId(appId, createDBSCriptParser);
      // ERROR: INT4 - INT(4)
      // scriptTableRenamed = this.queryParser.sqlify(renamedParser, parserOptions);
    } catch (error) {
      this.logger.error(error);
    }
    const executeScriptTransaction = script.script;

    let executeGenrateDBResult: unknown;
    try {
      await workspaceTypeormDataSource.query(executeScriptTransaction);
    } catch (error) {
      await workspaceTypeormDataSource?.destroy();
      return Promise.reject(new CanNotExecuteQueryError(appId, 'All shema', error.message));
    }

    let executeUpdateAppResult: UpdateResult;
    try {
      executeUpdateAppResult = await workspaceTypeormDataSource.createQueryBuilder()
        .update(APPLICATIONS_TABLE_NAME)
        .set({
          [EAppTableColumns.CREATE_DB_SCRIPT]: script.script,
          [EAppTableColumns.UPDATED_AT]: new Date(),
          [EAppTableColumns.TABLES_INFO]: JSON.stringify(renamedParser),
        })
        .where(`${APPLICATIONS_TABLE_NAME}.id = :id`, { id: appId })
        .execute();

      await workspaceTypeormDataSource?.destroy();
    } catch (error) {
      await workspaceTypeormDataSource?.destroy();
      return Promise.reject(new CanNotUpdateResultError(appId, APPLICATIONS_TABLE_NAME, appId, error.message));
    }

    this.eventBus.publish(
      new ExecutedSQLScriptEvent(workspaceConnections, ownerId, appId, createDBSCriptParser)
    );

    return {
      executeGenrateDBResult: executeGenrateDBResult,
      executeUpdateAppResult: executeUpdateAppResult,
    }
  }
}
