import { UserInterface } from './user.interface';
import {
  AttendanceConfiguration,
  AttendancePeriod,
  User,
} from '@prisma/client';

export interface PayrollQueueInterface {
  actor: UserInterface;
  employee: User;
  attendancePeriod: AttendancePeriodInterface;
}

export interface AttendancePeriodInterface extends AttendancePeriod {
  attendanceConfiguration: AttendanceConfiguration;
}
