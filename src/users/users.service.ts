import { Injectable, Logger } from '@nestjs/common';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { hashValue } from '@/common/utils/hashValue';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './entities/user.entity';
import { IUsersRepository } from './users-repository.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: IUsersRepository) {}

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
