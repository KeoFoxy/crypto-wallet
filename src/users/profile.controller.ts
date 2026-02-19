import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/currentUser.decorator';
import { USERS_MOCK } from './mocks/users.mock';
import { UsersService } from './users.service';
import type { RequestUser } from '@/common/types/request.type';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my profile (all fields except hidden columns)' })
  @ApiOkResponse({ schema: { example: USERS_MOCK.entities.userPublic } })
  my(@CurrentUser() user: RequestUser) {
    return this.usersService.findUserById(user.id);
  }
}
