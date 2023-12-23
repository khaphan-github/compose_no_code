import { Injectable } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  constructor() {
    this.producer = new Kafka({
      clientId: 'my-nestjs-app',
      brokers: ['kafkaserver:9092'], // Update with your Kafka broker's address
    }).producer();

    this.producer.connect().then(() => {
      console.log(`Connected to Kafka ${new Date()}`);
    });
  }

  produceMessage(topic: string, message: string) {
    const producerRecord: ProducerRecord = {
      topic,
      messages: [{ value: message }],
    };
    console.log(`=> Send message to kafka... ${new Date()}`)
    return this.producer.send(producerRecord);
  }
}
