import { Body, Controller, HttpException, HttpStatus, Param, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "../interceptor/logging.interceptor";
import { TablePermissionInterceptor } from "../interceptor/table-permission.interceptor";
import { LightWeightService } from "../services/light-weight.service";
import { ErrorBase, ResponseBase } from "../../../infrastructure/format/response.base";

@Controller('custom/:path')
@ApiTags('Custom controller')
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TablePermissionInterceptor)

export class CustomController {
  constructor(private readonly service: LightWeightService) { }

  @Post()
  async runCustomController(
    @Param('path') path: string,
    @Body() body: object
  ) {
    try {
      const queryResult = await this.service.executeCustomApi(path, body);
      return new ResponseBase(200, `Run custom api success`, queryResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }
}
