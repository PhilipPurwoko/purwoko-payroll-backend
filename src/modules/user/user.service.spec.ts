import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UserInterface } from '../../interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('../../util/date.util', () => {
  const moment = require('moment');
  return {
    m: () => moment.utc('2025-06-15T00:00:00Z'),
    parseTimeToDate: jest.fn(),
  };
});

describe('UserService', () => {
  let service: UserService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfig = {
    get: jest.fn().mockReturnValue('10'),
  };

  const actor = <UserInterface>{ id: 'admin-id' };
  const userDto = <CreateUserDto>{
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService) as any;
  });

  it('should create a user', async () => {
    mockPrisma.user.create.mockResolvedValue({ id: '1', ...userDto });

    const result = await service.create(userDto, actor);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ email: userDto.email }));
  });

  it('should return all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: '1', ...userDto }]);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it('should find one user', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ id: '1', ...userDto });

    const result = await service.findOne('1');
    expect(result).toEqual(expect.objectContaining({ email: userDto.email }));
  });

  it('should update a user', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ id: '1', ...userDto });
    mockPrisma.user.update.mockResolvedValue({ id: '1', ...userDto });

    const result = await service.update('1', { name: 'Updated' }, actor);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: '1' }));
  });

  it('should remove a user', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ id: '1', ...userDto });
    mockPrisma.user.update.mockResolvedValue({
      id: '1',
      deletedAt: new Date(),
    });

    const result = await service.remove('1', actor);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(result).toHaveProperty('deletedAt');
  });

  it('should throw if user not found for update', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(service.update('missing-id', {}, actor)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if user not found for remove', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(service.remove('missing-id', actor)).rejects.toThrow(
      NotFoundException,
    );
  });
});
