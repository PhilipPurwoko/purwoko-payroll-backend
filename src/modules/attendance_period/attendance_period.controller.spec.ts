import { Test, TestingModule } from '@nestjs/testing';
import { AttendancePeriodController } from './attendance_period.controller';
import { AttendancePeriodService } from './attendance_period.service';

describe('AttendancePeriodController', () => {
  let controller: AttendancePeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendancePeriodController],
      providers: [AttendancePeriodService],
    }).compile();

    controller = module.get<AttendancePeriodController>(AttendancePeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
