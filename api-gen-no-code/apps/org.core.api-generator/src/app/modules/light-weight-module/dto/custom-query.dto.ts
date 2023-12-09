import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { Where } from "../interfaces/query-builder.interface";

export class CustomQueryDto {
  @ApiProperty({
    description: 'fields là các thuộc tính trong bảng bạn muốn lựa chọn, vui lòng không để trống, hoặc điền: fields: ["*"] nếu muốn chọn tất cả',
    default: ["*"],
    example: ["*"]
  })
  @IsArray()
  @IsNotEmpty({
    message: '*fields* là các thuộc tính trong bảng bạn muốn lựa chọn, vui lòng không để trống, hoặc điền: fields: ["*"] nếu muốn chọn tất cả',
    each: true,
  })
  fields: string[];

  // aggregation?: Aggregation[]
  @IsOptional()
  where?: Where[]

  @IsOptional()
  groupBy?: string[]

  @IsOptional()
  orderBy?: string[]

  @IsOptional()
  misc?: string[];

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  offset?: number = 0;
}
