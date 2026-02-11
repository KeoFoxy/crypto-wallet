import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
// import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findUserByLogin(username, true);

    if ('dev' === this.configService.getOrThrow<string>('nodeEnv') && 'admin' === username) {
      return user;
    }

    if (!user) {
      this.logger.log(`User has not been found ${username}`);
      throw new UnauthorizedException('User has not been found!');
    }

    if (!user?.password) {
      this.logger.error('User does not have a password!');
      throw new UnauthorizedException('User does not have a password!');
    }

    const isMatch = await compare(pass, user.password);

    if (!isMatch) {
      this.logger.error('Incorrect password');
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { sub: user.id, username: user.login };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    // return user;
  }

  // private generateJwtPayload(user: User) {

  // }

  // private generateAccessToken(jwtPayload) {}
}
