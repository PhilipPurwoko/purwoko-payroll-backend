import { Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';

@Injectable()
export class SummaryService {
  create(createSummaryDto: CreateSummaryDto) {
    return 'This action adds a new summary';
  }

  findAll() {
    return `This action returns all summary`;
  }

  findOne(id: string) {
    return `This action returns a #${id} summary`;
  }

  update(id: string, updateSummaryDto: UpdateSummaryDto) {
    return `This action updates a #${id} summary`;
  }

  remove(id: string) {
    return `This action removes a #${id} summary`;
  }
}
