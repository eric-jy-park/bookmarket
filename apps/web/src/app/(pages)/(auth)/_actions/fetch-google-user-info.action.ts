"use server";

import { type TokenResponse as GoogleTokenResponse } from "@react-oauth/google";
import ky from "ky";
import { redirect } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
} from "~/app/_common/actions/auth.action";
import { type TokenResponse } from "~/app/_common/interfaces/token.interface";
import * as Sentry from "@sentry/nextjs";
import { http } from "~/app/_common/utils/http";

export const fetchGoogleUserInfo = async (
  codeResponse: GoogleTokenResponse,
) => {
  try {
    const userInfo: {
      id: string;
      email: string;
      picture: string;
    } = await ky
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        searchParams: { access_token: codeResponse.access_token },
      })
      .json();

    const googleTokenDto = {
      id: userInfo.id,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    const response: TokenResponse = await http
      .post(`authentication/google`, {
        json: googleTokenDto,
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
