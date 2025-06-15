import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInterface } from '../../interfaces/user.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectQueue('attendance') private queue: Queue,
    private prisma: PrismaService,
  ) {}

  async create(user: UserInterface) {
    // Validate weekend day, 0 = Sunday, 6 = Saturday
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) {
      throw new BadRequestException('Not allowed during weekends');
    }

    await this.queue.add('process-attendance', {
      actor: user,
    });

    return `Attendance has been submitted`;
  }

  findAll(user: UserInterface) {
    return this.prisma.attendance.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      include: {
        attendancePeriod: { where: { deletedAt: null } },
      },
    });
  }

  findOne(id: string, user: UserInterface) {
    return this.prisma.attendance.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
        attendancePeriod: {
          status: Status.ongoing,
        },
      },
    });
  }
}
