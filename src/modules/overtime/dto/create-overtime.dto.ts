import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateOvertimeDto {
  @ApiProperty({
    example: 3,
    description: 'Hours of overtime taken',
  })
  @IsNumber()
  @IsPositive()
  hoursTaken: number;

  @ApiProperty({
    description: 'UUID of the associated attendance id',
    example: 'b15cf5b1-3d0a-4d71-bf4f-ecb2cba7f4a3',
  })
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;
}
