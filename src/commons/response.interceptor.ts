import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseInterface } from '../interfaces/response.interface';
import { DEFAULT_SUCCESS_MESSAGE } from './const';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseInterface>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseInterface> {
    return next.handle().pipe(
      map((data: T): ResponseInterface => {
        return {
          status: true,
          message: DEFAULT_SUCCESS_MESSAGE,
          data: data,
        };
      }),
    );
  }
}
