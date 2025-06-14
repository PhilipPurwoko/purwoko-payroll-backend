import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  create(createAttendanceDto: CreateAttendanceDto) {
    return 'This action adds a new attendance';
  }

  findAll() {
    return `This action returns all attendance`;
  }

  findOne(id: string) {
    return `This action returns a #${id} attendance`;
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: string) {
    return `This action removes a #${id} attendance`;
  }
}
