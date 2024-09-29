import { useUpdateBookmarkMutation } from "../_state/mutations/use-update-bookmark-mutation";

export const useBookmarkUpdate = () => {
  const { mutate, isPending } = useUpdateBookmarkMutation();
};
