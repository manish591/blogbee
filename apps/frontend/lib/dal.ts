import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type User = {
  name: string,
  email: string,
  profileImg?: string,
  createdAt?: string,
  updatedAt?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function verifySession(): Promise<{ isAuthenticated: boolean, user: User }> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const token = (await cookies()).get('sessionId')?.value;
  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  const data = await res.json();

  if (!res.ok) {
    redirect("/login");
  }

  return { isAuthenticated: true, user: data.data };
}