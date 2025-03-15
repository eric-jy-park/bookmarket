import { create } from 'zustand';

interface BookmarkStore {
  activeBookmarkId: string | null;
  setActiveBookmarkId: (id: string | null) => void;
}

export const useBookmarkStore = create<BookmarkStore>(set => ({
  activeBookmarkId: null,
  setActiveBookmarkId: id => set({ activeBookmarkId: id }),
}));
