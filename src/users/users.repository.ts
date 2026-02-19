import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, QueryFailedError, Repository } from 'typeorm';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { SortDirection } from '@/common/enums/sortDirection.enum';
import { InfiniteDataResponseType } from '@/common/types/infiniteDataResponse.type';
import { BaseRepository } from '@/common/utils/base.repository';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { User } from './entities/user.entity';
import { FindUserOptions } from './types';
import { IUsersRepository } from './users-repository.interface';

@Injectable()
export class UsersRepository extends BaseRepository implements IUsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource);
  }

  private repo(entityManager?: EntityManager): Repository<User> {
    return this.getRepository(User, entityManager);
  }

  async createNewUser(userData: CreateUserDto): Promise<User> {
    try {
      const entity = this.repo().create(userData);
      return await this.repo().save(entity);
    } catch (e) {
    // Postgres unique violation
      if (e instanceof QueryFailedError && '23505' === (e).driverError?.code) {
        const detail = (e as any).driverError?.detail as string | undefined;

        if (detail?.includes('(login)'))
          throw new ConflictException('Login already taken');
        if (detail?.includes('(email)'))
          throw new ConflictException('Email already taken');

        throw new ConflictException('User already exists');
      }
      throw e;
    }
  }

  async findAllUsers(queryParams: PaginationDto): Promise<InfiniteDataResponseType<User>> {
    const { search, page, limit, sortColumn, sortDirection = SortDirection.Asc } = queryParams;
    const queryBuilder = this.repo().createQueryBuilder('u');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((q) => {
          q.where('u.login ILIKE :s', { s: `%${search}%`})
            .orWhere('u.email ILIKE :s', { s: `%${search}%` });
        })
      );
    }

    const allowedSort = new Set(['createdAt', 'email', 'login', 'age', 'role']);
    const sort = allowedSort.has(sortColumn ?? '') ? sortColumn : 'createdAt';

    queryBuilder.orderBy(`u.${sort}`, sortDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.repo().findOneBy({ id });

    if (!user) {
      this.logger.error(`Could not find user ${id}`);
      throw new NotFoundException(`Could not find user ${id}`);
    }

    return user;
  }

  async findUserByLoginOrEmail(loginOrEmail: string, options: FindUserOptions = {}): Promise<Nullable<User>> {
    const queryBuilder = this.repo().createQueryBuilder('u');

    if (options.select?.password) {
      queryBuilder.addSelect('u.password');
    }

    const user = await queryBuilder
      .where('u.login = :v', { v: loginOrEmail})
      .orWhere('u.email = :v', { v: loginOrEmail})
      .getOne();

    return user;
  }

  async findUserByIdWithRefreshToken(id: string): Promise<User> {
    const qb = this.repo().createQueryBuilder('u');

    qb.addSelect('u.refreshToken');

    const user = await qb.where('u.id = :v', { v: id }).getOne();

    if (!user) {
      this.logger.error(`Could not find user ${id}`);
      throw new NotFoundException(`Could not find user ${id}`);
    }

    return user;
  }

  async updateUserById(id: string, updateData: UpdateUserDto): Promise<User> {
    const userEntity = await this.repo().preload({ id, ...updateData });
    if (!userEntity) {
      this.logger.error(`Could not update user ${id}`);
      throw new NotFoundException(`Could not update user ${id}`);
    }

    return this.repo().save(userEntity);
  }

  async deleteUserById(id: string): Promise<void> {
    const res = await this.repo().softDelete({ id });
    if (!res.affected) {
      throw new NotFoundException(`Could not delete user ${id}`);
    }
  }
}
