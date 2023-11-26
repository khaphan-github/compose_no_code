import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ExecutedSQLQueryEvent } from "../events/executed-query.event";

@EventsHandler(ExecutedSQLQueryEvent)
export class ExecutedSQLQueryEventHandler implements IEventHandler<ExecutedSQLQueryEvent> {
  handle(event: ExecutedSQLQueryEvent) {
    // console.log(Object.assign(event, { time: new Date() }));
  }
}
