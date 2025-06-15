import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get(':attendancePeriodId')
  findAll(@Param('attendancePeriodId') attendancePeriodId: string) {
    return this.summaryService.findAll(attendancePeriodId);
  }
}
