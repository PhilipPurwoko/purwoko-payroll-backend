import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { m, parseTimeToDate } from '../../util/date.util';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class AttendanceConfigurationService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAttendanceConfigurationDto, actor: UserInterface) {
    const { startAt, endAt, ...rest } = createDto;
    const start = parseTimeToDate(startAt);
    const end = parseTimeToDate(endAt);

    if (end <= start) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.prisma.attendanceConfiguration.create({
      data: {
        ...rest,
        startAt: start.utc().toDate(),
        endAt: end.utc().toDate(),
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
    return this.prisma.attendanceConfiguration.update({
      data: {
        deletedAt: m().utc().toDate(),
      },
      where: {
        id,
        deletedAt: null,
        deletedBy: actor.id,
      },
    });
  }
}
