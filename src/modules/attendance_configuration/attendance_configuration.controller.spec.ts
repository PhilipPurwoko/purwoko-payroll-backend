import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceConfigurationController } from './attendance_configuration.controller';
import { AttendanceConfigurationService } from './attendance_configuration.service';

describe('AttendanceConfigurationController', () => {
  let controller: AttendanceConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceConfigurationController],
      providers: [AttendanceConfigurationService],
    }).compile();

    controller = module.get<AttendanceConfigurationController>(AttendanceConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
