import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TransformerSerivce } from "../services/transformer.service";
import { SQLTransformerDto } from "../dto/mll.query.dto";
import { ErrorBase, ResponseBase } from "../../../infrastructure/format/response.base";

@Controller('transform')
@ApiTags('Transformer')
export class TransformController {
  constructor(private readonly service: TransformerSerivce) { }

  @Post()
  async transform(@Body() query: SQLTransformerDto) {
    try {
      const queryResult = await this.service.transform(query.question);
      return new ResponseBase(200, `Run custom api success`, { answer: queryResult });
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }

  @Get()
  async getTableName() {
    try {
      const queryResult = await this.service.getAllTableName();
      return new ResponseBase(200, `Get all table name success`, queryResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }
}
