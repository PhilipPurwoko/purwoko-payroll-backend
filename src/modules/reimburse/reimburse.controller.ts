import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReimburseService } from './reimburse.service';
import { CreateReimburseDto } from './dto/create-reimburse.dto';
import { UpdateReimburseDto } from './dto/update-reimburse.dto';

@Controller('reimburse')
export class ReimburseController {
  constructor(private readonly reimburseService: ReimburseService) {}

  @Post()
  create(@Body() createReimburseDto: CreateReimburseDto) {
    return this.reimburseService.create(createReimburseDto);
  }

  @Get()
  findAll() {
    return this.reimburseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reimburseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReimburseDto: UpdateReimburseDto) {
    return this.reimburseService.update(+id, updateReimburseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reimburseService.remove(+id);
  }
}
