import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { hashValue } from '@/common/utils/hashValue';
import { USERS_MOCK } from '../mocks/users.mock';
import { IUsersRepository } from '../users-repository.interface';
import { UsersService } from '../users.service';

jest.mock('@/common/utils/hashValue', () => ({
  hashValue: jest.fn(),
}));

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

  const configMock = {
    getOrThrow: jest.fn((key: string) => {
      const map: Record<string, any> = {
        nodeEnv: 'test',
        ADMIN_LOGIN: 'admin',
        ADMIN_EMAIL: 'admin@test.com',
        ADMIN_PASSWORD: 'Str0ngP@ssw0rd!',
      };
      return map[key];
    }),
    get: jest.fn((key: string) => {
      const map: Record<string, any> = {
        nodeEnv: 'test',
        ADMIN_LOGIN: 'admin',
        ADMIN_EMAIL: 'admin@test.com',
        ADMIN_PASSWORD: 'Str0ngP@ssw0rd!',
      };
      return map[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: IUsersRepository, useValue: repo },
        { provide: ConfigService, useValue: configMock },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('createUser hashes password and calls repo.createNewUser', async () => {
    (hashValue as jest.Mock).mockResolvedValue('pass-hash');
    repo.createNewUser.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await expect(service.createUser(USERS_MOCK.dtos.create as any)).resolves.toEqual(
      USERS_MOCK.entities.userPublic
    );

    expect(hashValue).toHaveBeenCalledWith(USERS_MOCK.dtos.create.password);
    expect(repo.createNewUser).toHaveBeenCalledWith({
      ...USERS_MOCK.dtos.create,
      password: 'pass-hash',
    });
  });

  it('findAllUsers delegates to repo.findAllUsers', async () => {
    repo.findAllUsers.mockResolvedValue({ data: [USERS_MOCK.entities.userPublic], total: 1 });

    await expect(service.findAllUsers(USERS_MOCK.pagination as any)).resolves.toEqual({
      data: [USERS_MOCK.entities.userPublic],
      total: 1,
    });

    expect(repo.findAllUsers).toHaveBeenCalledWith(USERS_MOCK.pagination);
  });

  it('updateUserRefreshToken calls updateUserById with refreshToken', async () => {
    repo.updateUserById.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await service.updateUserRefreshToken(USERS_MOCK.ids.userId, 'hash');

    expect(repo.updateUserById).toHaveBeenCalledWith(USERS_MOCK.ids.userId, {
      refreshToken: 'hash',
    });
  });

  it('getUserByIdWithRefreshToken delegates to repo.findUserByIdWithRefreshToken', async () => {
    repo.findUserByIdWithRefreshToken.mockResolvedValue(USERS_MOCK.entities.userWithRefreshToken);

    await expect(service.getUserByIdWithRefreshToken(USERS_MOCK.ids.userId)).resolves.toEqual(
      USERS_MOCK.entities.userWithRefreshToken
    );

    expect(repo.findUserByIdWithRefreshToken).toHaveBeenCalledWith(USERS_MOCK.ids.userId);
  });

  it('findUserByLogin delegates to repo.findUserByLoginOrEmail', async () => {
    repo.findUserByLoginOrEmail.mockResolvedValue(USERS_MOCK.entities.userPublic);

    await expect(service.findUserByLogin(USERS_MOCK.entities.userPublic.login, false)).resolves.toEqual(
      USERS_MOCK.entities.userPublic
    );

    expect(repo.findUserByLoginOrEmail).toHaveBeenCalledWith(USERS_MOCK.entities.userPublic.login, false);
  });
});
