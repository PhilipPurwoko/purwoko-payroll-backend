import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { BullModule } from '@nestjs/bull';
import { PayrollProcessor } from './payroll.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payroll',
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
  controllers: [PayrollController],
  providers: [PayrollService, PayrollProcessor],
})
export class PayrollModule {}
