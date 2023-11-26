import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'khapophan123'
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '12312fffD'
  })
  password: string;
}
