import { Injectable } from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendanceConfigurationDto) {
    return this.prisma.attendanceConfiguration.create({
      data: {
        ...createDto,
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
