import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ExecuteScriptDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'SQL script',
    default: `
      CREATE TABLE Category (
        category_id INT PRIMARY KEY,
        category_name VARCHAR(255)
      );
      CREATE TABLE Product (
          product_id INT PRIMARY KEY,
          product_name VARCHAR(255),
          price DECIMAL(10, 2),
          stock_quantity INT,
          category_id INT,
          FOREIGN KEY (category_id) REFERENCES Category(category_id)
      );
    `
  })
  script: string;
}