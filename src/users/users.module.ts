import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSeeder } from './admin.seeder';
import { User } from './entities/user.entity';
import { ProfileController } from './profile.controller';
import { usersRepositoryProvider } from './users-repository.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, usersRepositoryProvider, AdminSeeder],
  exports: [UsersService, usersRepositoryProvider],
})
export class UsersModule {}
