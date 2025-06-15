import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService } from './payroll.service';
import { BadRequestException } from '@nestjs/common';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Role, Status } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

describe('PayrollService', () => {
  let service: PayrollService;
  let prisma: PrismaService;
  let queue: Queue;

  const mockUser = <UserInterface>{ id: 'user-1' };
  const mockAttendancePeriod = {
    id: 'period-1',
    status: Status.ongoing,
    attendanceConfiguration: {},
  };
  const mockEmployees = [
    { id: 'emp1', role: Role.employee },
    { id: 'emp2', role: Role.employee },
  ];

  const mockQueue = {
    add: jest.fn(),
  };

  const mockPrisma = {
    attendancePeriod: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    payroll: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayrollService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: getQueueToken('payroll'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get(PayrollService);
    prisma = module.get(PrismaService);
    queue = module.get(getQueueToken('payroll'));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should throw if attendance period not found', async () => {
      mockPrisma.attendancePeriod.findFirst.mockResolvedValue(null);

      await expect(
        service.create({ attendancePeriodId: 'period-1' }, mockUser),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.attendancePeriod.findFirst).toHaveBeenCalled();
    });

    it('should enqueue payroll jobs and mark period as completed', async () => {
      mockPrisma.attendancePeriod.findFirst.mockResolvedValue(
        mockAttendancePeriod,
      );
      mockPrisma.user.findMany.mockResolvedValue(mockEmployees);
      mockPrisma.attendancePeriod.update.mockResolvedValue({});

      const result = await service.create(
        { attendancePeriodId: 'period-1' },
        mockUser,
      );

      expect(result).toBe('Successfully running payroll for 2 employees');
      expect(mockQueue.add).toHaveBeenCalledTimes(2);
      expect(mockQueue.add).toHaveBeenCalledWith('process-payroll', {
        actor: mockUser,
        attendancePeriod: mockAttendancePeriod,
        employee: mockEmployees[0],
      });
      expect(mockPrisma.attendancePeriod.update).toHaveBeenCalledWith({
        where: { id: 'period-1' },
        data: { status: Status.completed, updatedBy: mockUser.id },
      });
    });
  });

  describe('findAll', () => {
    it('should return all payrolls for a period', async () => {
      const result = [{ id: 'payroll-1' }];
      mockPrisma.payroll.findMany.mockResolvedValue(result);

      const response = await service.findAll('period-1');
      expect(response).toBe(result);
      expect(mockPrisma.payroll.findMany).toHaveBeenCalledWith({
        where: {
          attendancePeriodId: 'period-1',
          deletedAt: null,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single payroll', async () => {
      const result = { id: 'payroll-1' };
      mockPrisma.payroll.findFirst.mockResolvedValue(result);

      const response = await service.findOne('payroll-1');
      expect(response).toBe(result);
      expect(mockPrisma.payroll.findFirst).toHaveBeenCalledWith({
        where: { id: 'payroll-1', deletedAt: null },
      });
    });
  });
});
