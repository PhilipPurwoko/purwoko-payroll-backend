import { PartialType } from '@nestjs/mapped-types';
import { CreateReimburseDto } from './create-reimburse.dto';

export class UpdateReimburseDto extends PartialType(CreateReimburseDto) {}
