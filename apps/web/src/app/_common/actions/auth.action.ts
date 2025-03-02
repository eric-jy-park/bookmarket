"use server";

import { cookies } from "next/headers";
import { http } from "../utils/http";
import { getAuthCookie } from "../utils/get-auth-cookie";
import { type User } from "~/app/(pages)/(auth)/types";
import { redirect } from "next/navigation";
import { type TokenResponse } from "../interfaces/token.interface";
import * as Sentry from "@sentry/nextjs";
const ACCESS_TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

const refreshNewAccessToken = async (): Promise<TokenResponse | null> => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const tokens: TokenResponse = await http
      .post("authentication/refresh-token", {
        json: {
          refreshToken,
        },
      })
      .json();

    return tokens;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

export const getMe = async (): Promise<User | null> => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const tokens = await refreshNewAccessToken();
    if (!tokens) {
      return null;
    }

    await setAccessToken(tokens.accessToken);
    await setRefreshToken(tokens.refreshToken);
  }

  try {
    const user: User = await http
      .get("users/me", {
        headers: {
          Cookie: await getAuthCookie(),
        },
      })
      .json();

    return user;
  } catch (error) {
    const tokens = await refreshNewAccessToken();
    if (!tokens) {
      return null;
    }

    await setAccessToken(tokens.accessToken);
    await setRefreshToken(tokens.refreshToken);

    try {
      const user: User = await http
        .get("users/me", {
          headers: {
            Cookie: await getAuthCookie(),
          },
        })
        .json();
      return user;
    } catch (retryError) {
      Sentry.captureException(retryError);
      return null;
    }
  }
};

export const setAccessToken = async (accessToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken);
};

export const setRefreshToken = async (refreshToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
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
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken !== undefined && refreshToken !== undefined) {
    return true;
  }

  try {
    const user = await getMe();
    return user !== null;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);

  redirect("/login");
};
