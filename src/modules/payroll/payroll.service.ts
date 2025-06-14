import { Injectable } from '@nestjs/common';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Injectable()
export class PayrollService {
  create(createPayrollDto: CreatePayrollDto) {
    return 'This action adds a new payroll';
  }

  findAll() {
    return `This action returns all payroll`;
  }

  findOne(id: string) {
    return `This action returns a #${id} payroll`;
  }

  update(id: string, updatePayrollDto: UpdatePayrollDto) {
    return `This action updates a #${id} payroll`;
  }

  remove(id: string) {
    return `This action removes a #${id} payroll`;
  }
}
