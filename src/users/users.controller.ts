import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/role.decorator';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { Role } from '@/common/enums/role.enum';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SuperUser)
  @Post()
  @ApiResponse({ status: 201 })
  async createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(Role.SuperUser)
  @Get()
  @ApiResponse({ status: 200 })
  async getAllUser(@Query() query: PaginationDto) {
    return this.usersService.findAllUser(query);
  }

  @Roles(Role.SuperUser)
  @Get(':id')
  @ApiResponse({ status: 200 })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Roles(Role.SuperUser)
  @Patch(':id')
  @ApiResponse({ status: 200 })
  async updateUserById(@Param('id') id: string, @Body() updateUserData: UpdateUserDto) {
    return await this.usersService.updateUserById(id, updateUserData);
  }

  @Roles(Role.SuperUser)
  @Delete(':id')
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
