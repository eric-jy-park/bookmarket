"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "~/app/_core/components/input";
import { useUrlMetadataMutation } from "../_state/mutations/use-url-metadata-mutation";
import { useCreateBookmarkMutation } from "../_state/mutations/use-create-bookmark-mutation";
import { useRouter } from "next/navigation";
import { type UrlMetadata } from "~/types/metadata";
import { urlToDomain } from "~/app/_core/utils/url-to-domain";
import { useAuth } from "@clerk/nextjs";
import BlurFade from "~/app/_core/components/blur-fade";

export function BookmarkInput() {
  const [url, setUrl] = React.useState("");
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const { mutateAsync: getUrlMetadata, isPending: isGettingUrlMetadata } =
    useUrlMetadataMutation();
  const { mutateAsync: createBookmarkMutation } = useCreateBookmarkMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let fullUrl = url;
    if (!fullUrl.startsWith("http")) {
      fullUrl = `https://${fullUrl}`;
    }
    const data: UrlMetadata = await getUrlMetadata(fullUrl);

    try {
      await createBookmarkMutation({
        title: data.title,
        description: data.description,
        faviconUrl: `https://icon.horse/icon/${urlToDomain(fullUrl)}`,
        url: fullUrl,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUrl("");
      router.refresh();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <BlurFade
      duration={0.2}
      delay={0.1}
      className="sticky top-0 z-10 w-full bg-background pt-2 sm:top-12"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Paste a link to add a bookmark"
            disabled={isGettingUrlMetadata || !isSignedIn}
            value={url}
            onChange={handleChange}
          />
          {isGettingUrlMetadata && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>
    </BlurFade>
  );
}
