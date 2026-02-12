import { Test } from '@nestjs/testing';
import { hashValue } from '@/common/utils/hashValue';
import { USERS_MOCK } from '../mocks/users.mock';
import { IUsersRepository } from '../users-repository.interface';
import { UsersService } from '../users.service';

jest.mock('@/common/utils/hashValue', () => ({ hashValue: jest.fn() }));

describe('UsersService', () => {
  let service: UsersService;

  const repo = {
    createNewUser: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn(),
    findUserByLoginOrEmail: jest.fn(),
    findUserByIdWithRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: IUsersRepository, useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    jest.clearAllMocks();
  });

  it('createUser hashes password and calls repo.createNewUser', async () => {
    (hashValue as jest.Mock).mockResolvedValue('pass-hash');
    repo.createNewUser.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await expect(service.createUser(USERS_MOCK.dtos.create as any)).resolves.toEqual(USERS_MOCK.entities.userPublic);

    expect(repo.createNewUser).toHaveBeenCalledWith({
      ...USERS_MOCK.dtos.create,
      password: 'pass-hash',
    });
  });

  it('findAllUser delegates to repo.findAllUsers', async () => {
    repo.findAllUsers.mockResolvedValue({ data: [USERS_MOCK.entities.userPublic], total: 1 });

    await expect(service.findAllUser(USERS_MOCK.pagination as any)).resolves.toEqual({
      data: [USERS_MOCK.entities.userPublic],
      total: 1,
    });
  });

  it('updateUserRefreshToken calls updateUserById with refreshToken', async () => {
    repo.updateUserById.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await service.updateUserRefreshToken(USERS_MOCK.ids.userId, 'hash');
    expect(repo.updateUserById).toHaveBeenCalledWith(USERS_MOCK.ids.userId, { refreshToken: 'hash' });
  });
});
