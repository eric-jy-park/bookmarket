"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { createBookmarkAction } from "../_actions/create-bookmark.action";
import BlurFade from "~/app/_core/components/blur-fade";
import { UrlInput } from "./url-input";
import { ProgressiveBlur } from "~/app/_core/components/progressive-blur";
import { useRouter } from "next/navigation";
export function BookmarkInput() {
  const router = useRouter();

  const handleCreateBookmark = async (
    previousState: { error: string; success: string },
    formData: FormData,
  ) => {
    const result = await createBookmarkAction(previousState, formData);
    if (result.success) {
      router.refresh();
    }
    return result;
  };

  const [state, formAction, isPending] = React.useActionState(
    handleCreateBookmark,
    {
      error: "",
      success: "",
    },
  );

  const isValidUrl = state.error === "";

  return (
    <div className="sticky top-14 z-10 w-full bg-background pt-1">
      <ProgressiveBlur
        className="pointer-events-none absolute -bottom-10 left-0 z-0 h-14 w-full"
        direction="top"
      />
      <BlurFade duration={0.2} delay={0.1} className="z-20">
        <form action={formAction}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <UrlInput isValidUrl={isValidUrl} isDisabled={isPending} />
            {isPending && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {state.error && (
              <p className="mt-1 text-sm text-red-500">{state.error}</p>
            )}
          </div>
        </form>
      </BlurFade>
    </div>
  );
}
