import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { ConditionObject, JoinTable, SortType } from '../../../core/pgsql/pg.relationaldb.query-builder';

export class RequestParamDataDto {
  @ApiProperty({
    description: 'This is appId you created before create schema',
    default: '44',
    example: 44
  })
  @IsString()
  @IsNotEmpty()
  appid: string;

  @ApiProperty({
    description: 'This is schema you created',
    default: 'swagger_test',
  })
  @IsString()
  @IsNotEmpty()
  schema: string;
}

export class QueryParamDataDto {
  @ApiProperty({
    description: `
      Array of attribute you want select,
      example your product table have 2 attribute: name, id.
      you an input [name] or [id] to get return value,
      Default select all;
    `,
  })
  @IsOptional()
  selects?: Array<string>;

  @ApiProperty({
    description: 'Case data have alots you need pagination',
    default: '1',
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Limit number of record you want to get',
    default: '10',
  })
  @IsOptional()
  size?: number;

  @ApiProperty({
    description: 'Other by attribute you check to sort.',
    default: 'id',
  })
  @IsOptional()
  orderby?: string;

  @ApiProperty({
    description: 'Sort attribute follow [desc] to descending and [asc] to ascending by default',
    default: 'ASC',
  })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sort?: SortType;

  @ApiProperty({
    description: 'Enable cahing data is true, default is false',
    default: false,
  })
  @IsOptional()
  cahing?: boolean;
}


export class ConditionDto {
  @IsOptional()
  @ApiProperty({
    description: 'Điều kiện để truy vấn trên một bảng',
    example: {
      "or": [
        {
          "and": [
            { "auth": "isAuth" },
            { "method": "POST" }
          ]
        },
        {
          "or": [
            { "method": "POST" },
            { "method": "GET" }
          ]
        }
      ]

    },
  })
  condition?: ConditionObject;

  @IsOptional()
  @ApiProperty({
    description: 'Điều kiện join bảng ',
    example: {
      withTableName: 'product', // Table name
      mainColumnKey: 'id',
      childColumnKey: 'id',
      selectColumns: ['id', 'name'],
    },
  })
  joinTables?: JoinTable[];
}
