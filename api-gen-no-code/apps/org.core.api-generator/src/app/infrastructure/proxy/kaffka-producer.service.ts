import { Injectable } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  private shouldConnectedToKaffka: boolean;
  constructor() {
    const kaffkaClientId = process.env.KAFFKA_CLIENT_ID
    const kaffkaService = process.env.KAFFKA_SERVICE;

    console.log(`KafkaClientID: ${kaffkaClientId} - KafkaService: ${kaffkaService}`);
    if (kaffkaClientId && kaffkaService) {
      // TOTO: Load in environment
      this.producer = new Kafka({
        clientId: process.env.KAFFKA_CLIENT_ID,
        brokers: [], // Update with your Kafka broker's address
      }).producer();

      this.producer.connect().then(() => {
        this.shouldConnectedToKaffka = true;
        console.log(`Connected to Kafka ${new Date()}`);
      }).catch((err) => {
        console.error(err);
        this.shouldConnectedToKaffka = false;
      });
    } else {
      this.shouldConnectedToKaffka = false;
      console.log(`Unable to connect with kaffka logs`);
    }
  }

  produceMessage(topic: string, message: string) {
    if (this.shouldConnectedToKaffka) {

      const producerRecord: ProducerRecord = {
        topic,
        messages: [{ value: message }],
      };
      console.log(`=> Send message to kafka... ${new Date()}`)
      return this.producer.send(producerRecord);
    } else {
      console.log(`=> Send message to kafka but not connected yet`);
    }
  }
}
