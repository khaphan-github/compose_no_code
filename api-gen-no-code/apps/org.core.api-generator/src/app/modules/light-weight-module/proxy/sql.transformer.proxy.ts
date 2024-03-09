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
      schema: database,
      token: '0.yxR_tur0KGn_M2irXdBGp1ulDFBcOW4ZExf1uIxp7tkQYtAmFkp8nRpZSsy5mvpFH-y6geGQ2EUyH7-Vr8JJh_KNPh4oMGbHcAjYmA8FsQPu3jz9wyd8Y_OpPCiiH7voMVHdwTS1vBTdH7zmHihHHtsKwgWou59176V6DnixVvNyMX7RqopRhOCfa5q1zf72Pjv5tpADwP-oHDYQ-1FoY7sF-rbYAiUCAxgG8s9tDns94i8SXabSC9E9Iti_HNRCzEBmhRvCn6p6v_B6GjGHXg9OHczOzL65tyWAtZ_KIS8yE9ry3TNOo1iyd59JiDb-xgcWVofzn6M6CTqU5eBZ0T0nzf0ZLg_ej9nniuVD7L9vdGUuGD2wJJq-REPkw8p8RjahYwNGuD_ANPwZs92gfEdFtbt16kYqpm7e7BnTGuDtPyu5hAEyr6oNyCtakLO4ZxuRTj4z8q8H9JK-5x7zBg.5ZCVpmCZfMQ0cQOGJCoyTg.573f5b0643ad07c10ec762f4d5a9d9cfd871cb0c24bac95e6e52229e1b65e276'
    }

    return this.httpService.axiosRef.post(this.SQL_TRANSFORMER_DOMAIN, requestBody);
  }
}
