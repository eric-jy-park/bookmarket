import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { bookmarks } from "../db/schema";
import { auth } from "@clerk/nextjs/server";
import { type Bookmark } from "~/types/bookmark";

export const dynamic = "force-dynamic";

export const getBookmarks = async () => {
  const { userId } = auth();

  if (!userId) {
    return [];
  }

  return db
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

export const updateBookmark = async ({
  id,
  title,
  description,
  faviconUrl,
  url,
}: Omit<Bookmark, "userId" | "createdAt" | "updatedAt">) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const bookmark = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));

  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  return db
    .update(bookmarks)
    .set({ title, description, faviconUrl, url })
    .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));
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
