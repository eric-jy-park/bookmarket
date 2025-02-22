import React from "react";
import { useBookmarkStore } from "~/app/(pages)/(home)/_state/store/use-bookmark-store";

export const useBodyScrollLock = () => {
  const activeBookmarkId = useBookmarkStore((state) => state.activeBookmarkId);

  React.useEffect(() => {
    const body = document.body;
    if (activeBookmarkId) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "visible";
    }

    return () => {
      body.style.overflow = "visible";
    };
  }, [activeBookmarkId]);
};
