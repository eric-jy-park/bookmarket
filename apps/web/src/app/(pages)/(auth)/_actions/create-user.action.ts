"use server";

import ky from "ky";
import { redirect } from "next/navigation";

export const createUser = async (state: null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await ky
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/signup`, {
        json: { email, password },
      })
      .json();
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
  redirect("/");
};
