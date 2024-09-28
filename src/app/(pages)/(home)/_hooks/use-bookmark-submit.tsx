import React from "react";
import { useRouter } from "next/navigation";
import { useUrlMetadataMutation } from "../_state/mutations/use-url-metadata-mutation";
import { useCreateBookmarkMutation } from "../_state/mutations/use-create-bookmark-mutation";
import { urlToDomain } from "~/app/_core/utils/url-to-domain";
import { type UrlMetadata } from "~/types/metadata";

export function useBookmarkSubmit() {
  const [url, setUrl] = React.useState("");
  const [isValidUrl, setIsValidUrl] = React.useState(true);
  const router = useRouter();

  const { mutateAsync: getUrlMetadata, isPending: isGettingUrlMetadata } =
    useUrlMetadataMutation();
  const { mutateAsync: createBookmarkMutation } = useCreateBookmarkMutation();

  const validateUrl = (input: string) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let fullUrl = url;
    if (!fullUrl.startsWith("http")) {
      fullUrl = `https://${fullUrl}`;
    }

    if (!validateUrl(fullUrl)) {
      setIsValidUrl(false);
      return;
    }

    try {
      const data: UrlMetadata = await getUrlMetadata(fullUrl);
      await createBookmarkMutation({
        title: data.title,
        description: data.description,
        faviconUrl: `https://icon.horse/icon/${urlToDomain(fullUrl)}`,
        url: fullUrl,
      });
    } catch {
      await createBookmarkMutation({
        title: fullUrl,
        faviconUrl: `https://icon.horse/icon/${urlToDomain(fullUrl)}`,
        url: fullUrl,
      });
    } finally {
      setUrl("");
      setIsValidUrl(true);
      router.refresh();
    }
  };

  React.useEffect(() => {
    setIsValidUrl(true);
  }, [url]);

  return {
    url,
    setUrl,
    isValidUrl,
    isLoading: isGettingUrlMetadata,
    handleSubmit,
  };
}
