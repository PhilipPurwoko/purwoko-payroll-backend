import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';
import { RequestContext } from '../commons/request-context.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = v4();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    this.requestContext.run(() => next(), {
      requestId,
      ip: Array.isArray(ip) ? ip[0] : ip,
    });
  }
}
