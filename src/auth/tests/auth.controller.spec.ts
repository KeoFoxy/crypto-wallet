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

  it('login -> authService.login(req.user)', async () => {
    const req: any = { user: AUTH_MOCK.requestUser };
    authService.login.mockResolvedValue(AUTH_MOCK.tokens);

    await expect(controller.login(req)).resolves.toEqual(AUTH_MOCK.tokens);
    expect(authService.login).toHaveBeenCalledWith(AUTH_MOCK.requestUser);
  });

  it('register -> authService.register(dto)', async () => {
    authService.register.mockResolvedValue(AUTH_MOCK.tokens);

    await expect(controller.register(AUTH_MOCK.registerBody as any)).resolves.toEqual(AUTH_MOCK.tokens);
    expect(authService.register).toHaveBeenCalledWith(AUTH_MOCK.registerBody);
  });

  it('refresh -> authService.refreshToken(refresh_token)', async () => {
    authService.refreshToken.mockResolvedValue(AUTH_MOCK.tokens);

    await expect(controller.refreshToken(AUTH_MOCK.refreshBody as any)).resolves.toEqual(AUTH_MOCK.tokens);
    expect(authService.refreshToken).toHaveBeenCalledWith(AUTH_MOCK.refreshBody.refresh_token);
  });

  it('logout -> authService.logout(user.id)', async () => {
    const req: any = { user: AUTH_MOCK.requestUser };
    authService.logout.mockResolvedValue(undefined);

    await expect(controller.logout(req)).resolves.toBeUndefined();
    expect(authService.logout).toHaveBeenCalledWith(AUTH_MOCK.requestUser.id);
  });
});
