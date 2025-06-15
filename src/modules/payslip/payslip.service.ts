import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class PayslipService {
  constructor(private prisma: PrismaService) {}

  findAll(user: UserInterface) {
    return this.prisma.payslip.findMany({
      include: {
        attendancePeriod: true,
      },
      where: {
        userId: user.id,
        deletedAt: null,
      },
    });
  }

  findOne(id: string, user: UserInterface) {
    return this.prisma.payslip.findFirst({
      include: {
        attendancePeriod: {
          include: {
            attendances: { where: { userId: user.id, deletedAt: null } },
            overtimes: { where: { userId: user.id, deletedAt: null } },
            reimbursements: { where: { userId: user.id, deletedAt: null } },
          },
        },
      },
      where: {
        id: id,
        userId: user.id,
        deletedAt: null,
      },
    });
  }
}
