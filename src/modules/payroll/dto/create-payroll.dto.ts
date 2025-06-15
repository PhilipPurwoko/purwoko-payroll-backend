import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePayrollDto {
  @ApiProperty({
    description: 'UUID of the associated attendance period',
    example: 'b15cf5b1-3d0a-4d71-bf4f-ecb2cba7f4a3',
  })
  @IsNotEmpty()
  @IsUUID()
  attendancePeriodId: string;
}
