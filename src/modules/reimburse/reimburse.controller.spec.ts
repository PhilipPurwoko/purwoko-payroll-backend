import { Test, TestingModule } from '@nestjs/testing';
import { ReimburseController } from './reimburse.controller';
import { ReimburseService } from './reimburse.service';
import { CreateReimburseDto } from './dto/create-reimburse.dto';
import { UpdateReimburseDto } from './dto/update-reimburse.dto';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

describe('ReimburseController', () => {
  let controller: ReimburseController;
  let service: ReimburseService;

  const mockUser: UserInterface = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'employee',
  };

  const mockRequest = {
    user: mockUser,
  } as unknown as Request;

  const mockReimburseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReimburseController],
      providers: [
        {
          provide: ReimburseService,
          useValue: mockReimburseService,
        },
      ],
    }).compile();

    controller = module.get<ReimburseController>(ReimburseController);
    service = module.get<ReimburseService>(ReimburseService);
  });

  it('should call create with dto and user', async () => {
    const dto: CreateReimburseDto = { amount: 1000, description: 'Test' };
    const expected = { id: 'r1' };
    mockReimburseService.create.mockResolvedValue(expected);

    const result = await controller.create(dto, mockRequest);

    expect(result).toBe(expected);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should call findAll with user', async () => {
    const expected = [{ id: 'r1' }];
    mockReimburseService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll(mockRequest);

    expect(result).toBe(expected);
    expect(service.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should call findOne with id and user', async () => {
    const expected = { id: 'r1' };
    mockReimburseService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne('r1', mockRequest);

    expect(result).toBe(expected);
    expect(service.findOne).toHaveBeenCalledWith('r1', mockUser);
  });

  it('should call update with id, dto, and user', async () => {
    const dto: UpdateReimburseDto = { amount: 2000 };
    const expected = { id: 'r1', amount: 2000 };
    mockReimburseService.update.mockResolvedValue(expected);

    const result = await controller.update('r1', dto, mockRequest);

    expect(result).toBe(expected);
    expect(service.update).toHaveBeenCalledWith('r1', dto, mockUser);
  });

  it('should call remove with id and user', async () => {
    const expected = { id: 'r1', deletedAt: new Date() };
    mockReimburseService.remove.mockResolvedValue(expected);

    const result = await controller.remove('r1', mockRequest);

    expect(result).toBe(expected);
    expect(service.remove).toHaveBeenCalledWith('r1', mockUser);
  });
});
