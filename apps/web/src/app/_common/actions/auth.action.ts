'use server';

import { cookies } from 'next/headers';
import { http } from '../utils/http';
import { getAuthCookie } from '../utils/get-auth-cookie';
import { type User } from '~/app/(pages)/(auth)/types';
import { redirect } from 'next/navigation';
import { type TokenResponse } from '../interfaces/token.interface';
import * as Sentry from '@sentry/nextjs';

const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const refreshNewAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const tokens: TokenResponse = await http
      .post('authentication/refresh-token', {
        json: {
          refreshToken,
        },
      })
      .json();

    setAccessToken(tokens.accessToken);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    signOut();
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const user: User = await http
      .get('users/me', {
        headers: {
          Cookie: await getAuthCookie(),
        },
      })
      .json();
    return user;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};

export const setAccessToken = async (accessToken: string) => {
  'use server';
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    maxAge: 604800,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
};

export const setRefreshToken = async (refreshToken: string) => {
  'use server';
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    maxAge: 3024000,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME);
  return accessToken ? accessToken.value : undefined;
};

export const getRefreshToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME);
  return refreshToken ? refreshToken.value : undefined;
};

export const isAuthenticated = async () => {
  try {
    const user = await getMe();
    return user !== null;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
};

export const signOut = async () => {
  'use server';

  try {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    redirect('/login');
  }
};
