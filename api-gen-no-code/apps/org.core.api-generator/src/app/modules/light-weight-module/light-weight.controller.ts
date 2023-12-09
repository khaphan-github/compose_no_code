import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { LightWeightService } from './services/light-weight.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseBase, ErrorBase } from '../../infrastructure/format/response.base';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { CustomQueryDto } from './dto/custom-query.dto';
import { TablePermissionInterceptor } from './interceptor/table-permission.interceptor';

@Controller('schema/:schema')
@ApiTags('CRUD light weight operator')
@UseInterceptors(new LoggingInterceptor())
@UseInterceptors(new TablePermissionInterceptor())

export class LightWeightController {
  constructor(private readonly service: LightWeightService) { }

  @Post('query')
  async query(
    @Param('schema') schema: string,
    @Body() query: CustomQueryDto
  ) {
    try {
      const queryResult = await this.service.query({ ...query, from: schema });
      return new ResponseBase(200, `Query data from table ${schema} success`, queryResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }

  @Delete(':id')
  async deleteById(
    @Param('schema') schema: string,
    @Param('id') id: string,
    @Query('id_column') column: string
  ) {
    try {
      const deleteResult = await this.service.delete(schema, id, column);
      return new ResponseBase(204, `Delete data from table ${schema} success`, { deleteResult });
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }

  @Post()
  async insert(
    @Param('schema') schema: string,
    @Body() data: Array<object>
  ) {
    try {
      const insertResult = await this.service.insert(schema, data);
      return new ResponseBase(201, `Insert data to table ${schema} success`, insertResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }

  @Put()
  async update(
    @Param('schema') schema: string,
    @Query('id_column') idColumn: string,
    @Body() data: object
  ) {
    try {
      const updateResult = await this.service.update(schema, idColumn, data);
      return new ResponseBase(200, `Update data to table ${schema} success`, updateResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }

  @Get(":id")
  async findById(
    @Param('schema') schema: string,
    @Param('id') id: string,
    @Query('fields') fields: Array<string>,
    @Query('id_column') idColumn: string,
  ) {
    try {
      const findOneResult = await this.service.findById(schema, fields, idColumn, id);
      if(findOneResult) {
        return new ResponseBase(200, `Found record with id ${id} at ${schema}`, findOneResult);
      }
      return new ResponseBase(404, `Not found record with id ${id} at ${schema}`, findOneResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.OK);
    }
  }
}

