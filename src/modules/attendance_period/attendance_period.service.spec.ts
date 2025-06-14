import { Test, TestingModule } from '@nestjs/testing';
import { AttendancePeriodService } from './attendance_period.service';

describe('AttendancePeriodService', () => {
  let service: AttendancePeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendancePeriodService],
    }).compile();

    service = module.get<AttendancePeriodService>(AttendancePeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
