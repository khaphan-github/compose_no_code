import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateWorkspaceDto {
  @ApiProperty({
    description: `Choose database type to create connections`,
    default: 'postgres'
  })
  @IsNotEmpty()
  database: string;

  // Databsase config.
  @ApiProperty({
    description: `Host of database`,
    default: 'localhost'
  })
  @IsNotEmpty()
  host: string;

  @ApiProperty({
    description: `Host of database`,
    default: 5432
  })
  @IsNotEmpty()
  @IsNumber()
  port: number;

  @ApiProperty({
    description: `Host of database`,
    default: 'admin'
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: `Host of database`,
    default: 'admin'
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: `Host of database`,
    default: 'product'
  })
  @IsNotEmpty()
  databaseName: string;
}