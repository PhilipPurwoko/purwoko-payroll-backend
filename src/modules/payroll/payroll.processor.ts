import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PayrollQueueInterface } from '../../interfaces/payrol_queue.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { m } from '../../util/date.util';

@Processor('payroll')
export class PayrollProcessor {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(PayrollProcessor.name);

  @Process('process-payroll')
  async handle(job: Job) {
    try {
      const queue = job.data as PayrollQueueInterface;
      this.logger.log(
        `[${job.id}][Payroll] Processing: ${queue.employee.email}`,
      );

      const employee = await this.prisma.user.findFirst({
        where: {
          id: queue.employee.id,
          deletedAt: null,
        },
        include: {
          attendances: {
            where: {
              status: Status.completed,
              deletedAt: null,
            },
          },
          overtimes: { where: { deletedAt: null } },
          reimbursements: { where: { deletedAt: null } },
        },
      });

      if (!employee) {
        this.logger.warn(
          `[${job.id}][Payroll] Skipped. User not found: ${queue.employee.id}`,
        );
        return;
      }

      const config = queue.attendancePeriod.attendanceConfiguration;
      const configPeriodStartAt = config.startAt
        ? m(config.startAt, 'HH:mm:ss')
        : null;

      const configPeriodEndAt = config.endAt
        ? m(config.endAt, 'HH:mm:ss')
        : null;

      // Get hours per day
      const hoursPerDay = configPeriodEndAt?.diff(
        configPeriodStartAt,
        'hours',
        true,
      );

      // Calculate total hours
      const totalAttendance = employee?.attendances?.length ?? 0;
      const totalOvertime = employee?.overtimes?.length ?? 0;
      const totalAttendanceHours = totalAttendance * (hoursPerDay ?? 0);
      const totalOvertimeHours = employee.overtimes.reduce(
        (prev, next) => prev + (next.hoursTaken ?? 0),
        0,
      );

      // Calculate take home pay
      const totalAttendanceAmount =
        totalAttendanceHours * (config.hourlyRate ?? 0);
      const totalOvertimeAmount =
        totalOvertimeHours * (config.overtimeRate ?? 0);
      const totalReimbursementAmount = employee.reimbursements.reduce(
        (prev, next) => prev + (next.amount ?? 0),
        0,
      );
      const takeHomePay =
        totalAttendanceAmount + totalOvertimeAmount + totalReimbursementAmount;

      const payroll = await this.prisma.payroll.create({
        data: {
          amount: takeHomePay,
          userId: queue.employee.id,
          createdBy: queue.actor.id,
          attendancePeriodId: queue.attendancePeriod.id,
          status: Status.completed,
        },
      });
      await this.prisma.payslip.create({
        data: {
          attendancePeriodId: queue.attendancePeriod.id,
          status: Status.completed,
          takeHomePay: takeHomePay,
          totalAttendanceAmount: totalAttendanceAmount,
          totalOvertimeAmount: totalOvertimeAmount,
          totalReimbursementAmount: totalReimbursementAmount,
          totalAttendance: totalAttendance,
          totalAttendanceHours: totalAttendanceHours,
          totalOvertime: totalOvertime,
          totalOvertimeHours: totalOvertimeHours,
          hoursPerDay: hoursPerDay,
          hourlyRate: config.hourlyRate,
          overtimeRate: config.overtimeRate,
          payrollId: payroll.id,
          overtimeMultiplier: config.overtimeMultiplier,
          userId: queue.employee.id,
          createdBy: queue.actor.id,
        },
      });
      this.logger.log(`[${job.id}][Payroll] success: ${queue.employee.email}`);
    } catch (error) {
      // Throwing exception will trigger retry
      this.logger.error(`[${job.id}][Payroll] Failed: ${error}`);
      throw error;
    }
  }
}
