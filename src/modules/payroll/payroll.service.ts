import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UserInterface } from '../../interfaces/user.interface';
import { InjectQueue } from '@nestjs/bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bull';
import { Role, Status } from '@prisma/client';

@Injectable()
export class PayrollService {
  constructor(
    @InjectQueue('payroll') private queue: Queue,
    private prisma: PrismaService,
  ) {}

  async create(createPayrollDto: CreatePayrollDto, user: UserInterface) {
    const attendancePeriod = await this.prisma.attendancePeriod.findFirst({
      where: {
        id: createPayrollDto.attendancePeriodId,
        status: Status.ongoing,
        deletedAt: null,
        attendanceConfiguration: {
          deletedAt: null,
        },
      },
      include: {
        attendanceConfiguration: { where: { deletedAt: null } },
      },
    });
    if (!attendancePeriod) {
      throw new BadRequestException('Attendance period not found');
    }

    const employees = await this.prisma.user.findMany({
      where: {
        role: Role.employee,
        deletedAt: null,
      },
    });

    for (const employee of employees) {
      await this.queue.add('process-payroll', {
        actor: user,
        attendancePeriod: attendancePeriod,
        employee: employee,
      });
    }

    await this.prisma.attendancePeriod.update({
      where: {
        id: createPayrollDto.attendancePeriodId,
      },
      data: {
        status: Status.completed,
      },
    });

    return `Successfully running payroll for ${employees.length} employees`;
  }
}
