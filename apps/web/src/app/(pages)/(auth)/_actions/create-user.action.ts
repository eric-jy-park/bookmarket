"use server";

import ky from "ky";
import { redirect } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
} from "~/app/_common/actions/auth.action";
import { type TokenResponse } from "~/app/_common/interfaces/token.interface";

export const createUser = async (state: null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response: TokenResponse = await ky
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/signup`, {
        json: { email, password },
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
