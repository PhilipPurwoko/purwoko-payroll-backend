import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PayslipService } from './payslip.service';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('payslip')
export class PayslipController {
  constructor(private readonly payslipService: PayslipService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get()
  findAll(@Req() req: Request) {
    return this.payslipService.findAll(req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.payslipService.findOne(id, req.user as UserInterface);
  }
}
