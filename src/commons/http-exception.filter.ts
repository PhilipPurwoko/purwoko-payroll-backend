import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DEFAULT_INTERNAL_ERROR_MESSAGE } from './const';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = DEFAULT_INTERNAL_ERROR_MESSAGE;

    const error =
      exception instanceof HttpException
        ? exception.message
        : DEFAULT_INTERNAL_ERROR_MESSAGE;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (
        status === HttpStatus.BAD_REQUEST &&
        typeof res === 'object' &&
        'message' in res
      ) {
        message = (res as unknown as { message: string | string[] }).message;
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      status: false,
      error: error,
      message: message,
    });
  }
}
