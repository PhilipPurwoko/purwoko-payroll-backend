import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceConfigurationDto } from './create-attendance_configuration.dto';

export class UpdateAttendanceConfigurationDto extends PartialType(CreateAttendanceConfigurationDto) {}
