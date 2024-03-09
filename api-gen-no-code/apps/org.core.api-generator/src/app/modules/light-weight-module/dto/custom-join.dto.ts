import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class JoinConditionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fromField: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toField: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  operator: string; // You might want to define a specific set of allowed operators
}

export class JoinOperatorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  operator: string; // You might want to define a specific set of allowed operators

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  condition: JoinConditionDto;
}

export class AggregationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  args: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  alias: string;
}

export class WhereDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  operator: string; // You might want to define a specific set of allowed operators

  @ApiProperty()
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty()
  @IsNotEmpty()
  value: any;

  @ApiProperty()
  @IsOptional()
  conditions?: WhereDto[];
}

export class JoinQueryDto {
  @ApiProperty()
  @IsArray()
  fields: { table: string; fields: string[] }[];

  @ApiProperty()
  @IsArray()
  joins: JoinOperatorDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  aggregation?: AggregationDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  where?: WhereDto[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  groupBy?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  orderBy?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  misc?: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  offset?: number = 0;
}
