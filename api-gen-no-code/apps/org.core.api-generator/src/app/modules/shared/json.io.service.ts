import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonIoService {
  private readonly assetsPath = path.join(__dirname, 'assets');
  private readonly logger = new Logger(JsonIoService.name);

  private getFilePath(fileName: string): string {
    return path.join(this.assetsPath, fileName);
  }

  fileExists(fileName: string): boolean {
    try {
      const filePath = this.getFilePath(fileName);
      return fs.existsSync(filePath);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  readJsonFile<T>(fileName: string): T | null {
    const filePath = this.getFilePath(fileName);
    if (this.fileExists(fileName)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) as T;
    }
    return null; // File doesn't exist
  }

  writeJsonFile<T>(fileName: string, data: T): void {
    const filePath = this.getFilePath(fileName);
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  }
}
