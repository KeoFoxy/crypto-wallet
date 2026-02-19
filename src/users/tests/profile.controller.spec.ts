import { Test } from '@nestjs/testing';
import { USERS_MOCK } from '../mocks/users.mock';
import { ProfileController } from '../profile.controller';
import { UsersService } from '../users.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  const usersService = { findUserById: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = moduleRef.get(ProfileController);
    jest.clearAllMocks();
  });

  it('my returns user by current user id', async () => {
    usersService.findUserById.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await expect(controller.my(USERS_MOCK.entities.userWithPassword as any)).resolves.toEqual(
      USERS_MOCK.entities.userPublic
    );

    expect(usersService.findUserById).toHaveBeenCalledWith(USERS_MOCK.ids.userId);
  });
});
