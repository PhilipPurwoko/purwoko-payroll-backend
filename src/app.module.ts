import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestContext } from './commons/request-context.service';
import { AppLogger } from './interceptor/logger.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
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
  providers: [AppService, RequestContext, AppLogger],
  exports: [RequestContext, AppLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
