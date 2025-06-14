import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAttendanceConfigurationDto {
  @ApiProperty({
    example: '2025-06-14T09:00:00.000Z',
    description: 'Shift start timestamp (ISO format)',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'periodStartAt must be a valid date' })
  periodStartAt: Date;

  @ApiProperty({
    example: '2025-06-14T17:00:00.000Z',
    description: 'Shift end timestamp (ISO format)',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate({ message: 'periodEndAt must be a valid date' })
  periodEndAt: Date;

  @ApiProperty({
    example: 25.5,
    description: 'Standard hourly pay rate',
  })
  @IsNumber()
  @IsPositive()
  hourlyRate: number;

  @ApiProperty({
    example: 38.25,
    description: 'Hourly pay rate for overtime',
  })
  @IsNumber()
  @IsPositive()
  overtimeRate: number;

  @ApiProperty({
    example: 1.5,
    description: 'Overtime multiplier applied to hourly rate',
  })
  @IsNumber()
  @IsPositive()
  overtimeMultiplier: number;
}
