"use server";

import { cookies } from "next/headers";
import type { LoginFormData } from "@/components/login-form";
import { API_URL } from "@/constants";

export async function loginUser(data: LoginFormData) {
  if (!API_URL) {
    throw new Error('API_URL not defined');
  }

  const res = await fetch(`${API_URL}/v1/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('LOGIN_FAILED: Failed to login user');
  }

  const cookieSetter = await cookies();
  const setCookieStr = res.headers.get('set-cookie');

  if (setCookieStr) {
    const authCookie = setCookieStr.split(';')[0];
    const authCookieData = authCookie.split('=');

    cookieSetter.set(authCookieData[0], authCookieData[1], {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
}