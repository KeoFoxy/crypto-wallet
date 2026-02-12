import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refreshDto.dto';
import { RegisterDto } from './dto/registerDto.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AUTH_MOCK } from './mocks/auth.mock';
import type { Request } from '@/common/types/request.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login (LocalStrategy). Returns access & refresh tokens' })
  @ApiBody({
    schema: { example: AUTH_MOCK.loginBody },
  })
  @ApiOkResponse({
    schema: { example: AUTH_MOCK.tokens },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Public()
  @HttpCode(201)
  @Post('register')
  @ApiOperation({ summary: 'Register. Returns access & refresh tokens' })
  @ApiBody({ type: RegisterDto, examples: { default: { value: AUTH_MOCK.registerBody } } as any })
  @ApiCreatedResponse({
    schema: { example: AUTH_MOCK.tokens },
  })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens (rotation). Returns new access & refresh' })
  @ApiBody({ type: RefreshDto, examples: { default: { value: AUTH_MOCK.refreshBody } } as any })
  @ApiOkResponse({
    schema: { example: AUTH_MOCK.tokens },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  refreshToken(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @HttpCode(204)
  @Post('logout')
  @ApiOperation({ summary: 'Logout (revoke refresh token in DB)' })
  @ApiNoContentResponse({ description: 'Logged out' })
  logout(@Req() req: Request) {
    return this.authService.logout(req.user.id);
  }
}
