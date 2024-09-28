import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { bookmarks } from "../db/schema";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export const getBookmarks = async () => {
  const { userId } = auth();

  if (!userId) {
    return [];
  }

  return await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));
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
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.insert(bookmarks).values({
    title,
    description,
    faviconUrl,
    url,
    userId,
  });
};

export const deleteBookmark = async ({ id }: { id: number }) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));
};
