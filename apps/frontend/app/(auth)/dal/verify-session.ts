import { cache } from 'react';
import { API_URL } from '@/constants';
import 'server-only';
import { serializeCookies } from '@/lib/cookie';

export type User = {
  name: string;
  email: string;
  profileImg?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type VerifySessionOutput = {
  isAuth: boolean;
  user: User;
};

export const verifySession = cache(
  async (): Promise<VerifySessionOutput | null> => {
    const cookieHeader = await serializeCookies();

    const res = await fetch(`${API_URL}/v1/users/me`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      console.log('AUTHORIZATION_FAILED_ERROR: Failed to verify user');
      return null;
    }

    return { isAuth: true, user: data.data };
  },
);
