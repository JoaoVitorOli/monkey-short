import { randomInt } from 'node:crypto';

const ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const SHORT_CODE_LENGTH = 7;

export function generateShortCode(): string {
  let code = '';

  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    const randomIndex = randomInt(0, ALPHABET.length);
    code += ALPHABET[randomIndex];
  }

  return code;
}
