'use server';

import { cookies } from 'next/headers';
import type { LoginFormData } from '@/components/login-form';
import type { SignupFormData } from '@/components/signup-form';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';

export async function createUser(data: SignupFormData) {
  if (!API_URL) {
    throw new Error('API_URL not defined');
  }

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

export async function signoutUser() {
  if (!API_URL) {
    throw new Error('API_URL not defined');
  }

  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/users/logout`, {
    method: 'POST',
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error('SIGNOUT_FAILED_ERROR: Failed to signout user');
  }

  const cookieFunc = await cookies();
  const setCookieStr = res.headers.get('set-cookie');

  if (setCookieStr) {
    const authCookie = setCookieStr.split(';')[0];
    const authCookieData = authCookie.split('=');
    cookieFunc.delete(authCookieData[0]);
  }
}
