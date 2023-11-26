import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SQLTransformerDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'How many product in my system?',
  })
  question: string;
}