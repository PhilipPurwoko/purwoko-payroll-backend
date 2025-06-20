import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AttendancePeriodService } from './attendance_period.service';
import { CreateAttendancePeriodDto } from './dto/create-attendance_period.dto';
import { UpdateAttendancePeriodDto } from './dto/update-attendance_period.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('attendance-period')
export class AttendancePeriodController {
  constructor(
    private readonly attendancePeriodService: AttendancePeriodService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  create(
    @Req() req: Request,
    @Body() createAttendancePeriodDto: CreateAttendancePeriodDto,
  ) {
    return this.attendancePeriodService.create(
      createAttendancePeriodDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.attendancePeriodService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancePeriodService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAttendancePeriodDto: UpdateAttendancePeriodDto,
  ) {
    return this.attendancePeriodService.update(
      id,
      updateAttendancePeriodDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.attendancePeriodService.remove(id, req.user as UserInterface);
  }
}
