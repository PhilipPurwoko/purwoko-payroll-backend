import { PartialType } from '@nestjs/swagger';
import { CreateReimburseDto } from './create-reimburse.dto';

export class UpdateReimburseDto extends PartialType(CreateReimburseDto) {}
