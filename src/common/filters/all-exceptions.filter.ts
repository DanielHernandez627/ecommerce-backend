import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        error = {
          ...error,
          ...exceptionResponse,
          statusCode: status,
        };
      } else {
        error = {
          statusCode: status,
          message: exceptionResponse,
          timestamp: new Date().toISOString(),
          path: ctx.getRequest().url,
        };
      }
    } else if (exception instanceof Error) {
      error = {
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      };

      if (exception.message.includes('Duplicate entry')) {
        status = HttpStatus.BAD_REQUEST;
        error.statusCode = status;
        error.message = 'El registro ya existe';
      }
    }

    response.status(status).json(error);
  }
}
