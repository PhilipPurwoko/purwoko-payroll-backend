import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const round = parseInt(
      this.configService.get<string>('SALT_ROUNDS') || '10',
    );
    const passwordHash = hashSync(password, round);
    return this.prisma.user.create({
      omit: {
        password: true,
      },
      data: {
        ...rest,
        password: passwordHash,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
      where: {
        deletedAt: null,
      },
    });
  }

  findOne(idOrEmail: string, omitPassword = true) {
    return this.prisma.user.findFirst({
      omit: {
        password: omitPassword,
      },
      where: {
        OR: [
          {
            id: idOrEmail,
          },
          {
            email: idOrEmail,
          },
        ],
        deletedAt: null,
      },
      include: {
        attendances: { where: { deletedAt: null } },
        overtimes: { where: { deletedAt: null } },
        reimbursements: { where: { deletedAt: null } },
        payrolls: { where: { deletedAt: null } },
        payslips: { where: { deletedAt: null } },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = await this.findOne(id);
    if (!data) throw new NotFoundException();
    return this.prisma.user.update({
      omit: {
        password: true,
      },
      data: {
        ...updateUserDto,
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
    return this.prisma.user.update({
      omit: {
        password: true,
      },
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
