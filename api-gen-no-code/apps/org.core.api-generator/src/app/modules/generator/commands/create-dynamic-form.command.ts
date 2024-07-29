import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AST } from 'node-sql-parser';
import { DynamicFormModel } from '../../../core/models/dynamic-form.model';
import format from 'pg-format';
import { ApiAction } from '../../../core/models/generated-api.model';

export class CreateDynamicFormCommand implements ICommand {
  constructor(
    public readonly args: {
      workspaceConnections: DataSourceOptions;
      ownerId: string;
      appId: number;
      tableInfo: AST | AST[];
    },
    public readonly genratedApiInfo: Array<any>
  ) {}
}

@CommandHandler(CreateDynamicFormCommand)
export class CreateDynamicFormCommandHandler
  implements ICommandHandler<CreateDynamicFormCommand>
{
  private readonly logger = new Logger(CreateDynamicFormCommandHandler.name);

  async execute(command: CreateDynamicFormCommand) {
    const { args, genratedApiInfo } = command;

    let typeormDataSource: DataSource;
    try {
      typeormDataSource = await new DataSource(
        args.workspaceConnections
      ).initialize();
      // MaptoModel then create Dynamic menu;
      await typeormDataSource.query(`DELETE FROM _core_dynamic_form`);
      const nestedArray = new Array<any>();
      for (let index = 0; index < command.genratedApiInfo.length; index++) {
        if (command.genratedApiInfo[index].action == ApiAction.INSERT)
          nestedArray.push([
            ...Object.values(
              new DynamicFormModel().convertFromGeneratedAPI(
                command.genratedApiInfo[index]
              )
            ),
          ]);
      }

      const queryString = `
        INSERT INTO _core_dynamic_form (action, title, fields, metadata)
        VALUES %L
      `;
      const query = format(queryString, nestedArray);
      // Postgresql
      const queryResult = await typeormDataSource.query(query);
      console.log(queryResult);
      await typeormDataSource?.destroy();
      return queryResult;
    } catch (error) {
      await typeormDataSource?.destroy();
      this.logger.error(error);
      return error;
    }
  }
}
