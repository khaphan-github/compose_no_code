import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AST } from 'node-sql-parser';
import { DynamicMenuModel } from '../../../core/models/dynamic-menu.model';
import format from 'pg-format';
import { ApiAction } from '../../../core/models/generated-api.model';

export class CreateDynamicMenuCommand implements ICommand {
  constructor(
    public readonly args: {
      workspaceConnections: DataSourceOptions;
      ownerId: string;
      appId: number;
      tableInfo: AST | AST[];
    },
    public readonly apis: Array<any>
  ) {}
}

@CommandHandler(CreateDynamicMenuCommand)
export class CreateDynamicMenuCommandHandler
  implements ICommandHandler<CreateDynamicMenuCommand>
{
  private readonly logger = new Logger(CreateDynamicMenuCommandHandler.name);

  /**LOGIC:
   * Kiểm tra kết nối cơ sở dữ liệu, thực hiện kết nối đến cơ sở dữ liệu tương ứng
   * DOCS: https://orkhan.gitbook.io/typeorm/docs/data-source
   * Need to check when using workspace config to execute query when use API gennergate
   * sql scrip - must be allow select method, and cant not exe data base not in own user
   * */

  async execute(command: CreateDynamicMenuCommand) {
    const { args, apis } = command;

    let typeormDataSource: DataSource;
    try {
      typeormDataSource = await new DataSource(
        args.workspaceConnections
      ).initialize();
      // MaptoModel then create Dynamic menu;
      await typeormDataSource.query(`DELETE FROM _core_dynamic_menu`);

      const nestedArray = new Array<any>();
      for (let index = 0; index < apis.length; index++) {
        if (apis[index].action == ApiAction.INSERT)
          nestedArray.push([
            ...Object.values(
              new DynamicMenuModel().convertFromGeneratedAPI(
                command.apis[index]
              )
            ),
          ]);
      }

      const queryString = `
        INSERT INTO _core_dynamic_menu (displayName, feRoute, icon, metadata)
        VALUES %L
      `;
      const query = format(queryString, nestedArray);
      // Postgresql
      const queryResult = await typeormDataSource.query(query);
      await typeormDataSource?.destroy();
      return queryResult;
    } catch (error) {
      await typeormDataSource?.destroy();
      this.logger.error(error);
      return error;
    }
  }
}
