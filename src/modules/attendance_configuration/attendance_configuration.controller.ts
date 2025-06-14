import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceConfigurationService } from './attendance_configuration.service';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';

@Controller('attendance-configuration')
export class AttendanceConfigurationController {
  constructor(private readonly attendanceConfigurationService: AttendanceConfigurationService) {}

  @Post()
  create(@Body() createAttendanceConfigurationDto: CreateAttendanceConfigurationDto) {
    return this.attendanceConfigurationService.create(createAttendanceConfigurationDto);
  }

  @Get()
  findAll() {
    return this.attendanceConfigurationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceConfigurationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceConfigurationDto: UpdateAttendanceConfigurationDto) {
    return this.attendanceConfigurationService.update(+id, updateAttendanceConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceConfigurationService.remove(+id);
  }
}
