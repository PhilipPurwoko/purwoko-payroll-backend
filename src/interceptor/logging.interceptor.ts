import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

import { AppLogger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, headers, body } = req;

    const now = Date.now();
    this.logger.log(
      `[${method}] ${url} | authorization: ${JSON.stringify(headers.authorization)} | body: ${JSON.stringify(body)}`,
    );
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `[${method}] ${url} Finished in [${Date.now() - now}ms]`,
          ),
        ),
      );
  }
}
