import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SQLTransformerProxy {
  private readonly SQL_TRANSFORMER_DOMAIN = 'https://hf-inference-ktcmdcmg4q-uc.a.run.app/';
  constructor(
    private readonly httpService: HttpService
  ) { }

  transform(database: string, question: string) {
    const requestBody = {
      question: question,
      schema: database
    }

    return this.httpService.axiosRef.post(this.SQL_TRANSFORMER_DOMAIN, requestBody);
  }
}