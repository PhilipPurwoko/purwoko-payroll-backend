import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';
import { Status } from '@prisma/client';
import { m } from '../../util/date.util';

@Injectable()
export class OvertimeService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateOvertimeDto, user: UserInterface) {
    if (createDto.hoursTaken > 3) {
      throw new BadRequestException('Overtime cannot be more than 3 hours');
    }
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        id: createDto.attendanceId,
        userId: user.id,
        deletedAt: null,
        status: Status.completed,
        attendancePeriod: {
          status: Status.ongoing,
        },
      },
      include: {
        attendancePeriod: {
          where: { status: Status.ongoing, deletedAt: null },
        },
      },
    });
    if (!attendance) throw new BadRequestException('Attendance not found');

    const existingOvertime = await this.prisma.overtime.findMany({
      where: {
        userId: user.id,
        attendanceId: createDto.attendanceId,
        deletedAt: null,
      },
    });

    const existingOvertimeHours = existingOvertime.reduce(
      (total, overtime) => total + (overtime.hoursTaken ?? 0),
      0,
    );

    if (existingOvertimeHours + createDto.hoursTaken > 3) {
      throw new BadRequestException('Overtime cannot be more than 3 hours');
    }

    return this.prisma.overtime.create({
      data: {
        ...createDto,
        attendancePeriodId: attendance.attendancePeriodId,
        userId: user.id,
        createdBy: user.id,
      },
    });
  }

  findAll(user: UserInterface) {
    return this.prisma.overtime.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });
  }

  findOne(id: string, user: UserInterface) {
    return this.prisma.overtime.findFirst({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });
  }

  async update(id: string, updateDto: UpdateOvertimeDto, user: UserInterface) {
    if ((updateDto.hoursTaken ?? 0) > 3) {
      throw new BadRequestException('Overtime cannot be more than 3 hours');
    }

    const data = await this.findOne(id, user);
    if (!data) throw new NotFoundException();

    if (updateDto.attendanceId) {
      const attendance = await this.prisma.attendance.findFirst({
        where: {
          id: updateDto.attendanceId,
          userId: user.id,
          deletedAt: null,
          status: Status.completed,
          attendancePeriod: {
            status: Status.ongoing,
          },
        },
        include: {
          attendancePeriod: {
            where: { status: Status.ongoing, deletedAt: null },
          },
        },
      });
      if (!attendance) throw new BadRequestException('Attendance not found');
    }

    const existingOvertime = await this.prisma.overtime.findMany({
      where: {
        id: { not: id },
        userId: user.id,
        attendanceId: updateDto.attendanceId,
        deletedAt: null,
      },
    });

    const existingOvertimeHours = existingOvertime.reduce(
      (total, overtime) => total + (overtime.hoursTaken ?? 0),
      0,
    );

    if (existingOvertimeHours + (updateDto?.hoursTaken ?? 0) > 3) {
      throw new BadRequestException('Overtime cannot be more than 3 hours');
    }

    return this.prisma.overtime.update({
      data: {
        ...updateDto,
        updatedAt: m().utc().toDate(),
        updatedBy: user.id,
      },
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });
  }

  async remove(id: string, user: UserInterface) {
    const data = await this.findOne(id, user);
    if (!data) throw new NotFoundException();
    return this.prisma.overtime.update({
      data: {
        deletedAt: m().utc().toDate(),
        deletedBy: user.id,
      },
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });
  }
}
