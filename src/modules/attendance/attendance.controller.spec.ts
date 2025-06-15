import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser = { id: 'user-id' };
  const mockRequest: any = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: mockService }],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should call create', () => {
    controller.create(mockRequest);
    expect(service.create).toHaveBeenCalledWith(mockUser);
  });

  it('should call findAll', () => {
    controller.findAll(mockRequest);
    expect(service.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should call findOne', () => {
    controller.findOne('id123', mockRequest);
    expect(service.findOne).toHaveBeenCalledWith('id123', mockUser);
  });
});
