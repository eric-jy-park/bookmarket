import React from "react";
import { useRouter } from "next/navigation";
import { useUrlMetadataMutation } from "../_state/mutations/use-url-metadata-mutation";
import { useCreateBookmarkMutation } from "../_state/mutations/use-create-bookmark-mutation";
import { urlToDomain } from "~/app/_core/utils/url-to-domain";
import { type UrlMetadata } from "~/types/metadata";
import { useVanishingInput } from "./use-vanishing-input";

const urlRegex = /^(http[s]?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}\.?/;

export function useBookmarkSubmit() {
  const [url, setUrl] = React.useState("");
  const [isValidUrl, setIsValidUrl] = React.useState(true);
  const router = useRouter();

  const { mutateAsync: getUrlMetadata, isPending: isGettingUrlMetadata } =
    useUrlMetadataMutation();
  const { mutateAsync: createBookmarkMutation } = useCreateBookmarkMutation();

  const {
    canvasValue,
    setCanvasValue,
    animating,
    inputRef,
    vanishAndSubmit,
    canvasRef,
  } = useVanishingInput();

  const validateUrl = (input: string) => {
    try {
      return urlRegex.test(input);
    } catch {
      return false;
    }
  };

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    [],
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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
        vanishAndSubmit();
      }
    },
    [url, createBookmarkMutation, getUrlMetadata, vanishAndSubmit],
  );

  React.useEffect(() => {
    setIsValidUrl(true);
  }, [url]);

  return {
    url,
    isValidUrl,
    isLoading: isGettingUrlMetadata,
    handleChange,
    handleSubmit,
    canvasValue,
    setCanvasValue,
    animating,
    inputRef,
    canvasRef,
  };
}
