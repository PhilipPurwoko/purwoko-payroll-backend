import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from './summary.service';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

describe('SummaryService', () => {
  let service: SummaryService;
  let prisma: PrismaService;

  const mockAttendancePeriodId = 'period-123';

  const mockAttendancePeriod = {
    id: mockAttendancePeriodId,
    deletedAt: null,
  };

  const mockUsers = [
    {
      id: 'user-1',
      role: Role.employee,
      deletedAt: null,
      payslips: [
        { takeHomePay: 1000, deletedAt: null },
        { takeHomePay: 1500, deletedAt: null },
      ],
    },
    {
      id: 'user-2',
      role: Role.employee,
      deletedAt: null,
      payslips: [
        { takeHomePay: 2000, deletedAt: null },
        { takeHomePay: null, deletedAt: null },
      ],
    },
  ];

  const mockPrisma = {
    attendancePeriod: {
      findFirst: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return summary with total take home pay', async () => {
    mockPrisma.attendancePeriod.findFirst.mockResolvedValue(
      mockAttendancePeriod,
    );
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.findAll(mockAttendancePeriodId);

    expect(prisma.attendancePeriod.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockAttendancePeriodId,
        deletedAt: null,
      },
    });

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      include: {
        payslips: {
          where: {
            attendancePeriodId: mockAttendancePeriodId,
            deletedAt: null,
          },
        },
      },
      where: {
        role: Role.employee,
        deletedAt: null,
      },
    });

    const expectedTotal = 1000 + 1500 + 2000;
    expect(result).toEqual({
      attendancePeriod: mockAttendancePeriod,
      totalTakeHomePayAmount: expectedTotal,
      employees: mockUsers,
    });
  });

  it('should throw NotFoundException if attendance period not found', async () => {
    mockPrisma.attendancePeriod.findFirst.mockResolvedValue(null);

    await expect(service.findAll('missing-id')).rejects.toThrow(
      new NotFoundException('Attendance period not found'),
    );

    expect(prisma.attendancePeriod.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'missing-id',
        deletedAt: null,
      },
    });
  });
});
