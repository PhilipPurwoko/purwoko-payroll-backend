import { Test, TestingModule } from '@nestjs/testing';
import { AttendancePeriodController } from './attendance_period.controller';
import { AttendancePeriodService } from './attendance_period.service';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';
import { UserInterface } from '../../interfaces/user.interface';

describe('AttendancePeriodController', () => {
  let controller: AttendancePeriodController;
  let service: AttendancePeriodService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: UserInterface = { id: 'user-id' } as UserInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendancePeriodController],
      providers: [
        { provide: AttendancePeriodService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AttendancePeriodController>(AttendancePeriodController);
    service = module.get<AttendancePeriodService>(AttendancePeriodService);
  });

  it('should call create with correct dto and user', () => {
    const dto: CreateAttendancePeriodDto = {
      startAt: new Date('2025-06-15T08:00:00.000Z'),
      endAt: new Date('2025-06-30T17:00:00.000Z'),
      attendanceConfigurationId: 'b15cf5b1-3d0a-4d71-bf4f-ecb2cba7f4a3',
    };

    controller.create({ user: mockUser } as any, dto);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne with id', () => {
    controller.findOne('abc-id');
    expect(service.findOne).toHaveBeenCalledWith('abc-id');
  });

  it('should call update with correct id, dto, and user', () => {
    const updateDto: UpdateAttendancePeriodDto = {
      startAt: new Date('2025-06-16T08:00:00.000Z'),
      endAt: new Date('2025-06-29T17:00:00.000Z'),
    };

    controller.update({ user: mockUser } as any, 'abc-id', updateDto);
    expect(service.update).toHaveBeenCalledWith('abc-id', updateDto, mockUser);
  });

  it('should call remove with id and user', () => {
    controller.remove({ user: mockUser } as any, 'abc-id');
    expect(service.remove).toHaveBeenCalledWith('abc-id', mockUser);
  });
});
