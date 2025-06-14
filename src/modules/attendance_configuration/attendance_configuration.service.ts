import { Injectable } from '@nestjs/common';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';

@Injectable()
export class AttendanceConfigurationService {
  create(createAttendanceConfigurationDto: CreateAttendanceConfigurationDto) {
    return 'This action adds a new attendanceConfiguration';
  }

  findAll() {
    return `This action returns all attendanceConfiguration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceConfiguration`;
  }

  update(id: number, updateAttendanceConfigurationDto: UpdateAttendanceConfigurationDto) {
    return `This action updates a #${id} attendanceConfiguration`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceConfiguration`;
  }
}
