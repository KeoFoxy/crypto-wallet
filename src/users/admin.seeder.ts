import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@/common/enums/role.enum';
import { AdminUserEnvType } from '@/configs/types';
import { UsersService } from './users.service';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  async onModuleInit() {
    const env = this.configService.get<string>('nodeEnv');
    if (env !== 'dev') return;

    const {
      login,
      email,
      password,
    } = this.configService.getOrThrow<AdminUserEnvType>('admin');

    if (!login || !email || !password) {
      this.logger.warn('Admin seed skipped: ADMIN_* env not set');
      return;
    }

    try {
      const exists = await this.usersService.findUserByLogin(login);
      if (exists) return;

      await this.usersService.createUser({
        login,
        email,
        password,
        age: 30,
        description: 'Seeded super user',
        role: Role.SuperUser,
      });

      this.logger.log(`Seeded SuperUser: ${login}`);
    } catch (e) {
      this.logger.warn(`Admin seed failed (probably migrations not applied yet): ${e?.message ?? e}`);
    }
  }
};
