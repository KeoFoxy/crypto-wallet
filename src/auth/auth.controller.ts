import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refreshDto.dto';
import { RegisterDto } from './dto/registerDto.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import type { Request } from '@/common/types/request.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @HttpCode(201)
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @HttpCode(204)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user.id);
  }
}
