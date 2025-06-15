import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PayrollQueueInterface } from '../../interfaces/payrol_queue.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';

@Processor('payroll')
export class PayrollProcessor {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(PayrollProcessor.name);

  @Process('process-payroll')
  async handlePayroll(job: Job) {
    try {
      const queue = job.data as PayrollQueueInterface;
      this.logger.log(`Processing payroll for: ${queue.employee.email}`);

      const employee = await this.prisma.user.findFirst({
        where: {
          id: queue.employee.id,
          deletedAt: null,
        },
        include: {
          attendances: true,
          overtimes: true,
          reimbursements: true,
        },
      });

      if (!employee) {
        this.logger.warn(
          `[${job.id}] Queue Skipped. User not found: ${queue.employee.id}`,
        );
        return;
      }

      const config = queue.attendancePeriod.attendanceConfiguration;
      const configPeriodStartAt = new Date(
        (config.periodStartAt as string | null) ?? '',
      );
      const configPeriodEndAt = new Date(
        (config.periodEndAt as string | null) ?? '',
      );

      // Get hours per day
      const diffMs =
        configPeriodEndAt.getTime() - configPeriodStartAt.getTime();
      const hoursPerDay = diffMs / (1000 * 60 * 60);

      // Calculate total hours
      const totalAttendance = employee.attendances.length;
      const totalAttendanceHours = totalAttendance * hoursPerDay;
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
          takeHomePay: takeHomePay,
          totalAttendanceAmount: totalAttendanceAmount,
          totalOvertimeAmount: totalOvertimeAmount,
          totalReimbursementAmount: totalReimbursementAmount,
          totalAttendance: totalAttendance,
          totalAttendanceHours: totalAttendanceHours,
          totalOvertimeHours: totalOvertimeHours,
          hoursPerDay: hoursPerDay,
          hourlyRate: config.hourlyRate,
          overtimeRate: config.overtimeRate,
          payrollId: payroll.id,
          userId: queue.employee.id,
          createdBy: queue.actor.id,
        },
      });
      this.logger.log(`Processing payroll success: ${queue.employee.email}`);
    } catch (error) {
      // Throwing exception will trigger retry
      this.logger.error(`Payroll failed: ${error}`);
      throw error;
    }
  }
}
