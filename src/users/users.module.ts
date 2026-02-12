import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfileController } from './profile.controller';
import { usersRepositoryProvider } from './users-repository.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, usersRepositoryProvider],
  exports: [UsersService, usersRepositoryProvider],
})
export class UsersModule {}
