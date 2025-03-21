import { type Category } from '~/app/_common/interfaces/category.interface';
import { http } from '~/app/_common/utils/http';

export const getSharedUsersCategories = async (username: string): Promise<Category[]> => {
  return await http.get(`categories/s/${username}`).json();
};
