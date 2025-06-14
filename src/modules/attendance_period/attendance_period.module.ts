import { Module } from '@nestjs/common';
import { AttendancePeriodService } from './attendance_period.service';
import { AttendancePeriodController } from './attendance_period.controller';

@Module({
  controllers: [AttendancePeriodController],
  providers: [AttendancePeriodService],
})
export class AttendancePeriodModule {}
