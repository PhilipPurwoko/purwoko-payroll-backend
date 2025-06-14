import { Injectable } from '@nestjs/common';
import { CreateReimburseDto } from './dto/create-reimburse.dto';
import { UpdateReimburseDto } from './dto/update-reimburse.dto';

@Injectable()
export class ReimburseService {
  create(createReimburseDto: CreateReimburseDto) {
    return 'This action adds a new reimburse';
  }

  findAll() {
    return `This action returns all reimburse`;
  }

  findOne(id: string) {
    return `This action returns a #${id} reimburse`;
  }

  update(id: string, updateReimburseDto: UpdateReimburseDto) {
    return `This action updates a #${id} reimburse`;
  }

  remove(id: string) {
    return `This action removes a #${id} reimburse`;
  }
}
