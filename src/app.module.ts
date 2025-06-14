import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { OvertimeModule } from './modules/overtime/overtime.module';
import { ReimburseModule } from './modules/reimburse/reimburse.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { PayslipModule } from './modules/payslip/payslip.module';
import { SummaryModule } from './modules/summary/summary.module';
import { AttendanceConfigurationModule } from './modules/attendance_configuration/attendance_configuration.module';
import { AttendancePeriodModule } from './modules/attendance_period/attendance_period.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AttendanceModule,
    OvertimeModule,
    ReimburseModule,
    PayrollModule,
    PayslipModule,
    SummaryModule,
    AttendanceConfigurationModule,
    AttendancePeriodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
