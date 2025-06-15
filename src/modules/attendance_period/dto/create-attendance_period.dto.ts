import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttendancePeriodDto {
  @ApiProperty({
    description: 'Start date of the attendance period (ISO 8601 format)',
    example: '2025-06-15T08:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @ApiProperty({
    description: 'End date of the attendance period (ISO 8601 format)',
    example: '2025-06-30T17:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @ApiProperty({
    description: 'UUID of the associated attendance configuration',
    example: 'b15cf5b1-3d0a-4d71-bf4f-ecb2cba7f4a3',
  })
  @IsNotEmpty()
  @IsUUID()
  attendanceConfigurationId: string;
}
