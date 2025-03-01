"use server";

import { type TokenResponse as GoogleTokenResponse } from "@react-oauth/google";
import ky from "ky";
import { redirect } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
} from "~/app/_common/actions/auth.action";
import { type TokenResponse } from "~/app/_common/interfaces/token.interface";

export const fetchGoogleUserInfo = async (
  codeResponse: GoogleTokenResponse,
) => {
  try {
    const userInfo: {
      id: string;
      email: string;
      picture: string;
    } = await ky
      .get(process.env.NEXT_PUBLIC_GOOGLE_USERINFO_URL!, {
        searchParams: { access_token: codeResponse.access_token },
      })
      .json();

    const googleTokenDto = {
      googleId: userInfo.id,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    const response: TokenResponse = await ky
      .post(`${process.env.NEXT_PUBLIC_BASE_URL!}/authentication/google`, {
        json: googleTokenDto,
      })
      .json();

    await setAccessToken(response.accessToken);
    await setRefreshToken(response.refreshToken);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  } finally {
    redirect("/");
  }
};
