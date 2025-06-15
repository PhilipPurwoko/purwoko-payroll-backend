import { Test, TestingModule } from '@nestjs/testing';
import { PayslipController } from './payslip.controller';
import { PayslipService } from './payslip.service';
import { UserInterface } from '../../interfaces/user.interface';

describe('PayslipController', () => {
  let controller: PayslipController;
  let service: PayslipService;

  const mockPayslipService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser: UserInterface = { id: 'user-id' } as UserInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayslipController],
      providers: [
        {
          provide: PayslipService,
          useValue: mockPayslipService,
        },
      ],
    }).compile();

    controller = module.get<PayslipController>(PayslipController);
    service = module.get<PayslipService>(PayslipService);
  });

  it('should call findAll with user', () => {
    controller.findAll({ user: mockUser } as any);
    expect(service.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should call findOne with id and user', () => {
    controller.findOne({ user: mockUser } as any, 'payslip-id');
    expect(service.findOne).toHaveBeenCalledWith('payslip-id', mockUser);
  });
});
