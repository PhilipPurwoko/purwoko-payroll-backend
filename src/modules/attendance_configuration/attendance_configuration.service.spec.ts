import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceConfigurationService } from './attendance_configuration.service';

describe('AttendanceConfigurationService', () => {
  let service: AttendanceConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceConfigurationService],
    }).compile();

    service = module.get<AttendanceConfigurationService>(AttendanceConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
