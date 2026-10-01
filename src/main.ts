import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EnvConfigService } from './shared/env-config/env-config.service.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      instrument: ObserveInstrument,
    },
  );

  const env = app.get(EnvConfigService);

  app.enableCors({
    origin: env.get('CORS_ORIGINS'),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400,
  });

  app.useStaticAssets({
    root: join(import.meta.dirname, '..', 'public'),
    prefix: '/assets/',
    maxAge: '7d',
  });

  await app.listen(env.get('PORT'));
}
await bootstrap();
