import { Injectable } from '@nestjs/common';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';

@Injectable()
export class AttendancePeriodService {
  create(createAttendancePeriodDto: CreateAttendancePeriodDto) {
    return 'This action adds a new attendancePeriod';
  }

  findAll() {
    return `This action returns all attendancePeriod`;
  }

  findOne(id: string) {
    return `This action returns a #${id} attendancePeriod`;
  }

  update(id: string, updateAttendancePeriodDto: UpdateAttendancePeriodDto) {
    return `This action updates a #${id} attendancePeriod`;
  }

  remove(id: string) {
    return `This action removes a #${id} attendancePeriod`;
  }
}
