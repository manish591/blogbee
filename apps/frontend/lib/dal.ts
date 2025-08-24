import "server-only";

import { cookies } from "next/headers";

export type User = {
  name: string,
  email: string,
  profileImg?: string,
  createdAt?: string,
  updatedAt?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function verifySession(): Promise<{ isAuthenticated: boolean, user: User } | null> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const token = (await cookies()).get('sessionId')?.value;
  const res = await fetch(`${API_URL}/v1/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  const data = await res.json();

  if (!res.ok) {
    return null;
  }

  return { isAuthenticated: true, user: data.data };
}