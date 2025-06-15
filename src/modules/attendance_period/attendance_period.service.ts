import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class AttendancePeriodService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendancePeriodDto, actor: UserInterface) {
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
    return this.prisma.attendancePeriod.update({
      data: {
        ...updateDto,
        updatedAt: new Date(),
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
        deletedAt: new Date(),
        deletedBy: actor.id,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }
}
