"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";

import BlurFade from "~/app/_core/components/blur-fade";
import { useBookmarkSubmit } from "../_hooks/use-bookmark-submit";
import { UrlInput } from "./url-input";
import { ProgressiveBlur } from "~/app/_core/components/progressive-blur";

export function BookmarkInput() {
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
    <div className="sticky top-14 z-10 w-full bg-background pt-1">
      <ProgressiveBlur
        className="pointer-events-none absolute -bottom-10 left-0 z-0 h-14 w-full"
        direction="top"
      />
      <BlurFade duration={0.2} delay={0.1} className="z-20">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <UrlInput
              url={url}
              handleChange={handleChange}
              isValidUrl={isValidUrl}
              isDisabled={isLoading}
              animating={animating}
              canvasRef={canvasRef}
              inputRef={inputRef}
              setCanvasValue={setCanvasValue}
            />
            {isLoading && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!isValidUrl && (
              <p className="mt-1 text-sm text-red-500">
                Please enter a valid URL
              </p>
            )}
          </div>
        </form>
      </BlurFade>
    </div>
  );
}
