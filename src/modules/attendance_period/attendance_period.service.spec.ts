import { NotFoundException } from '@nestjs/common';
import { AttendancePeriodService } from './attendance_period.service';
import { UserInterface } from '../../interfaces/user.interface';
import { PrismaService } from '../../prisma/prisma.service';

describe('AttendancePeriodService', () => {
  let service: AttendancePeriodService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    attendancePeriod: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    attendanceConfiguration: {
      findFirst: jest.fn(),
    },
  };

  const actor = <UserInterface>{ id: 'user-id' };

  beforeEach(() => {
    prisma = mockPrisma as any;
    service = new AttendancePeriodService(prisma);
  });

  it('create', async () => {
    (prisma.attendanceConfiguration.findFirst as jest.Mock).mockResolvedValue(
      true,
    );
    await service.create({ attendanceConfigurationId: 'id' } as any, actor);
    expect(prisma.attendancePeriod.create).toHaveBeenCalled();
  });

  it('create throws if config not found', async () => {
    (prisma.attendanceConfiguration.findFirst as jest.Mock).mockResolvedValue(
      null,
    );
    await expect(
      service.create({ attendanceConfigurationId: 'bad' } as any, actor),
    ).rejects.toThrow(NotFoundException);
  });

  it('findAll', () => {
    service.findAll();
    expect(prisma.attendancePeriod.findMany).toHaveBeenCalled();
  });

  it('findOne', () => {
    service.findOne('123');
    expect(prisma.attendancePeriod.findFirst).toHaveBeenCalledWith({
      where: { id: '123', deletedAt: null },
    });
  });

  it('update', async () => {
    (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue({
      id: '123',
    });
    (prisma.attendanceConfiguration.findFirst as jest.Mock).mockResolvedValue(
      true,
    );
    await service.update(
      '123',
      { attendanceConfigurationId: 'cfg' } as any,
      actor,
    );
    expect(prisma.attendancePeriod.update).toHaveBeenCalled();
  });

  it('update throws if not found', async () => {
    (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(service.update('x', {} as any, actor)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update throws if config not found', async () => {
    (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue({
      id: '123',
    });
    (prisma.attendanceConfiguration.findFirst as jest.Mock).mockResolvedValue(
      null,
    );
    await expect(
      service.update('123', { attendanceConfigurationId: 'bad' } as any, actor),
    ).rejects.toThrow(NotFoundException);
  });

  it('remove', async () => {
    (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue({
      id: '123',
    });
    await service.remove('123', actor);
    expect(prisma.attendancePeriod.update).toHaveBeenCalled();
  });

  it('remove throws if not found', async () => {
    (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(service.remove('x', actor)).rejects.toThrow(NotFoundException);
  });
});
