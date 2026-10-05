import { Module } from '@nestjs/common';
import { ShortenModule } from './shorten/shorten.module.js';
import { EnvConfigModule } from './shared/env-config/env-config.module.js';
import { ObserveConfigModule } from './shared/observe/observe-config.module.js';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from './shared/env-config/env-config.service.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    EnvConfigModule,
    ObserveConfigModule,
    ShortenModule,
    RedisModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: minutes(1), limit: 100 }],
    }),
    MongooseModule.forRootAsync({
      inject: [EnvConfigService],
      useFactory: (env: EnvConfigService) => ({ uri: env.get('MONGODB_URI') }),
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
