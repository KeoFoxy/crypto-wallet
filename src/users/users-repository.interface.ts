import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { InfiniteDataResponseType } from '@/common/types/infiniteDataResponse.type';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { User } from './entities/user.entity';
import { FindUserOptions } from './types';

export abstract class IUsersRepository {
  abstract createNewUser(userData: CreateUserDto): Promise<User>;
  abstract findAllUsers(query: PaginationDto): Promise<InfiniteDataResponseType<User>>;
  abstract findUserById(id: string): Promise<User>;
  abstract updateUserById(id: string, updateData: UpdateUserDto): Promise<User>;
  abstract deleteUserById(id: string): Promise<void>;
  abstract findUserByLoginOrEmail(loginOrEmail: string, options: FindUserOptions): Promise<Nullable<User>>;
  abstract findUserByIdWithRefreshToken(id: string): Promise<User>;
}
