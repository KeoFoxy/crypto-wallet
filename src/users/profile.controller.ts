import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USERS_MOCK } from './mocks/users.mock';
import { UsersService } from './users.service';
import type { Request } from '@/common/types/request.type';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my profile (all fields except hidden columns)' })
  @ApiOkResponse({ schema: { example: USERS_MOCK.entities.userPublic } })
  my(@Req() req: Request) {
    return this.usersService.findUserById(req.user.id);
  }
}
