import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendancePeriodDto } from './create-attendance_period.dto';

export class UpdateAttendancePeriodDto extends PartialType(CreateAttendancePeriodDto) {}
