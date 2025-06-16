import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateAttendanceConfigurationDto {
  @ApiProperty({
    description: 'Start time in HH:mm:ss format',
    example: '08:00:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'startAt must be in HH:mm:ss format',
  })
  startAt: string;

  @ApiProperty({
    description: 'End time in HH:mm:ss format',
    example: '17:30:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
    message: 'endAt must be in HH:mm:ss format',
  })
  endAt: string;
}
