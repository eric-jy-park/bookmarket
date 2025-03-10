import React from "react";
import { getCategories } from "~/app/_common/actions/category.action";
import { ContextMenuCheckboxItem } from "~/app/_core/components/context-menu";
import { useQuery } from "@tanstack/react-query";
import { Category } from "~/app/_common/interfaces/category.interface";
import { updateBookmarkCategory } from "~/app/_common/actions/bookmark.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBookmarkCategory } from "../_hooks/use-bookmark-category";

export const BookmarkContextMenuCategoryList = ({
  selectedCategory,
  bookmarkId,
}: {
  selectedCategory?: string;
  bookmarkId: string;
}) => {
  const { categories, handleCategoryClick } = useBookmarkCategory({
    selectedCategory,
    bookmarkId,
  });

  return categories?.map((category) => (
    <ContextMenuCheckboxItem
      key={category.id}
      checked={category.name === selectedCategory}
      onCheckedChange={() => handleCategoryClick(category)}
    >
      {category.name}
    </ContextMenuCheckboxItem>
  ));
};
