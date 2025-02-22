import { useUpdateBookmarkMutation } from "../_state/mutations/use-update-bookmark-mutation";

export const useBookmarkUpdate = () => {
  const { mutateAsync, isPending } = useUpdateBookmarkMutation();

  return { updateBookmark: mutateAsync, isPending };
};
