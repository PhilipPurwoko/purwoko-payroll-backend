import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceConfigurationController } from './attendance_configuration.controller';
import { AttendanceConfigurationService } from './attendance_configuration.service';

describe('AttendanceConfigurationController', () => {
  let controller: AttendanceConfigurationController;
  let service: AttendanceConfigurationService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const req = { user: { id: 'admin-id' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceConfigurationController],
      providers: [
        {
          provide: AttendanceConfigurationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AttendanceConfigurationController>(
      AttendanceConfigurationController,
    );
    service = module.get<AttendanceConfigurationService>(
      AttendanceConfigurationService,
    );
  });

  it('create', () => {
    controller.create(req, {
      name: 'Shift A',
      startAt: '08:00',
      endAt: '17:00',
    } as any);
    expect(service.create).toHaveBeenCalled();
  });

  it('findAll', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne', () => {
    controller.findOne('123');
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  it('update', () => {
    controller.update(req, '123', { name: 'Updated' } as any);
    expect(service.update).toHaveBeenCalled();
  });

  it('remove', () => {
    controller.remove(req, '123');
    expect(service.remove).toHaveBeenCalledWith('123', req.user);
  });
});
