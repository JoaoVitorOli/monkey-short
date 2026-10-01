import z from 'zod';

export const shortUrlSchema = z.object({
  url: z
    .url({ protocol: /^https?$/, error: 'Must be a valid http(s) URL' })
    .max(2048, 'URL must be at most 2048 characters'),
});

export type CreateShortURLDto = z.infer<typeof shortUrlSchema>;
