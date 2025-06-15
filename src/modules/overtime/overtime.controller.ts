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
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto, @Req() req: Request) {
    return this.overtimeService.create(
      createOvertimeDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get()
  findAll(@Req() req: Request) {
    return this.overtimeService.findAll(req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.overtimeService.findOne(id, req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto,
    @Req() req: Request,
  ) {
    return this.overtimeService.update(
      id,
      updateOvertimeDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.overtimeService.remove(id, req.user as UserInterface);
  }
}
