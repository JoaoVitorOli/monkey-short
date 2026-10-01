import { readFileSync } from 'node:fs';
import type { IncomingHttpHeaders } from 'node:http';
import { join } from 'node:path';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

const notFoundPage = readFileSync(
  join(import.meta.dirname, '..', 'views', 'not-found.html'),
  'utf8',
);

@Catch(NotFoundException)
export class ShortUrlNotFoundFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ headers: IncomingHttpHeaders }>();
    const response = ctx.getResponse<unknown>();

    // API clients keep the JSON error, browsers get the HTML page
    if (!request.headers.accept?.includes('text/html')) {
      httpAdapter.reply(
        response,
        exception.getResponse(),
        exception.getStatus(),
      );
      return;
    }

    httpAdapter.setHeader(response, 'Content-Type', 'text/html; charset=utf-8');
    httpAdapter.reply(response, notFoundPage, exception.getStatus());
  }
}
