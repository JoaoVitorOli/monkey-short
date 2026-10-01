import { Module } from '@nestjs/common';
import { EnvConfigService } from '../env-config/env-config.service.js';
import { ObserveModule } from './observe.instrument.js';

@Module({
  imports: [
    ObserveModule.forRootAsync({
      inject: [EnvConfigService],
      useFactory: (env: EnvConfigService) => ({
        appKey: env.get('OBSERVE_APP_KEY'),
        appSecret: env.get('OBSERVE_APP_SECRET'),
        serviceId: env.get('OBSERVE_SERVICE_ID'),
      }),
    }),
  ],
})
export class ObserveConfigModule {}
