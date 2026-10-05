import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { EnvConfigService } from '../shared/env-config/env-config.service.js';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [EnvConfigService],
      useFactory: async (env: EnvConfigService) => {
        return {
          ttl: 7 * 24 * 60 * 60 * 1000,
          stores: [createKeyv(env.get('REDIS_URI'))],
        };
      },
    }),
  ],
  controllers: [],
})
export class RedisModule {}
