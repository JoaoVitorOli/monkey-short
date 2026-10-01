import z from 'zod';

const shortUrlSchema = z.object({
  url: z.url('Invalid URL format'),
});

export type CreateShortURLDto = z.infer<typeof shortUrlSchema>;
