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
import { ReimburseService } from './reimburse.service';
import { CreateReimburseDto } from './dto/create-reimburse.dto';
import { UpdateReimburseDto } from './dto/update-reimburse.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Request } from 'express';
import { UserInterface } from '../../interfaces/user.interface';

@Controller('reimburse')
export class ReimburseController {
  constructor(private readonly reimburseService: ReimburseService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Post()
  create(@Body() createReimburseDto: CreateReimburseDto, @Req() req: Request) {
    return this.reimburseService.create(
      createReimburseDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get()
  findAll(@Req() req: Request) {
    return this.reimburseService.findAll(req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.reimburseService.findOne(id, req.user as UserInterface);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReimburseDto: UpdateReimburseDto,
    @Req() req: Request,
  ) {
    return this.reimburseService.update(
      id,
      updateReimburseDto,
      req.user as UserInterface,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('employee')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.reimburseService.remove(id, req.user as UserInterface);
  }
}
