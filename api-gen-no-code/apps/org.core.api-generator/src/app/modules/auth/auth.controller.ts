/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserLoginDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ErrorBase, ResponseBase } from '../../infrastructure/format/response.base';
import { RegisterDTO } from './dtos/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Post(`login`)
  async login(@Body() userLoginDto: UserLoginDTO) {
    try {
      const loginResult = await this.service.login(userLoginDto);
      return new ResponseBase(200, `Login successs`, loginResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.UNAUTHORIZED);
    }
  }

  @Post(`register`)
  async register(@Body() register: RegisterDTO) {
    try {
      const registerResult = await this.service.register(register);
      return new ResponseBase(200, `Register successs`, registerResult);
    } catch (error) {
      throw new HttpException(new ErrorBase(error), HttpStatus.BAD_REQUEST);
    }
  }
}
