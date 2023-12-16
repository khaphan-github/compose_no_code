import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';
import IsolatedVM from 'isolated-vm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('test')
  tes() {

    const snapshot = IsolatedVM.Isolate.createSnapshot([{
      code: `
    function sum(args) {
      const result = args?.a + args?.b;
      return JSON.stringify({ c: result }) }
    `}]);
    const isolate = new IsolatedVM.Isolate({ memoryLimit: 8 /* MB */, snapshot: snapshot });
    const script = isolate.compileScriptSync('sum({a:1,b:3})');
    const context = isolate.createContextSync();
    const result = script.runSync(context)
    console.log(result);
    return JSON.parse(result);
  }
}
