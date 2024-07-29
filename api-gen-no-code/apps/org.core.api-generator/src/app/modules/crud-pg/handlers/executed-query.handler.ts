import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ExecutedSQLQueryEvent } from "../events/executed-query.event";
import { KafkaProducerService } from "../../../infrastructure/proxy/kaffka-producer.service";

@EventsHandler(ExecutedSQLQueryEvent)
export class ExecutedSQLQueryEventHandler implements IEventHandler<ExecutedSQLQueryEvent> {
  constructor(private readonly kafka: KafkaProducerService) { }
  handle(event: ExecutedSQLQueryEvent) {
    console.log(JSON.stringify(Object.assign(event, { time: new Date() }), null, 2))
    this.kafka.produceMessage(
      'uat.catalogue.item',
      JSON.stringify(Object.assign(event, { time: new Date() })));
  }
}
