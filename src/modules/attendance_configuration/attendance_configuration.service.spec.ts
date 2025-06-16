import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceConfigurationService } from './attendance_configuration.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { parseTimeToDate } from '../../util/date.util';
import { UserInterface } from '../../interfaces/user.interface';

jest.mock('../../util/date.util', () => {
  const moment = require('moment');
  return {
    m: () => moment.utc('2025-06-15T00:00:00Z'),
    parseTimeToDate: jest.fn(),
  };
});

describe('AttendanceConfigurationService', () => {
  let service: AttendanceConfigurationService;
  let prisma: PrismaService;

  const mockUser = <UserInterface>{ id: 'admin-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceConfigurationService, PrismaService],
    }).compile();

    service = module.get(AttendanceConfigurationService);
    prisma = module.get(PrismaService);
  });

  it('should create attendance configuration when endAt > startAt', async () => {
    (parseTimeToDate as jest.Mock).mockImplementation((time: string) => {
      const date = new Date(`2025-06-15T${time}Z`);
      return {
        utc: () => ({
          toDate: () => date,
          valueOf: () => date.valueOf(),
        }),
        valueOf: () => date.valueOf(),
      };
    });

    const dto: CreateAttendanceConfigurationDto = {
      startAt: '09:00:00',
      endAt: '17:00:00',
      hourlyRate: 50000,
      overtimeRate: 100000,
      overtimeMultiplier: 2.0,
    };

    const mockResult = { id: 'mock-id', ...dto };

    jest
      .spyOn(prisma.attendanceConfiguration, 'create')
      .mockResolvedValue(mockResult as any);

    const result = await service.create(dto, mockUser);

    expect(result).toEqual(mockResult);
  });

  it('should throw BadRequestException if endAt is before or equal to startAt', () => {
    (parseTimeToDate as jest.Mock).mockImplementation((t: string) => ({
      utc: () => ({
        toDate: () => new Date(`2025-06-15T${t}Z`),
        valueOf: () => new Date(`2025-06-15T${t}Z`).valueOf(),
      }),
    }));

    const dto: CreateAttendanceConfigurationDto = {
      startAt: '08:00:00',
      endAt: '07:00:00',
      hourlyRate: 50000,
      overtimeRate: 100000,
      overtimeMultiplier: 2.0,
    };

    expect(() => service.create(dto, mockUser)).toThrow(BadRequestException);
  });
});
