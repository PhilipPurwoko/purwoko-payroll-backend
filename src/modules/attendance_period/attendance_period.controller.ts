import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendancePeriodService } from './attendance_period.service';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';

@Controller('attendance-period')
export class AttendancePeriodController {
  constructor(private readonly attendancePeriodService: AttendancePeriodService) {}

  @Post()
  create(@Body() createAttendancePeriodDto: CreateAttendancePeriodDto) {
    return this.attendancePeriodService.create(createAttendancePeriodDto);
  }

  @Get()
  findAll() {
    return this.attendancePeriodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancePeriodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendancePeriodDto: UpdateAttendancePeriodDto) {
    return this.attendancePeriodService.update(+id, updateAttendancePeriodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancePeriodService.remove(+id);
  }
}
