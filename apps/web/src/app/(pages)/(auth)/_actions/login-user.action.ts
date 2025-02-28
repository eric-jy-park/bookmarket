"use server";

import ky from "ky";
import { redirect } from "next/navigation";

export const loginUser = async (state: null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await ky.post(`${process.env.NEXT_PUBLIC_BASE_URL}/authentication/signin`, {
      json: { email, password },
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }

  redirect("/");
};
