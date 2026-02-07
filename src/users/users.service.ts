import { Injectable, Logger } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { IUsersRepository } from './users-repository.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(createUserData: CreateUserDto) {
    const hashPass = await this.generateHashPass(createUserData.password);

    return this.usersRepository.createNewUser({ ...createUserData, password: hashPass });
  }

  findAllUser(query: PaginationDto) {
    return this.usersRepository.findAllUsers(query);
  }

  findUserById(id: string) {
    return this.usersRepository.findUserById(id);
  }

  updateUserById(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateUserById(id, updateUserDto);
  }

  deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }

  private async generateHashPass (pass: string) {
    const salt = await genSalt();
    return await hash(pass, salt);
  }
}
