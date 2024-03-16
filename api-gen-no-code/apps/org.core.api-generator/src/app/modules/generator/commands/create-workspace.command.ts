import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from "typeorm";
import { RelationalDBQueryBuilder } from '../../../core/pgsql/pg.relationaldb.query-builder';
import { EWorkspaceColumns } from '../../../core/models/workspace.model';
import { WORKSPACE_AVAILABLE_COLUMNS, WORKSPACE_TABLE_NAME } from '../../../core/variables/workspace-table.variables';
import { FileReaderService } from '../../shared/file-reader.service';

export class AppAlreadyExistError extends Error {
  constructor(
    public readonly appName: string,
    public readonly statusCode?: number,
    public readonly metadata?: object,
  ) {
    super();
    this.message = `Application ${appName} already exist`;
    this.name = AppAlreadyExistError.name;
  }
}

export class CreateWorkspaceCommand {
  constructor(
    public readonly ownerId: string,
    public readonly CreateWorkspaceDto: CreateWorkspaceDto,
    public readonly workspaceId?: string | number,
  ) { }
}

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceCommandHandler
  implements ICommandHandler<CreateWorkspaceCommand>
{
  private readonly queryBuilder!: RelationalDBQueryBuilder;

  private readonly logger = new Logger(CreateWorkspaceCommandHandler.name);

  constructor(
    private readonly fileReaderService: FileReaderService,
  ) {
    this.queryBuilder = new RelationalDBQueryBuilder(WORKSPACE_TABLE_NAME, WORKSPACE_AVAILABLE_COLUMNS);
  }

  /**LOGIC:
   * Kiểm tra kết nối cơ sở dữ liệu, thực hiện kết nối đến cơ sở dữ liệu tương ứng
   * Sau đó tạo các bảng cần thiết:
   * 1. Bảng API - Lưu các API sẽ tạo
   * 2. Bảng Config - Lưu các config của user,
   * 3. Bảng App, Lưu thông tin các ứng dụng con khi user tạo,
   * DOCS: https://orkhan.gitbook.io/typeorm/docs/data-source
   */
  async execute(command: CreateWorkspaceCommand) {
    const { database, databaseName, host, password, port, username } = command.CreateWorkspaceDto;
    let typeormDataSource: DataSource;

    const dbConfig = {
      type: database,
      host: host,
      port: port,
      username: username,
      password: password,
      database: databaseName,
    };
    try {


      typeormDataSource = await new DataSource(dbConfig as DataSourceOptions).initialize();
      const getScript = (file: string) => `private/scripts/pg/${file}.sql`;

      const createApplicationTableSQL =
        this.fileReaderService.readFileStringByFileName(getScript('create-app-table'));

      const createWorkspaceTableSql =
        this.fileReaderService.readFileStringByFileName(getScript('create-workspace-table'));

      const createGeneratedApiTableSQl =
        this.fileReaderService.readFileStringByFileName(getScript('create-generated-api-table'));

      const queryInitCoreTable =
        ` BEGIN;
          ${createApplicationTableSQL}
          ${createWorkspaceTableSql}
          ${createGeneratedApiTableSQl}
        COMMIT;
      `
      await typeormDataSource.query(queryInitCoreTable);

      // Todo: If workspace exist - dont create new;
      const isExistedWorkspaceQuery = this.queryBuilder.getByQuery({
        conditions: {
          [EWorkspaceColumns.ID]: command.workspaceId?.toString(),
        }
      });

      const isExitedWorkspaceResult = await typeormDataSource.query(
        isExistedWorkspaceQuery.queryString,
        isExistedWorkspaceQuery.params
      );
      if (isExitedWorkspaceResult[0]) {
        typeormDataSource.destroy();
        return isExitedWorkspaceResult;
      }


      const { params, queryString } = this.queryBuilder.insert({
        [EWorkspaceColumns.ID]: command?.workspaceId,
        [EWorkspaceColumns.DATABASE_CONFIG]: dbConfig,
        [EWorkspaceColumns.OWNER_ID]: command.ownerId,
        [EWorkspaceColumns.CREATED_AT]: new Date(),
        [EWorkspaceColumns.UPDATED_AT]: new Date(),
      });

      const queryResult = await typeormDataSource.query(queryString, params);
      await typeormDataSource?.destroy();
      return Promise.resolve(queryResult);
    } catch (error) {
      this.logger.error(error);
      await typeormDataSource?.destroy();
      return error;
    }
  }
}
