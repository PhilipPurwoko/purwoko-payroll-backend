import { Prisma } from '@prisma/client';

export interface AuditLogInterface {
  userId: string;
  requestId?: string;
  ipAddress?: string;
  action?: string;
  description?: string;
  endpoint?: string;
  dto?: Prisma.InputJsonValue;
  dataBefore?: Prisma.InputJsonValue;
  dataAfter?: Prisma.InputJsonValue;
  createdBy?: string;
}
