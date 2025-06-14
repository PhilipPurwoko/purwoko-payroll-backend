import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      omit: {
        password: true,
      },
      data: {
        ...createUserDto,
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

  findOne(id: string) {
    return this.prisma.user.findFirst({
      omit: {
        password: true,
      },
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
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

  remove(id: string) {
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
