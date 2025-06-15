import { Injectable, Logger } from '@nestjs/common';
import { RequestContext } from '../commons/request-context.service';

@Injectable()
export class AppLogger extends Logger {
  constructor(private readonly requestContext: RequestContext) {
    super();
  }

  private prefix() {
    const requestId = this.requestContext.get<string>('requestId') ?? 'N/A';
    const ip = this.requestContext.get<string>('ip') ?? 'unknown';
    return `[${ip}][${requestId}]`;
  }

  log(message: string) {
    super.log(`${this.prefix()} ${message}`);
  }

  error(message: string, trace?: string) {
    super.error(`${this.prefix()} ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`${this.prefix()} ${message}`);
  }

  debug(message: string) {
    super.debug(`${this.prefix()} ${message}`);
  }

  verbose(message: string) {
    super.verbose(`${this.prefix()} ${message}`);
  }
}
