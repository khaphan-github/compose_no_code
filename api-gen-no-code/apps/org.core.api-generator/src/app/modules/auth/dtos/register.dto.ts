import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDTO {
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

  @ApiProperty({
    example: {
      displayName: 'Test displayname',
      email: 'test@gmail.com',
      phone: '01910248198',
    }
  })
  @IsOptional()
  info: object;
}
