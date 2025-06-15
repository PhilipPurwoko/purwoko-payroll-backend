import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeController } from './overtime.controller';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

describe('OvertimeController', () => {
  let controller: OvertimeController;
  let service: OvertimeService;

  const mockUser = { id: 'user-1' };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeController],
      providers: [{ provide: OvertimeService, useValue: mockService }],
    }).compile();

    controller = module.get<OvertimeController>(OvertimeController);
    service = module.get<OvertimeService>(OvertimeService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create with correct params', async () => {
      const dto: CreateOvertimeDto = {
        hoursTaken: 2,
        attendanceId: 'att-1',
      };
      const req = { user: mockUser } as any;
      const result = { id: 'ot-1' };
      mockService.create.mockResolvedValue(result);

      const response = await controller.create(dto, req);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with user', async () => {
      const req = { user: mockUser } as any;
      const result = [{ id: 'ot-1' }];
      mockService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(req);
      expect(response).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and user', async () => {
      const req = { user: mockUser } as any;
      const result = { id: 'ot-1' };
      mockService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('ot-1', req);
      expect(response).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('ot-1', mockUser);
    });
  });

  describe('update', () => {
    it('should call service.update with correct data', async () => {
      const dto: UpdateOvertimeDto = { hoursTaken: 2 };
      const req = { user: mockUser } as any;
      const result = { id: 'ot-1', hoursTaken: 2 };

      mockService.update.mockResolvedValue(result);

      const response = await controller.update('ot-1', dto, req);
      expect(response).toBe(result);
      expect(service.update).toHaveBeenCalledWith('ot-1', dto, mockUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and user', async () => {
      const req = { user: mockUser } as any;
      const result = { id: 'ot-1', deletedAt: new Date() };

      mockService.remove.mockResolvedValue(result);

      const response = await controller.remove('ot-1', req);
      expect(response).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('ot-1', mockUser);
    });
  });
});
