"server-only";

import { cookies } from "next/headers";

export async function serializeCookies() {
  const allCookies = await cookies();
  return allCookies.getAll().map(({ name, value }) => `${name}=${value}`).join(";");
}