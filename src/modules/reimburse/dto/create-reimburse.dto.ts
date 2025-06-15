import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateReimburseDto {
  @ApiProperty({
    example: 200000,
    description: 'Reimbursement amount',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'Fuel cost for travel',
    description: 'Reimbursement purpose',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
