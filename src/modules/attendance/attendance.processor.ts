import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PayrollQueueInterface } from '../../interfaces/payrol_queue.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { m } from '../../util/date.util';

@Processor('attendance')
export class AttendanceProcessor {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(AttendanceProcessor.name);

  @Process('process-attendance')
  async handle(job: Job) {
    try {
      const now = m();

      const queue = job.data as PayrollQueueInterface;
      this.logger.log(
        `[${job.id}][Attendance] Processing : ${queue.actor.email}`,
      );

      const attendancePeriod = await this.prisma.attendancePeriod.findFirst({
        where: {
          startAt: { lte: now.utc().toDate() },
          endAt: { gte: now.utc().toDate() },
          status: Status.ongoing,
          deletedAt: null,
        },
      });
      if (!attendancePeriod) {
        this.logger.warn(
          `[${job.id}][Attendance] Skipped. AttendancePeriod not found: ${queue.actor.id}`,
        );
        await this.prisma.attendance.create({
          data: {
            userId: queue.actor.id,
            checkInAt: now.utc().toDate(),
            status: Status.failed,
            description: 'AttendancePeriod not found',
            createdBy: queue.actor.id,
          },
        });
        return;
      }

      // Validate if user already submitted
      const startOfDay = now.clone().startOf('day').toDate();
      const endOfDay = now.clone().endOf('day').toDate();
      const existingAttendance = await this.prisma.attendance.findFirst({
        where: {
          userId: queue.actor.id,
          status: Status.completed,
          checkInAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (existingAttendance) {
        this.logger.warn(
          `[${job.id}][Attendance] Skipped. Attendance already submitted today`,
        );
        return;
      }

      await this.prisma.attendance.create({
        data: {
          userId: queue.actor.id,
          checkInAt: now.utc().toDate(),
          attendancePeriodId: attendancePeriod.id,
          status: Status.completed,
          description: 'Successfully checked in',
          createdBy: queue.actor.id,
        },
      });
      this.logger.log(`[${job.id}][Attendance] Success: ${queue.actor.email}`);
    } catch (error) {
      // Throwing exception will trigger retry
      this.logger.error(`[${job.id}][Attendance] Failed: ${error}`);
      throw error;
    }
  }
}
