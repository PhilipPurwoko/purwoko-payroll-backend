import { Test, TestingModule } from '@nestjs/testing';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Request } from 'express';

describe('PayrollController', () => {
  let controller: PayrollController;
  let service: PayrollService;

  const mockUser = { id: 'admin-1' } as any;
  const mockReq = {
    user: mockUser,
  } as Request;

  const mockPayrollService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollController],
      providers: [
        {
          provide: PayrollService,
          useValue: mockPayrollService,
        },
      ],
    }).compile();

    controller = module.get(PayrollController);
    service = module.get(PayrollService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call payrollService.create with correct params', async () => {
      const dto: CreatePayrollDto = { attendancePeriodId: 'period-1' };
      const result = 'success';
      mockPayrollService.create.mockResolvedValue(result);

      const res = await controller.create(dto, mockReq);
      expect(res).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return payrolls for a period', async () => {
      const result = [{ id: 'p1' }];
      mockPayrollService.findAll.mockResolvedValue(result);

      const res = await controller.findAll('period-1');
      expect(res).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith('period-1');
    });
  });

  describe('findOne', () => {
    it('should return payroll detail', async () => {
      const result = { id: 'p1' };
      mockPayrollService.findOne.mockResolvedValue(result);

      const res = await controller.findOne('p1');
      expect(res).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('p1');
    });
  });
});
