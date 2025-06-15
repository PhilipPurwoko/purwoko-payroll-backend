import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';
import { PrismaService } from '../../prisma/prisma.service';
import moment from 'moment';

@Injectable()
export class AttendanceConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendanceConfigurationDto) {
    const { periodStartAt, periodEndAt, ...rest } = createDto;

    if (!moment(periodStartAt, 'HH:mm:ss', true).isValid()) {
      throw new BadRequestException('Invalid startTime format');
    }
    if (!moment(periodEndAt, 'HH:mm:ss', true).isValid()) {
      throw new BadRequestException('Invalid endTime format');
    }

    const start = moment(periodStartAt, 'HH:mm:ss');
    const end = moment(periodEndAt, 'HH:mm:ss');

    if (!end.isAfter(start)) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.prisma.attendanceConfiguration.create({
      data: {
        ...rest,
        periodStartAt: start.toDate(),
        periodEndAt: end.toDate(),
      },
    });
  }

  findAll() {
    return this.prisma.attendanceConfiguration.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.attendanceConfiguration.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  update(id: string, updateDto: UpdateAttendanceConfigurationDto) {
    return this.prisma.attendanceConfiguration.update({
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

  remove(id: string) {
    return this.prisma.attendanceConfiguration.update({
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
