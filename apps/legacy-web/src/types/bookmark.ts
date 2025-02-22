import { type bookmarks } from "~/server/db/schema";

export type Bookmark = typeof bookmarks.$inferSelect;
