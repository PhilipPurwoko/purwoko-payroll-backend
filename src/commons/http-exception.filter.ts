import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseInterface } from '../interfaces/response.interface';
import { DEFAULT_INTERNAL_ERROR_MESSAGE } from './const';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : DEFAULT_INTERNAL_ERROR_MESSAGE;

    const errorResponse: ResponseInterface = {
      status: false,
      error: message,
    };

    response.status(status).json(errorResponse);
  }
}
