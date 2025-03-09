"use server";

import { Category } from "../interfaces/category.interface";
import { getAuthCookie } from "../utils/get-auth-cookie";
import { http } from "../utils/http";

export const createCategory = async (categoryName: Category["name"]) => {
  const res: Category = await http
    .post("categories", {
      json: {
        name: categoryName,
      },
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return res;
};

export const getCategories = async () => {
  const res: Category[] = await http
    .get("categories", {
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return res;
};
