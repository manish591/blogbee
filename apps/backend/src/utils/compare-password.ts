import bcrypt from 'bcrypt';

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}
