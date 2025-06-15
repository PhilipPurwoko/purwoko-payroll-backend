import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { BullModule } from '@nestjs/bull';
import { AttendanceProcessor } from './attendance.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'attendance',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceProcessor],
})
export class AttendanceModule {}
