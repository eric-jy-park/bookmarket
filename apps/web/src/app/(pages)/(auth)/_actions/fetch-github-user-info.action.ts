"use server";

import ky from "ky";
import { redirect } from "next/navigation";
import { setAccessToken } from "~/app/_common/actions/auth.action";
import { setRefreshToken } from "~/app/_common/actions/auth.action";
import { type TokenResponse } from "~/app/_common/interfaces/token.interface";
import * as Sentry from "@sentry/nextjs";
import { http } from "~/app/_common/utils/http";

export const fetchGithubUserInfo = async (code: string) => {
  try {
    const data: { access_token: string } = await ky
      .post(`https://github.com/login/oauth/access_token`, {
        json: {
          code,
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        },
      })
      .json();

    const user: { id: string; email?: string; avatar_url: string } = await ky
      .get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
      .json();

    const githubTokenDto = {
      id: String(user.id),
      email: user.email ?? `${user.id}@github.com`,
      picture: user.avatar_url,
    };

    const response: TokenResponse = await http
      .post(`authentication/github`, {
        json: githubTokenDto,
      })
      .json();

    await setAccessToken(response.accessToken);
    await setRefreshToken(response.refreshToken);
  } catch (error) {
    Sentry.captureException(error);
  } finally {
    redirect("/");
  }
};
