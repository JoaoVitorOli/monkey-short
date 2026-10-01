import z from 'zod';

const redirectUrlSchema = z.object({
  code: z
    .string()
    .min(7)
    .max(7, 'Code must be exactly 7 characters long')
    .regex(/^[a-zA-Z0-9]+$/, 'Code must be alphanumeric'),
});

export type RedirectUrlDto = z.infer<typeof redirectUrlSchema>;
