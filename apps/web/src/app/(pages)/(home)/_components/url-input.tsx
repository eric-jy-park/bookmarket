import React from "react";
import { Input } from "~/app/_core/components/input";
import { cn } from "~/app/_core/utils/cn";

interface UrlInputProps {
  isValidUrl: boolean;
  isDisabled: boolean;
}

export function UrlInput({ isValidUrl, isDisabled }: UrlInputProps) {
  return (
    <div className="relative">
      <Input
        name="url"
        className={cn(
          "pl-8",
          !isValidUrl && "border-red-500 focus-visible:ring-0",
        )}
        placeholder="Paste a link to add a bookmark"
        disabled={isDisabled}
      />
    </div>
  );
}
