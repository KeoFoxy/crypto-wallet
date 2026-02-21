import { Role } from '@/common/enums/role.enum';
import { SortDirection } from '@/common/enums/sortDirection.enum';
import type { CreateUserDto } from '../dto/createUserDto.dto';
import type { UpdateUserDto } from '../dto/updateUserDto.dto';
import type { User } from '../entities/user.entity';
import type { PaginationDto } from '@/common/dtos/paginationDto.dto';
import type { InfiniteDataResponseType } from '@/common/types/infiniteDataResponse.type';

export const USERS_MOCK = {
  ids: {
    userId: '3f1a5df0-7c35-4a12-9b5e-2d5b3b4dca11',
  },

  dtos: {
    create: {
      email: 'user1@example.com',
      login: 'user1',
      password: 'Str0ngP@ssw0rd!',
      age: 25,
      description: 'Hello! I am user1',
      role: Role.User,
    } satisfies CreateUserDto,

    update: {
      description: 'Updated description',
    } satisfies UpdateUserDto,
  },

  pagination: {
    search: 'user',
    page: 1,
    limit: 10,
    sortColumn: 'createdAt',
    sortDirection: SortDirection.Desc,
  } satisfies PaginationDto,

  entities: {
    // публичная форма (без password/refreshToken)
    userPublic: {
      id: '3f1a5df0-7c35-4a12-9b5e-2d5b3b4dca11',
      email: 'user1@example.com',
      login: 'user1',
      role: Role.User,
      age: 25,
      description: 'Hello! I am user1',
      createdAt: new Date('2026-02-13T00:00:00.000Z'),
      updatedAt: new Date('2026-02-13T00:00:00.000Z'),
      isDeleted: null,
      refreshToken: null,
    } as unknown as User,

    userWithPassword: {
      id: '3f1a5df0-7c35-4a12-9b5e-2d5b3b4dca11',
      email: 'user1@example.com',
      login: 'user1',
      role: Role.User,
      password: '$2b$10$mockedbcrypthash',
      age: 25,
      description: 'Hello! I am user1',
      createdAt: new Date('2026-02-13T00:00:00.000Z'),
      updatedAt: new Date('2026-02-13T00:00:00.000Z'),
      isDeleted: null,
      refreshToken: null,
    } as unknown as User,

    userWithRefreshToken: {
      id: '3f1a5df0-7c35-4a12-9b5e-2d5b3b4dca11',
      email: 'user1@example.com',
      login: 'user1',
      role: Role.User,
      age: 25,
      description: 'Hello! I am user1',
      createdAt: new Date('2026-02-13T00:00:00.000Z'),
      updatedAt: new Date('2026-02-13T00:00:00.000Z'),
      isDeleted: null,
      refreshToken: '$2b$10$mockedRefreshHash',
    } as unknown as User,
  },

  listResponse: {
    data: [] as User[],
    total: 0,
  } as InfiniteDataResponseType<User>,
};
