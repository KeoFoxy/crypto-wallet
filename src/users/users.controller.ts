import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/role.decorator';
import { PaginationDto } from '@/common/dtos/paginationDto.dto';
import { Role } from '@/common/enums/role.enum';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { USERS_MOCK } from './mocks/users.mock';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SuperUser)
  @Post()
  @ApiOperation({ summary: 'Create user (SuperUser only)' })
  @ApiBody({ type: CreateUserDto, examples: { default: { value: USERS_MOCK.dtos.create } } as any })
  @ApiResponse({ status: 201, schema: { example: USERS_MOCK.entities.userPublic } })
  @ApiForbiddenResponse({ description: 'Forbidden (role mismatch)' })
  createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(Role.SuperUser)
  @Get()
  @ApiOperation({ summary: 'Get users list with pagination (SuperUser only)' })
  @ApiQuery({ name: 'search', required: false, example: USERS_MOCK.pagination.search })
  @ApiQuery({ name: 'page', required: false, example: USERS_MOCK.pagination.page })
  @ApiQuery({ name: 'limit', required: false, example: USERS_MOCK.pagination.limit })
  @ApiQuery({ name: 'sortColumn', required: false, example: USERS_MOCK.pagination.sortColumn })
  @ApiQuery({ name: 'sortDirection', required: false, example: USERS_MOCK.pagination.sortDirection })
  @ApiOkResponse({
    schema: { example: { data: [USERS_MOCK.entities.userPublic], total: 1 } },
  })
  @ApiForbiddenResponse({ description: 'Forbidden (role mismatch)' })
  getAllUser(@Query() query: PaginationDto) {
    return this.usersService.findAllUser(query);
  }

  @Roles(Role.SuperUser)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id (SuperUser only)' })
  @ApiParam({ name: 'id', example: USERS_MOCK.ids.userId })
  @ApiOkResponse({ schema: { example: USERS_MOCK.entities.userPublic } })
  @ApiForbiddenResponse({ description: 'Forbidden (role mismatch)' })
  getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Roles(Role.SuperUser)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id (SuperUser only)' })
  @ApiParam({ name: 'id', example: USERS_MOCK.ids.userId })
  @ApiBody({ type: UpdateUserDto, examples: { default: { value: USERS_MOCK.dtos.update } } as any })
  @ApiOkResponse({ schema: { example: { ...USERS_MOCK.entities.userPublic, ...USERS_MOCK.dtos.update } } })
  @ApiForbiddenResponse({ description: 'Forbidden (role mismatch)' })
  updateUserById(@Param('id') id: string, @Body() updateUserData: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserData);
  }

  @Roles(Role.SuperUser)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id (SuperUser only)' })
  @ApiParam({ name: 'id', example: USERS_MOCK.ids.userId })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiForbiddenResponse({ description: 'Forbidden (role mismatch)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
