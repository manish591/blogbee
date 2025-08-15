import crypto from 'node:crypto';

export function generateRandomString() {
  return crypto.randomBytes(32).toString('hex');
}
