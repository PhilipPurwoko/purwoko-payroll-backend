import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  async findAll(attendancePeriodId: string) {
    const attendancePeriod = await this.prisma.attendancePeriod.findFirst({
      where: {
        id: attendancePeriodId,
        deletedAt: null,
      },
    });
    if (!attendancePeriod) {
      throw new NotFoundException('Attendance period not found');
    }

    const allPayslips = await this.prisma.user.findMany({
      include: {
        payslips: {
          where: {
            attendancePeriodId: attendancePeriodId,
            deletedAt: null,
          },
        },
      },
      where: {
        role: Role.employee,
        deletedAt: null,
      },
    });

    const totalTakeHomePayAmount = allPayslips.reduce(
      (total, employee) =>
        total +
        (employee.payslips.reduce(
          (total, payslip) => total + (payslip.takeHomePay ?? 0),
          0,
        ) ?? 0),
      0,
    );

    return {
      attendancePeriod: attendancePeriod,
      totalTakeHomePayAmount: totalTakeHomePayAmount,
      employees: allPayslips,
    };
  }
}
