import { API_URL } from "@/constants";
import "server-only";
import { serializeCookies } from "@/lib/cookie";

export type User = {
  name: string,
  email: string,
  profileImg?: string,
  createdAt?: string,
  updatedAt?: string
}

export type VerifySessionOutput = {
  isAuth: boolean,
  user: User,
}

export async function verifySession(): Promise<VerifySessionOutput | null> {
  if (!API_URL) {
    throw new Error("ENV_NOT_DEFINED_ERROR: API URL is not defined");
  }

  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/users/me`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader
    }
  });
  const data = await res.json();

  if (!res.ok) {
    console.log("AUTHORIZATION_FAILED_ERROR: Failed to verify user");
    return null;
  }

  return { isAuth: true, user: data.data };
}