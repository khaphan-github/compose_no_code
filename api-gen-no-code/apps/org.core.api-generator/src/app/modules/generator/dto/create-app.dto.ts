import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateApplicationDto {
  @ApiProperty({
    description: `Choose database type to create connections`,
    default: 'postgres'
  })
  @IsNotEmpty()
  workspaceId: number;

  @ApiProperty({
    description: `Choose database type to create connections`,
    default: 'postgres'
  })
  @IsNotEmpty()
  appName: string;

  @ApiProperty({
    description: `Choose database type to create connections`,
    default: true
  })
  @IsNotEmpty()
  useDefaultDb: boolean;

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
  @IsOptional()
  host: string;

  @ApiProperty({
    description: `Host of database`,
    default: 5432
  })
  @IsOptional()
  port: number;

  @ApiProperty({
    description: `Host of database`,
    default: 'admin'
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    description: `Host of database`,
    default: 'admin'
  })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: `Host of database`,
    default: 'product'
  })
  @IsOptional()
  databaseName: string;
}