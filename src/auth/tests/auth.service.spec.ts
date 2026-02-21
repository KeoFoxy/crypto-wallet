import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { compare } from 'bcrypt';
import { hashValue } from '@/common/utils/hashValue';
import { USERS_MOCK } from '@/users/mocks/users.mock';
import { UsersService } from '@/users/users.service';
import { AuthService } from '../auth.service';

import { AUTH_MOCK } from '../mocks/auth.mock';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));
jest.mock('@/common/utils/hashValue', () => ({ hashValue: jest.fn() }));


describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findUserByLogin: jest.fn(),
    createUser: jest.fn(),
    updateUserRefreshToken: jest.fn(),
    getUserByIdWithRefreshToken: jest.fn(),
  };

  const configService = {
    getOrThrow: jest.fn((k: string) => {
      const map: Record<string, any> = {
        nodeEnv: 'test',
        jwtAccessSecret: 'access-secret',
        jwtRefreshSecret: 'refresh-secret',
        jwtAccessExpire: '15m',
        jwtRefreshExpire: '7d',
      };
      return map[k];
    }),
    get: jest.fn((k: string) => {
      const map: Record<string, any> = {
        jwtAccessSecret: 'access-secret',
        jwtRefreshSecret: 'refresh-secret',
        jwtAccessExpire: '15m',
        jwtRefreshExpire: '7d',
      };
      return map[k];
    }),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: ConfigService, useValue: configService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    jest.clearAllMocks();
  });

  it('validateUser throws if user not found', async () => {
    usersService.findUserByLogin.mockResolvedValue(null);
    await expect(service.validateUser('x', 'y')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('validateUser returns user if bcrypt match', async () => {
    usersService.findUserByLogin.mockResolvedValue(USERS_MOCK.entities.userWithPassword);
    (compare as jest.Mock).mockResolvedValue(true);

    await expect(service.validateUser('user1', 'ok')).resolves.toEqual(USERS_MOCK.entities.userWithPassword);
  });

  it('login returns tokens and stores hashed refresh', async () => {
    jwtService.signAsync
      .mockResolvedValueOnce(AUTH_MOCK.tokens.access_token)
      .mockResolvedValueOnce(AUTH_MOCK.tokens.refresh_token);

    (hashValue as jest.Mock).mockResolvedValue('refresh-hash');

    await expect(service.login(AUTH_MOCK.requestUser)).resolves.toEqual(AUTH_MOCK.tokens);
    expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(AUTH_MOCK.requestUser.id, 'refresh-hash');
  });

  it('register creates user and returns tokens', async () => {
    usersService.createUser.mockResolvedValue(USERS_MOCK.entities.userPublic);
    jwtService.signAsync
      .mockResolvedValueOnce(AUTH_MOCK.tokens.access_token)
      .mockResolvedValueOnce(AUTH_MOCK.tokens.refresh_token);
    (hashValue as jest.Mock).mockResolvedValue('refresh-hash');

    await expect(service.register(USERS_MOCK.dtos.create as any)).resolves.toEqual(AUTH_MOCK.tokens);
  });

  it('refreshToken rotates tokens when refresh valid', async () => {
    jwtService.verifyAsync.mockResolvedValue({ sub: USERS_MOCK.ids.userId, login: 'user1', role: 'User' });
    usersService.getUserByIdWithRefreshToken.mockResolvedValue(USERS_MOCK.entities.userWithRefreshToken);

    (compare as jest.Mock).mockResolvedValue(true);

    jwtService.signAsync
      .mockResolvedValueOnce('new-access')
      .mockResolvedValueOnce('new-refresh');
    (hashValue as jest.Mock).mockResolvedValue('new-refresh-hash');

    await expect(service.refreshToken('refresh-plain')).resolves.toEqual({
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    });

    expect(usersService.updateUserRefreshToken).toHaveBeenCalledWith(USERS_MOCK.ids.userId, 'new-refresh-hash');
  });
});
