import { Injectable } from '@nestjs/common';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Injectable()
export class OvertimeService {
  create(createOvertimeDto: CreateOvertimeDto) {
    return 'This action adds a new overtime';
  }

  findAll() {
    return `This action returns all overtime`;
  }

  findOne(id: string) {
    return `This action returns a #${id} overtime`;
  }

  update(id: string, updateOvertimeDto: UpdateOvertimeDto) {
    return `This action updates a #${id} overtime`;
  }

  remove(id: string) {
    return `This action removes a #${id} overtime`;
  }
}
