"use server";

import { type TokenResponse } from "@react-oauth/google";
import ky from "ky";
import { getAccessToken } from "~/app/_common/actions/auth.action";
import { getRefreshToken } from "~/app/_common/actions/auth.action";

export const fetchGoogleUserInfo = async (codeResponse: TokenResponse) => {
  const userInfo: {
    id: string;
    email: string;
  } = await ky
    .get(process.env.NEXT_PUBLIC_GOOGLE_USERINFO_URL!, {
      searchParams: { access_token: codeResponse.access_token },
    })
    .json();

  const googleTokenDto = {
    googleId: userInfo.id,
    email: userInfo.email,
  };

  const data = await ky
    .post(`${process.env.NEXT_PUBLIC_BASE_URL!}/authentication/google`, {
      json: googleTokenDto,
    })
    .json();

  return data;
};
