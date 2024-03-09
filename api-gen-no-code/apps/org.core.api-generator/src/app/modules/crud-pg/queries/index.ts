import { GetAppInfoByAppIdHandler } from "./get-app-info-by-app-id.query";
import { GetDataQueryHandler } from "./get-by-conditions.query";
import { GetSchemaStructureQueryHandler } from "./get-schema-structure.query";

export const QueryHandlers = [
  GetDataQueryHandler, // <-- DONE
  GetSchemaStructureQueryHandler,
  GetAppInfoByAppIdHandler,
];
