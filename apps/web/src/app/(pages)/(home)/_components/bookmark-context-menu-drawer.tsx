import Image from "next/image";
import { Bookmark } from "~/app/_common/interfaces/bookmark.interface";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerNestedRoot,
} from "~/app/_core/components/drawer";
import { useBookmarkContext } from "../_hooks/use-bookmark-context";
import { FolderIcon } from "lucide-react";
import { useBookmarkCategory } from "../_hooks/use-bookmark-category";
import { CategoryDrawerContent } from "./category-drawer-content";
import React from "react";

export const BookmarkContextMenuDrawer = ({
  bookmark,
  isOpen,
  onClose,
}: {
  bookmark: Bookmark;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = React.useState(false);
  const { menuItems } = useBookmarkContext({ bookmark });
  const { categories, handleCategoryClick } = useBookmarkCategory({
    selectedCategory: bookmark.category?.name,
    bookmarkId: bookmark.id,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setIsCategoryDrawerOpen(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader className="relative flex flex-col items-start justify-center gap-3 px-6">
          <div className="flex w-full items-center justify-between gap-2">
            <DrawerTitle className="w-full truncate text-balance text-left">
              {bookmark.title}
            </DrawerTitle>
            {bookmark.faviconUrl && (
              <Image
                src={bookmark.faviconUrl}
                alt={bookmark.title ?? ""}
                width={32}
                height={32}
                unoptimized={true}
                className="shrink-0"
              />
            )}
          </div>
          <DrawerDescription className="w-full truncate text-balance text-left">
            {bookmark.url}
          </DrawerDescription>
        </DrawerHeader>
        <hr className="my-2" />
        <div className="flex flex-col gap-1 pb-2">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-6 py-4 text-sm hover:bg-muted"
              onClick={() => {
                item.onClick();
                onClose();
              }}
            >
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
          <DrawerNestedRoot
            open={isCategoryDrawerOpen}
            onOpenChange={setIsCategoryDrawerOpen}
          >
            <DrawerTrigger>
              <div className="flex cursor-pointer items-center gap-3 rounded-md px-6 py-4 text-sm hover:bg-muted">
                <FolderIcon size={16} />
                Category
              </div>
            </DrawerTrigger>
            <CategoryDrawerContent
              categories={categories ?? []}
              activeTab={bookmark.category}
              handleClick={handleCategoryClick}
              setIsMobileDrawerOpen={setIsCategoryDrawerOpen}
            />
          </DrawerNestedRoot>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
