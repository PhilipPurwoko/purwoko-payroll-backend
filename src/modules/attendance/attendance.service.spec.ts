import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let queue: Queue;
  let prisma: PrismaService;

  const mockQueue = {
    add: jest.fn(),
  };

  const mockPrisma = {
    attendance: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockUser = <UserInterface>{ id: 'user-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: getQueueToken('attendance'), useValue: mockQueue },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    queue = module.get(getQueueToken('attendance'));
    prisma = module.get(PrismaService);
  });

  it('should create attendance on weekday', async () => {
    const mockDate = new Date('2025-06-13T00:00:00Z'); // Friday
    jest.spyOn(Date.prototype, 'getDay').mockReturnValue(mockDate.getDay());
    const result = await service.create(mockUser);
    expect(queue.add).toHaveBeenCalledWith('process-attendance', {
      actor: mockUser,
    });
    expect(result).toBe('Attendance has been submitted');
  });

  it('should throw on weekend', async () => {
    jest.spyOn(Date.prototype, 'getDay').mockReturnValue(0); // Sunday
    await expect(service.create(mockUser)).rejects.toThrow(BadRequestException);
  });

  it('should call findAll', () => {
    service.findAll(mockUser);
    expect(prisma.attendance.findMany).toHaveBeenCalledWith({
      where: { userId: mockUser.id, deletedAt: null },
      include: { attendancePeriod: { where: { deletedAt: null } } },
    });
  });

  it('should call findOne', () => {
    service.findOne('id123', mockUser);
    expect(prisma.attendance.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'id123',
        userId: mockUser.id,
        deletedAt: null,
        attendancePeriod: { status: expect.anything() },
      },
    });
  });
});
