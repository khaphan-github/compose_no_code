import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConnectToServerDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'kqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCS9'
  })
  secretKey: string;
}
