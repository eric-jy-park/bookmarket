"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";

import { useAuth } from "@clerk/nextjs";
import BlurFade from "~/app/_core/components/blur-fade";
import { useBookmarkSubmit } from "../_hooks/use-bookmark-submit";
import { UrlInput } from "./url-input";

export function BookmarkInput() {
  const { isSignedIn } = useAuth();
  const {
    url,
    isValidUrl,
    isLoading,
    handleChange,
    handleSubmit,
    canvasRef,
    setCanvasValue,
    animating,
    inputRef,
  } = useBookmarkSubmit();

  return (
    <>
      <BlurFade
        duration={0.2}
        delay={0.1}
        className="sticky top-0 z-10 w-full bg-background pt-2 sm:top-12"
      >
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <UrlInput
              url={url}
              handleChange={handleChange}
              isValidUrl={isValidUrl}
              isDisabled={isLoading || !isSignedIn}
              animating={animating}
              canvasRef={canvasRef}
              inputRef={inputRef}
              setCanvasValue={setCanvasValue}
            />
            {isLoading && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {!isValidUrl && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid URL
            </p>
          )}
        </form>
      </BlurFade>
    </>
  );
}
