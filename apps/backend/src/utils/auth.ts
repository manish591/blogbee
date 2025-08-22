import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

export const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword: string) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  return hashedPassword;
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export function generateRandomString() {
  return crypto.randomBytes(32).toString('hex');
}