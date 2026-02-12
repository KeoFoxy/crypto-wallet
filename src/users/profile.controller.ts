import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my')
  my(@Req() req) {
    return this.usersService.findUserById(req.user.id);
  }
}
