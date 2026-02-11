import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signCreds: Record<string, any>) {
    return this.authService.signIn(signCreds.username, signCreds.password);
  }

  @Get('/profile')
  profile (@Req() req) {
    return req.user;
  }
}
