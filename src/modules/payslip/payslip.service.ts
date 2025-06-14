import { Injectable } from '@nestjs/common';
import { CreatePayslipDto } from './dto/create-payslip.dto';
import { UpdatePayslipDto } from './dto/update-payslip.dto';

@Injectable()
export class PayslipService {
  create(createPayslipDto: CreatePayslipDto) {
    return 'This action adds a new payslip';
  }

  findAll() {
    return `This action returns all payslip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payslip`;
  }

  update(id: number, updatePayslipDto: UpdatePayslipDto) {
    return `This action updates a #${id} payslip`;
  }

  remove(id: number) {
    return `This action removes a #${id} payslip`;
  }
}
