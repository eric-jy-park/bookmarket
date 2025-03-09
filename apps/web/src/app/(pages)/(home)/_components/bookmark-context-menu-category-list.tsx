import React from "react";
import { getCategories } from "~/app/_common/actions/category.action";
import { ContextMenuCheckboxItem } from "~/app/_core/components/context-menu";
import { useQuery } from "@tanstack/react-query";
import { Category } from "~/app/_common/interfaces/category.interface";
import { updateBookmarkCategory } from "~/app/_common/actions/bookmark.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const BookmarkContextMenuCategoryList = ({
  selectedCategory,
  bookmarkId,
}: {
  selectedCategory: string;
  bookmarkId: string;
}) => {
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryClick = async (category: Category) => {
    toast.promise(
      async () => {
        if (category.name === selectedCategory) {
          await updateBookmarkCategory({
            id: bookmarkId,
            categoryId: undefined,
          });
        } else {
          await updateBookmarkCategory({
            id: bookmarkId,
            categoryId: category.id,
          });
        }
      },
      {
        loading: "Updating category...",
        success: "Category updated!",
        error: "Failed to update category",
        finally: () => {
          router.refresh();
        },
      },
    );
  };

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
