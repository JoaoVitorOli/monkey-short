import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  OBSERVE_APP_KEY: z.string().min(1),
  OBSERVE_APP_SECRET: z.string().min(1),
  OBSERVE_SERVICE_ID: z.string().min(1),
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(
      z.array(
        z.url({ protocol: /^https?$/ }).transform((url) => new URL(url).origin),
      ),
    ),
  MONGODB_URI: z
    .string()
    .regex(
      /^mongodb(\+srv)?:\/\//,
      'Must start with mongodb:// or mongodb+srv://',
    ),
  URL_BASE: z.url().min(1),
  REDIS_URI: z
    .string()
    .regex(/^rediss?:\/\//, 'Must start with redis:// or rediss://'),
});

export type Env = z.infer<typeof envSchema>;
