import { Module } from '@nestjs/common';
import { AttendanceConfigurationService } from './attendance_configuration.service';
import { AttendanceConfigurationController } from './attendance_configuration.controller';

@Module({
  controllers: [AttendanceConfigurationController],
  providers: [AttendanceConfigurationService],
})
export class AttendanceConfigurationModule {}
