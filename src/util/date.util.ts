import { BadRequestException } from '@nestjs/common';

export function parseTimeToDate(time: string): Date {
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

  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
}
