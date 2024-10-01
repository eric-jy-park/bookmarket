import { create } from "zustand";

interface BookmarkStore {
  activeBookmarkId: number | null;
  setActiveBookmarkId: (id: number | null) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  activeBookmarkId: null,
  setActiveBookmarkId: (id) => set({ activeBookmarkId: id }),
}));
