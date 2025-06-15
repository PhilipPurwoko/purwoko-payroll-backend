import { Test, TestingModule } from '@nestjs/testing';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

describe('SummaryController', () => {
  let controller: SummaryController;
  let service: SummaryService;

  const mockSummaryService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryController],
      providers: [
        {
          provide: SummaryService,
          useValue: mockSummaryService,
        },
      ],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
    service = module.get<SummaryService>(SummaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call summaryService.findAll with correct parameter', async () => {
    const mockAttendancePeriodId = 'period-1';
    const mockResult = { some: 'summary' };
    mockSummaryService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll(mockAttendancePeriodId);

    expect(service.findAll).toHaveBeenCalledWith(mockAttendancePeriodId);
    expect(result).toBe(mockResult);
  });
});
