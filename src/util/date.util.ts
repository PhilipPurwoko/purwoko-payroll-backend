import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment-timezone';

// Set default timezone to UTC globally
moment.tz.setDefault('UTC');
export const m = moment;

export function parseTimeToDate(time: string) {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    throw new BadRequestException('Time must be in HH:mm:ss format');
  }

  const [hours, minutes, seconds] = time.split(':').map(Number);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    throw new BadRequestException('Invalid time values');
  }

  return m().set({
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: 0,
  });
}
