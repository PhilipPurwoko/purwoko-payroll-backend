import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReimburseDto } from './dto/create-reimburse.dto';
import { UpdateReimburseDto } from './dto/update-reimburse.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable()
export class ReimburseService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateReimburseDto, user: UserInterface) {
    const now = new Date();

    const attendancePeriod = await this.prisma.attendancePeriod.findFirst({
      where: {
        startAt: { lte: now },
        endAt: { gte: now },
        deletedAt: null,
      },
    });
    if (!attendancePeriod) throw new Error('Attendance period not found');

    return this.prisma.reimbursement.create({
      data: {
        ...createDto,
        userId: user.id,
        attendancePeriodId: attendancePeriod.id,
      },
    });
  }

  findAll(user: UserInterface) {
    return this.prisma.reimbursement.findMany({
      where: {
        deletedAt: null,
        userId: user.id,
      },
    });
  }

  findOne(id: string, user: UserInterface) {
    return this.prisma.reimbursement.findFirst({
      where: {
        id,
        deletedAt: null,
        userId: user.id,
      },
    });
  }

  async update(id: string, updateDto: UpdateReimburseDto, user: UserInterface) {
    const data = await this.findOne(id, user);
    if (!data) throw new NotFoundException();
    return this.prisma.reimbursement.update({
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

  async remove(id: string, user: UserInterface) {
    const data = await this.findOne(id, user);
    if (!data) throw new NotFoundException();
    return this.prisma.reimbursement.update({
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
