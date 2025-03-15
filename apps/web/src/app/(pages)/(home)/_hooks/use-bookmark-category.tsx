import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateBookmarkCategory } from '~/app/_common/actions/bookmark.action';
import { getCategories } from '~/app/_common/actions/category.action';
import { type Category } from '~/app/_common/interfaces/category.interface';

export const useBookmarkCategory = ({
  selectedCategory,
  bookmarkId,
}: {
  selectedCategory?: string;
  bookmarkId: string;
}) => {
  const router = useRouter();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
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
        loading: 'Updating category...',
        success: 'Category updated!',
        error: 'Failed to update category',
        finally: () => {
          router.refresh();
        },
      },
    );
  };

  return { handleCategoryClick, categories };
};
