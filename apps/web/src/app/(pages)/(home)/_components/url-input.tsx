import React from "react";
import { Input } from "~/app/_core/components/input";
import { cn } from "~/app/_core/utils/cn";

interface UrlInputProps {
  url: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValidUrl: boolean;
  isDisabled: boolean;
}

export function UrlInput({
  url,
  handleChange,
  isValidUrl,
  isDisabled,
}: UrlInputProps) {
  return (
    <div className="relative">
      <Input
        onChange={(e) => {
          handleChange?.(e);
        }}
        className={cn(
          "pl-8",
          !isValidUrl && "border-red-500 focus-visible:ring-0",
        )}
        placeholder={"Paste a link to add a bookmark"}
        disabled={isDisabled}
        value={url}
      />
    </div>
  );
}
