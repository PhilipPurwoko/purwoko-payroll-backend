import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';
import { m } from '../../util/date.util';

@Injectable()
export class AttendancePeriodService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAttendancePeriodDto, actor: UserInterface) {
    const attendanceConfig =
      await this.prisma.attendanceConfiguration.findFirst({
        where: {
          id: createDto.attendanceConfigurationId,
          deletedAt: null,
        },
      });
    if (!attendanceConfig) {
      throw new NotFoundException('Attendance configuration not found');
    }
    return this.prisma.attendancePeriod.create({
      data: {
        ...createDto,
        createdBy: actor.id,
      },
    });
  }

  findAll() {
    return this.prisma.attendancePeriod.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.attendancePeriod.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    updateDto: UpdateAttendancePeriodDto,
    actor: UserInterface,
  ) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();

    if (updateDto.attendanceConfigurationId) {
      const attendanceConfig =
        await this.prisma.attendanceConfiguration.findFirst({
          where: {
            id: updateDto.attendanceConfigurationId,
            deletedAt: null,
          },
        });
      if (!attendanceConfig) {
        throw new NotFoundException('Attendance configuration not found');
      }
    }

    return this.prisma.attendancePeriod.update({
      data: {
        ...updateDto,
        updatedAt: m().utc().toDate(),
        updatedBy: actor.id,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async remove(id: string, actor: UserInterface) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    return this.prisma.attendancePeriod.update({
      data: {
        deletedAt: m().utc().toDate(),
        deletedBy: actor.id,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
