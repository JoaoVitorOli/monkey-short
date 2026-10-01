import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ShortenModule } from './shorten/shorten.module.js';
import { EnvConfigModule } from './shared/env-config/env-config.module.js';
import { ObserveConfigModule } from './shared/observe/observe-config.module.js';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    EnvConfigModule,
    ObserveConfigModule,
    ShortenModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: minutes(1), limit: 100 }],
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
