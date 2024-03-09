import { CreateDataCommandHandler } from "./create..command";
import { DeleteDataCommandHandler } from "./delete.command";
import { UpdateDataCommandHandler } from "./update.command";

export const CommandHandlers = [
  CreateDataCommandHandler, // <== DONE
  DeleteDataCommandHandler,
  UpdateDataCommandHandler,
];
