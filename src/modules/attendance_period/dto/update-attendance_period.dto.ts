import { PartialType } from '@nestjs/swagger';
import { CreateAttendancePeriodDto } from './create-attendance_period.dto';

export class UpdateAttendancePeriodDto extends PartialType(CreateAttendancePeriodDto) {}
