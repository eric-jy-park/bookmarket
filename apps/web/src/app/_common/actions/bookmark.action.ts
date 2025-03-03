"use server";

import { type Bookmark } from "~/types/bookmark";
import { http } from "~/app/_common/utils/http";
import { getAuthCookie } from "~/app/_common/utils/get-auth-cookie";
import { isAuthenticated } from "~/app/_common/actions/auth.action";

export const getBookmarks = async () => {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return [];
  }

  const response: Bookmark[] = await http
    .get("bookmarks", {
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return response;
};

export const createBookmark = async ({
  title,
  description,
  faviconUrl,
  url,
}: {
  title: string;
  description?: string;
  faviconUrl: string;
  url: string;
}) => {
  const response: Bookmark = await http
    .post("bookmarks", {
      json: {
        title,
        description,
        faviconUrl,
        url,
      },
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return response;
};

export const updateBookmark = async ({
  id,
  title,
  description,
  faviconUrl,
  url,
}: Partial<Omit<Bookmark, "userId" | "createdAt" | "updatedAt">>) => {
  const response: Bookmark = await http
    .patch(`bookmarks/${id}`, {
      json: {
        title,
        description,
        faviconUrl,
        url,
      },
      headers: {
        Cookie: await getAuthCookie(),
      },
    })
    .json();

  return response;
};

export const deleteBookmark = async ({ id }: { id: string }) => {
  await http.delete(`bookmarks/${id}`, {
    headers: {
      Cookie: await getAuthCookie(),
    },
  });
};
