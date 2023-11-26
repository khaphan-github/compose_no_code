import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileReaderService {
  private readonly assetsPath = path.join(__dirname, 'assets');

  readFileStringByFileName(fileName: string): string {
    try {
      // Use synchronous file reading for simplicity (asynchronous can also be used)
      const fileContents = fs.readFileSync(path.join(this.assetsPath, fileName), 'utf8');
      return fileContents;
    } catch (error) {
      // Handle any potential errors (e.g., file not found)
      throw new Error(`Error reading file: ${error.message}`);
    }
  }
}
