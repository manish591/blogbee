import bcrypt from 'bcrypt';

export const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword: string) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  return hashedPassword;
}
