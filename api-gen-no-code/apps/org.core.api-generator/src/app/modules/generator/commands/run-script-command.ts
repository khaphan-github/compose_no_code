import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from "typeorm";

export class RunScriptCommand {
  constructor(
    public readonly workspaceConnections: DataSourceOptions,
    public readonly script: string
  ) { }
}

@CommandHandler(RunScriptCommand)
export class RunScriptCommandHandler
  implements ICommandHandler<RunScriptCommand>
{

  private readonly logger = new Logger(RunScriptCommandHandler.name);

  /**LOGIC:
   * Kiểm tra kết nối cơ sở dữ liệu, thực hiện kết nối đến cơ sở dữ liệu tương ứng
   * DOCS: https://orkhan.gitbook.io/typeorm/docs/data-source
   * Need to check when using workspace config to execute query when use API gennergate
   * sql scrip - must be allow select method, and cant not exe data base not in own user
   * */

  async execute(command: RunScriptCommand) {
    const { script, workspaceConnections } = command;

    let typeormDataSource: DataSource;
    try {
      typeormDataSource = await new DataSource(workspaceConnections).initialize();
      const queryResult = await typeormDataSource.query(script);
      await typeormDataSource?.destroy();
      return queryResult;
    } catch (error) {
      await typeormDataSource?.destroy();
      this.logger.error(error);
      return error;
    }
  }
}
