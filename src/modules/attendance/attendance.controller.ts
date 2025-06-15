import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Post()
  create(@Req() req: Request) {
    return this.attendanceService.create(req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get()
  findAll(@Req() req: Request) {
    return this.attendanceService.findAll(req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.attendanceService.findOne(id, req.user as UserInterface);
  }
}
