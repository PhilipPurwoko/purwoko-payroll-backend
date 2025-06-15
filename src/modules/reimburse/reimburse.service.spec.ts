import { ReimburseService } from './reimburse.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

jest.mock('src/util/date.util', () => {
  const moment = require('moment'); // Get actual moment
  return {
    m: () => moment.utc('2025-06-15T00:00:00Z'), // Make m() callable
    parseTimeToDate: jest.fn(), // If needed
  };
});

describe('ReimburseService', () => {
  let service: ReimburseService;
  let prisma: jest.Mocked<PrismaService>;

  const mockUser: UserInterface = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'employee',
  };

  const mockAttendancePeriod = {
    id: 'period-1',
  };

  beforeEach(() => {
    prisma = {
      reimbursement: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      attendancePeriod: {
        findFirst: jest.fn(),
      },
    } as any;

    service = new ReimburseService(prisma);
  });

  describe('create', () => {
    it('should throw if no attendance period found', async () => {
      (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ amount: 1000, description: 'test' }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reimbursement', async () => {
      (prisma.attendancePeriod.findFirst as jest.Mock).mockResolvedValue(
        mockAttendancePeriod,
      );
      (prisma.reimbursement.create as jest.Mock).mockResolvedValue({
        id: 'r1',
      });

      const result = await service.create(
        { amount: 1000, description: 'test' },
        mockUser,
      );
      expect(result).toEqual({ id: 'r1' });
      expect(prisma.reimbursement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          amount: 1000,
          userId: mockUser.id,
          attendancePeriodId: mockAttendancePeriod.id,
          createdBy: mockUser.id,
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return reimbursements for user', async () => {
      (prisma.reimbursement.findMany as jest.Mock).mockResolvedValue([
        { id: 'r1' },
      ]);
      const result = await service.findAll(mockUser);
      expect(result).toEqual([{ id: 'r1' }]);
      expect(prisma.reimbursement.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, userId: mockUser.id },
      });
    });
  });

  describe('findOne', () => {
    it('should return reimbursement', async () => {
      (prisma.reimbursement.findFirst as jest.Mock).mockResolvedValue({
        id: 'r1',
      });
      const result = await service.findOne('r1', mockUser);
      expect(result).toEqual({ id: 'r1' });
    });
  });

  describe('update', () => {
    it('should throw if not found', async () => {
      (prisma.reimbursement.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        service.update('r1', { amount: 500 }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update reimbursement', async () => {
      (prisma.reimbursement.findFirst as jest.Mock).mockResolvedValue({
        id: 'r1',
      });
      (prisma.reimbursement.update as jest.Mock).mockResolvedValue({
        id: 'r1-updated',
      });

      const result = await service.update('r1', { amount: 500 }, mockUser);
      expect(result).toEqual({ id: 'r1-updated' });
      expect(prisma.reimbursement.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          amount: 500,
          updatedBy: mockUser.id,
        }),
        where: { id: 'r1', deletedAt: null },
      });
    });
  });

  describe('remove', () => {
    it('should throw if not found', async () => {
      (prisma.reimbursement.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.remove('r1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete reimbursement', async () => {
      (prisma.reimbursement.findFirst as jest.Mock).mockResolvedValue({
        id: 'r1',
      });
      (prisma.reimbursement.update as jest.Mock).mockResolvedValue({
        id: 'r1-deleted',
      });

      const result = await service.remove('r1', mockUser);
      expect(result).toEqual({ id: 'r1-deleted' });
      expect(prisma.reimbursement.update).toHaveBeenCalledWith({
        data: expect.objectContaining({
          deletedBy: mockUser.id,
        }),
        where: { id: 'r1', deletedAt: null },
      });
    });
  });
});
