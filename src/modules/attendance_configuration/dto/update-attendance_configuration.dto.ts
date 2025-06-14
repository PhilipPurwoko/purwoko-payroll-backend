import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceConfigurationDto } from './create-attendance_configuration.dto';

export class UpdateAttendanceConfigurationDto extends PartialType(CreateAttendanceConfigurationDto) {}
