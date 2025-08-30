'use server';

import { cookies } from 'next/headers';
import type { SignupFormData } from '@/components/web/signup-form';
import { API_URL } from '@/constants';

export async function createUser(data: SignupFormData) {
  const res = await fetch(`${API_URL}/v1/users`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('SINGUP_FAILED: failed to signup user');
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
