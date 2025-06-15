import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInterface } from '../../interfaces/user.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(user: UserInterface) {
    const now = new Date();

    // Validate weekend day, 0 = Sunday, 6 = Saturday
    const day = now.getDay();
    if (day === 0 || day === 6) {
      throw new BadRequestException('Not allowed during weekends');
    }

    // Validate if user already submitted
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        userId: user.id,
        checkInAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Attendance already submitted today.');
    }

    const attendancePeriod = await this.prisma.attendancePeriod.findFirst({
      where: {
        startAt: { lte: now },
        endAt: { gte: now },
        deletedAt: null,
      },
    });
    if (!attendancePeriod) throw new Error('Attendance period not found');
    return this.prisma.attendance.create({
      data: {
        userId: user.id,
        checkInAt: now,
        attendancePeriodId: attendancePeriod.id,
      },
    });
  }

  findAll(user: UserInterface) {
    return this.prisma.attendance.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });
  }

  findOne(id: string, user: UserInterface) {
    return this.prisma.attendance.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });
  }
}
