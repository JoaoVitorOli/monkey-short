import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ShortenModule } from './shorten/shorten.module.js';
import { EnvConfigModule } from './shared/env-config/env-config.module.js';
import { ObserveConfigModule } from './shared/observe/observe-config.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [EnvConfigModule, ObserveConfigModule, ShortenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
