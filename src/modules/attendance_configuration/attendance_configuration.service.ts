import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { parseTimeToDate } from '../../util/date.util';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class AttendanceConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendanceConfigurationDto, actor: UserInterface) {
    const { periodStartAt, periodEndAt, ...rest } = createDto;
    const start = parseTimeToDate(periodStartAt);
    const end = parseTimeToDate(periodEndAt);

    if (end <= start) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.prisma.attendanceConfiguration.create({
      data: {
        ...rest,
        periodStartAt: start,
        periodEndAt: end,
        createdBy: actor.id,
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

  async update(
    id: string,
    updateDto: UpdateAttendanceConfigurationDto,
    actor: UserInterface,
  ) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    return this.prisma.attendanceConfiguration.update({
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
    return this.prisma.attendanceConfiguration.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
        deletedAt: null,
        deletedBy: actor.id,
      },
    });
  }
}
