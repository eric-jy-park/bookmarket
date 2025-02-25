"use client";

import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { type TokenResponse } from "@react-oauth/google";
import ky from "ky";

export default function TestPage() {
  const fetchUserInfo = async (codeResponse: TokenResponse) => {
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

    console.log(data);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      void fetchUserInfo(codeResponse);
    },
    onError: (error) => console.log(error),
  });

  return <button onClick={() => login()}>Login</button>;
}
