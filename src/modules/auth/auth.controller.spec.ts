import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { DEFAULT_UNAUTHORIZED_ERROR_MESSAGE } from '../../commons/const';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'employee',
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    signJwt: jest.fn(),
    me: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT if credentials are valid', async () => {
      const loginDto = { email: 'john@example.com', password: 'password' };
      mockAuthService.validateUser.mockResolvedValueOnce(mockUser);
      mockAuthService.signJwt.mockReturnValueOnce({ access_token: 'token' });

      const result = await controller.login(loginDto);
      expect(result).toEqual({ access_token: 'token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.signJwt).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValueOnce(null);

      await expect(
        controller.login({ email: 'x', password: 'y' }),
      ).rejects.toThrow(
        new UnauthorizedException(DEFAULT_UNAUTHORIZED_ERROR_MESSAGE),
      );
    });
  });

  describe('me', () => {
    it('should return current user', () => {
      mockAuthService.me.mockReturnValue('user-data');
      const req = { user: mockUser } as any;
      const result = controller.me(req);
      expect(result).toBe('user-data');
      expect(mockAuthService.me).toHaveBeenCalledWith(mockUser);
    });
  });
});
