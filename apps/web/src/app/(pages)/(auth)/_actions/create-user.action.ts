"use server";

import { redirect } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
} from "~/app/_common/actions/auth.action";
import { type TokenResponse } from "~/app/_common/interfaces/token.interface";
import { http } from "~/app/_common/utils/http";
import * as Sentry from "@sentry/nextjs";

export const createUser = async (state: null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response: TokenResponse = await http
      .post(`authentication/signup`, {
        json: { email, password },
      })
      .json();

    await setAccessToken(response.accessToken);
    await setRefreshToken(response.refreshToken);
  } catch (error) {
    Sentry.captureException(error);
    throw new Error(JSON.stringify(error));
  } finally {
    redirect("/");
  }
};
