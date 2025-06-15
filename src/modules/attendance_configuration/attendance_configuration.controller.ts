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
import { AttendanceConfigurationService } from './attendance_configuration.service';
import { CreateAttendanceConfigurationDto } from './dto/create-attendance_configuration.dto';
import { UpdateAttendanceConfigurationDto } from './dto/update-attendance_configuration.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('attendance-configuration')
export class AttendanceConfigurationController {
  constructor(
    private readonly attendanceConfigurationService: AttendanceConfigurationService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  create(
    @Req() req: Request,
    @Body() createAttendanceConfigurationDto: CreateAttendanceConfigurationDto,
  ) {
    return this.attendanceConfigurationService.create(
      createAttendanceConfigurationDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.attendanceConfigurationService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceConfigurationService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAttendanceConfigurationDto: UpdateAttendanceConfigurationDto,
  ) {
    return this.attendanceConfigurationService.update(
      id,
      updateAttendanceConfigurationDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.attendanceConfigurationService.remove(
      id,
      req.user as UserInterface,
    );
  }
}
