import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { Role } from '@/common/enums/role.enum';
import { hashValue } from '@/common/utils/hashValue';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './entities/user.entity';
import { IUsersRepository } from './users-repository.interface';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const env = this.configService.get<string>('nodeEnv');
    if (env !== 'dev') return;

    const login = this.configService.get<string>('ADMIN_LOGIN');
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');

    if (!login || !email || !password) {
      this.logger.log('Admin seed skipped: ADMIN_* env not set');
      return;
    }

    try {
      const exists = await this.findUserByLogin(login);
      if (exists) return;

      await this.createUser({
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

  async createUser(createUserData: CreateUserDto) {
    const hashPass = await hashValue(createUserData.password);

    return await this.usersRepository.createNewUser({ ...createUserData, password: hashPass });
  }

  async findAllUser(query: PaginationDto) {
    return await this.usersRepository.findAllUsers(query);
  }

  async findUserByLogin(login: string, withPass: boolean = false) {
    return await this.usersRepository.findUserByLoginOrEmail(login, withPass);
  }

  async findUserById(id: string) {
    return await this.usersRepository.findUserById(id);
  }

  async updateUserById(id: string, updateUserDto: Partial<User>) {
    return await this.usersRepository.updateUserById(id, updateUserDto);
  }

  async deleteUserById(id: string) {
    return await this.usersRepository.deleteUserById(id);
  }

  async updateUserRefreshToken(userId: string, token?: Nullable<string>) {
    return await this.updateUserById(userId, { refreshToken: token });
  }

  async getUserByIdWithRefreshToken(userId: string) {
    return await this.usersRepository.findUserByIdWithRefreshToken(userId);
  }
}
