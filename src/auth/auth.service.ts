import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { StringValue } from 'ms';
import { RequestUser } from '@/common/types/request.type';
import { hashValue } from '@/common/utils/hashValue';
import { CreateUserDto } from '@/users/dto/createUserDto.dto';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly WITH_PASSWORD = true;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByLogin(username, this.WITH_PASSWORD);

    if (!user) {
      this.logger.log(`User has not been found ${username}`);
      throw new UnauthorizedException('User has not been found!');
    }

    if ('dev' === this.configService.getOrThrow<string>('nodeEnv') && 'admin' === username) {
      return user;
    }

    if (!user?.password) {
      this.logger.error('User does not have a password!');
      throw new UnauthorizedException('User does not have a password!');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      this.logger.error('Incorrect password');
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async register(dto: CreateUserDto) {
    const newUser = await this.usersService.createUser(dto);
    return this.login(newUser);
  }

  async login(user: RequestUser) {
    const payload = this.generatePayload(user);
    const [accessToken, refreshToken] = await this.getTokens(payload);

    const hashedRefreshToken = await hashValue(refreshToken);
    await this.usersService.updateUserRefreshToken(user.id, hashedRefreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async logout(userId: string) {
    return await this.usersService.updateUserRefreshToken(userId, null);
  }

  async refreshToken(token: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: this.configService.getOrThrow<string>('jwtRefreshSecret') });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { sub: id } = payload;

    const user = await this.usersService.getUserByIdWithRefreshToken(id);

    if (!user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await compare(token, user.refreshToken);

    if (!isMatch)
      throw new UnauthorizedException('Invalid refresh token');

    const newPayload = this.generatePayload(user);
    const [accessToken, refreshToken] = await this.getTokens(newPayload);

    const newHashedToken = await hashValue(refreshToken);
    await this.usersService.updateUserRefreshToken(id, newHashedToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async getTokens(payload: JwtPayload): Promise<[string, string]> {
    return await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtAccessSecret'),
        expiresIn: this.configService.get<StringValue>('jwtAccessExpire'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtRefreshSecret'),
        expiresIn: this.configService.get<StringValue>('jwtRefreshExpire'),
      }),
    ]);
  }

  private generatePayload(user: RequestUser): JwtPayload {
    return {
      sub: user.id,
      role: user.role,
      login: user.login,
    };
  }
}
