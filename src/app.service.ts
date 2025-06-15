import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuditLogInterface } from './interfaces/audit_log.interface';
import { RequestContext } from './commons/request-context.service';

@Injectable()
export class AppService {
  constructor(
    private readonly requestContext: RequestContext,
    private readonly prisma: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async auditLog(data: AuditLogInterface) {
    const requestId = this.requestContext.get<string>('requestId') ?? 'N/A';
    const ip = this.requestContext.get<string>('ip') ?? 'unknown';

    try {
      await this.prisma.auditLog.create({
        data: {
          ipAddress: ip,
          requestId: requestId,
          ...data,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
