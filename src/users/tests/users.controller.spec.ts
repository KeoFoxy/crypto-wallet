import { Test } from '@nestjs/testing';
import { USERS_MOCK } from '../mocks/users.mock';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersService = {
    createUser: jest.fn(),
    findAllUser: jest.fn(),
    findUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = moduleRef.get(UsersController);
    jest.clearAllMocks();
  });

  it('createNewUser calls service', async () => {
    usersService.createUser.mockResolvedValue(USERS_MOCK.entities.userPublic);
    await expect(controller.createNewUser(USERS_MOCK.dtos.create as any)).resolves.toEqual(USERS_MOCK.entities.userPublic);
  });

  it('getAllUser calls service', async () => {
    usersService.findAllUser.mockResolvedValue({ data: [USERS_MOCK.entities.userPublic], total: 1 });
    await expect(controller.getAllUser(USERS_MOCK.pagination as any)).resolves.toEqual({
      data: [USERS_MOCK.entities.userPublic],
      total: 1,
    });
  });

  it('getUserById calls service', async () => {
    usersService.findUserById.mockResolvedValue(USERS_MOCK.entities.userPublic);
    await expect(controller.getUserById(USERS_MOCK.ids.userId)).resolves.toEqual(USERS_MOCK.entities.userPublic);
  });

  it('updateUserById calls service', async () => {
    usersService.updateUserById.mockResolvedValue({ ...USERS_MOCK.entities.userPublic, ...USERS_MOCK.dtos.update });
    await expect(controller.updateUserById(USERS_MOCK.ids.userId, USERS_MOCK.dtos.update as any)).resolves.toEqual({
      ...USERS_MOCK.entities.userPublic,
      ...USERS_MOCK.dtos.update,
    });
  });

  it('deleteUserById calls service', async () => {
    usersService.deleteUserById.mockResolvedValue(undefined);
    await expect(controller.deleteUserById(USERS_MOCK.ids.userId)).resolves.toBeUndefined();
  });
});
