import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '1',
    name: 'John',
    email: 'john@example.com',
    password: 'hashed-password',
    role: 'employee',
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user with correct password', async () => {
    mockUserService.findOne.mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

    const result = await service.validateUser({
      email: mockUser.email,
      password: 'plain-password',
    });

    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found', async () => {
    mockUserService.findOne.mockResolvedValueOnce(null);

    const result = await service.validateUser({
      email: 'wrong@example.com',
      password: '123',
    });

    expect(result).toBeNull();
  });

  it('should return null if password does not match', async () => {
    mockUserService.findOne.mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

    const result = await service.validateUser({
      email: mockUser.email,
      password: 'wrong-password',
    });

    expect(result).toBeNull();
  });

  it('should return jwt token in signJwt()', () => {
    const token = service.signJwt(mockUser as any);
    expect(token).toEqual({ access_token: 'jwt-token' });
  });

  it('should return user in me()', () => {
    mockUserService.findOne.mockReturnValue('user-result');
    const result = service.me({ id: '1' } as any);
    expect(result).toBe('user-result');
  });
});
