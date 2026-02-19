import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AUTH_MOCK } from '../mocks/auth.mock';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = moduleRef.get(AuthController);
    jest.clearAllMocks();
  });

  it('login -> authService.login(user)', async () => {
    authService.login.mockResolvedValue(AUTH_MOCK.tokens);

    await expect(controller.login(AUTH_MOCK.requestUser as any)).resolves.toEqual(AUTH_MOCK.tokens);

    expect(authService.login).toHaveBeenCalledWith(AUTH_MOCK.requestUser);
  });

  it('logout -> authService.logout(user.id)', async () => {
    authService.logout.mockResolvedValue(undefined);

    await expect(controller.logout(AUTH_MOCK.requestUser as any)).resolves.toBeUndefined();
    expect(authService.logout).toHaveBeenCalledWith(AUTH_MOCK.requestUser.id);
  });
});
