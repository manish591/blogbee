'use server';

import { cookies } from 'next/headers';
import { API_URL } from '@/constants';
import { serializeCookies } from '@/lib/cookie';


export async function logoutUser() {
  const cookieHeader = await serializeCookies();

  const res = await fetch(`${API_URL}/v1/users/logout`, {
    method: 'POST',
    headers: {
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    throw new Error('SIGNOUT_FAILED_ERROR: Failed to logout user');
  }

  const cookieFunc = await cookies();
  const setCookieStr = res.headers.get('set-cookie');

  if (setCookieStr) {
    const authCookie = setCookieStr.split(';')[0];
    const authCookieData = authCookie.split('=');
    cookieFunc.delete(authCookieData[0]);
  }
}
