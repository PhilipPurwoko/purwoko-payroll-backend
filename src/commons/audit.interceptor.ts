import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AppService } from '../app.service';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly appService: AppService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserInterface;
    const method = request.method;
    const url = request.url;

    try {
      return next.handle().pipe(
        tap(async (dataAfter): Promise<void> => {
          if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

          await this.appService.auditLog({
            userId: user?.id,
            createdBy: user?.id,
            action: method,
            description: undefined,
            endpoint: url,
            dto: request.body,
            dataBefore: undefined,
            dataAfter: dataAfter,
          });
        }),
      );
    } catch (error) {
      console.log(`ERROR: ${error}`);
      return next.handle();
    }
  }
}
