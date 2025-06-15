import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  create(@Body() createPayrollDto: CreatePayrollDto, @Req() req: Request) {
    return this.payrollService.create(
      createPayrollDto,
      req.user as UserInterface,
    );
  }
}
