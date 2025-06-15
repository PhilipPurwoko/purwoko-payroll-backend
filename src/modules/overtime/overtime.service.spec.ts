import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeService } from './overtime.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import * as m from 'moment';
import { UserInterface } from '../../interfaces/user.interface';

describe('OvertimeService', () => {
  let service: OvertimeService;
  let prisma: PrismaService;

  const mockPrisma = {
    attendance: {
      findFirst: jest.fn(),
    },
    overtime: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUser = <UserInterface>{ id: 'user-id' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OvertimeService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OvertimeService>(OvertimeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should throw if hoursTaken > 3', async () => {
      await expect(
        service.create({ hoursTaken: 4, attendanceId: 'a' }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if attendance not found', async () => {
      mockPrisma.attendance.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ hoursTaken: 2, attendanceId: 'a' }, mockUser),
      ).rejects.toThrow('Attendance not found');
    });

    it('should throw if overtime > 3 including existing ones', async () => {
      mockPrisma.attendance.findFirst.mockResolvedValue({
        id: 'a',
        attendancePeriodId: 'p',
        attendancePeriod: { status: Status.ongoing },
      });

      mockPrisma.overtime.findMany.mockResolvedValue([
        { hoursTaken: 2 },
        { hoursTaken: 1 },
      ]);

      await expect(
        service.create({ hoursTaken: 1, attendanceId: 'a' }, mockUser),
      ).rejects.toThrow('Overtime cannot be more than 3 hours');
    });

    it('should create overtime successfully', async () => {
      const dto = { hoursTaken: 1, attendanceId: 'a' };

      mockPrisma.attendance.findFirst.mockResolvedValue({
        id: 'a',
        attendancePeriodId: 'p',
        attendancePeriod: { status: Status.ongoing },
      });

      mockPrisma.overtime.findMany.mockResolvedValue([]);
      mockPrisma.overtime.create.mockResolvedValue({ id: 'overtime-id' });

      const result = await service.create(dto, mockUser);

      expect(result).toEqual({ id: 'overtime-id' });
      expect(mockPrisma.overtime.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw if overtime not found', async () => {
      mockPrisma.overtime.findFirst.mockResolvedValue(null);
      await expect(
        service.update('1', { hoursTaken: 2 }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if total overtime exceeds 3', async () => {
      mockPrisma.overtime.findFirst.mockResolvedValue({
        id: '1',
        hoursTaken: 1,
      });

      mockPrisma.overtime.findMany.mockResolvedValue([{ hoursTaken: 2 }]);

      await expect(
        service.update('1', { hoursTaken: 2 }, mockUser),
      ).rejects.toThrow('Overtime cannot be more than 3 hours');
    });

    it('should update overtime successfully', async () => {
      mockPrisma.overtime.findFirst.mockResolvedValue({
        id: '1',
        attendanceId: 'a',
      });

      mockPrisma.overtime.findMany.mockResolvedValue([]);
      mockPrisma.overtime.update.mockResolvedValue({ id: '1', hoursTaken: 2 });

      const result = await service.update('1', { hoursTaken: 2 }, mockUser);
      expect(result).toEqual({ id: '1', hoursTaken: 2 });
    });
  });

  describe('remove', () => {
    it('should throw if overtime not found', async () => {
      mockPrisma.overtime.findFirst.mockResolvedValue(null);
      await expect(service.remove('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete overtime', async () => {
      mockPrisma.overtime.findFirst.mockResolvedValue({ id: '1' });
      mockPrisma.overtime.update.mockResolvedValue({
        id: '1',
        deletedAt: m().toDate(),
      });

      const result = await service.remove('1', mockUser);
      expect(result.id).toBe('1');
      expect(mockPrisma.overtime.update).toHaveBeenCalled();
    });
  });
});
