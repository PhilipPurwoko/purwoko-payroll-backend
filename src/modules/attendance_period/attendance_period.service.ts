import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendancePeriodService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendancePeriodDto) {
    return this.prisma.attendancePeriod.create({
      data: {
        ...createDto,
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

  async update(id: string, updateDto: UpdateAttendancePeriodDto) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    return this.prisma.attendancePeriod.update({
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async remove(id: string) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    return this.prisma.attendancePeriod.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
