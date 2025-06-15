import { Test, TestingModule } from '@nestjs/testing';
import { PayslipService } from './payslip.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

describe('PayslipService', () => {
  let service: PayslipService;
  let prisma: PrismaService;

  const mockUser: UserInterface = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'employee',
  };

  const mockPrismaService = {
    payslip: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayslipService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PayslipService>(PayslipService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return all payslips for a user', async () => {
      const mockResult = [{ id: 'pay-1' }];
      mockPrismaService.payslip.findMany.mockResolvedValue(mockResult);

      const result = await service.findAll(mockUser);
      expect(result).toEqual(mockResult);
      expect(prisma.payslip.findMany).toHaveBeenCalledWith({
        include: { attendancePeriod: true },
        where: {
          userId: mockUser.id,
          deletedAt: null,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single payslip for a user', async () => {
      const mockResult = { id: 'pay-1' };
      mockPrismaService.payslip.findFirst.mockResolvedValue(mockResult);

      const result = await service.findOne('pay-1', mockUser);
      expect(result).toEqual(mockResult);
      expect(prisma.payslip.findFirst).toHaveBeenCalledWith({
        include: {
          attendancePeriod: {
            include: {
              attendances: {
                where: { userId: mockUser.id, deletedAt: null },
              },
              overtimes: {
                where: { userId: mockUser.id, deletedAt: null },
              },
              reimbursements: {
                where: { userId: mockUser.id, deletedAt: null },
              },
            },
          },
        },
        where: {
          id: 'pay-1',
          userId: mockUser.id,
          deletedAt: null,
        },
      });
    });
  });
});
