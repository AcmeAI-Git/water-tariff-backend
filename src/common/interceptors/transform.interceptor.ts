import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // If data is already in the correct format, return it
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'statusCode' in data
        ) {
          return data;
        }

        // Default success messages based on status code
        let message = 'Success';
        if (statusCode === 201) {
          message = 'Resource created successfully';
        } else if (statusCode === 204) {
          message = 'Resource deleted successfully';
        }

        return new SuccessResponse(statusCode, message, data);
      }),
    );
  }
}
