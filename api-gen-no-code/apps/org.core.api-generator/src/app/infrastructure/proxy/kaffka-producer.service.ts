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
      console.log('Connected to Kafka');
    });
  }

  async produceMessage(topic: string, message: string): Promise<void> {
    const producerRecord: ProducerRecord = {
      topic,
      messages: [{ value: message }],
    };
    console.log(`Send message to kafka...`)
    await this.producer.send(producerRecord);
  }
}
