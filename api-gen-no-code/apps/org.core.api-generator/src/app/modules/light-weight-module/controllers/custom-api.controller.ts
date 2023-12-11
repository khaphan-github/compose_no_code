import { Body, Controller, Param, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "../interceptor/logging.interceptor";
import { TablePermissionInterceptor } from "../interceptor/table-permission.interceptor";
import { LightWeightService } from "../services/light-weight.service";

@Controller('custom/:path')
@ApiTags('Custom controller')
@UseInterceptors(LoggingInterceptor)
@UseInterceptors(TablePermissionInterceptor)

export class CustomController {
  constructor(private readonly service: LightWeightService) { }

  @Post()
  runCustomController(
    @Param('path') path: string,
    @Body() body: object
  ) {
    return this.service.executeCustomApi(path, body);
  }
}
