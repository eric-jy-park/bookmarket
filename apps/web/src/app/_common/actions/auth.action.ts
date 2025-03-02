"use server";

import { cookies } from "next/headers";
import { http } from "../utils/http";
import { getAuthCookie } from "../utils/get-auth-cookie";
import { type User } from "~/app/(pages)/(auth)/types";
import { redirect } from "next/navigation";

const ACCESS_TOKEN_COOKIE_NAME = "access_token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

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
  return accessToken !== undefined && refreshToken !== undefined;
};

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);

  redirect("/login");
};

export const getMe = async () => {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return null;
  }

  const user: User = await http
    .get("users/me", {
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return user;
};
