import React from "react";
import { Input } from "~/app/_core/components/input";
import { cn } from "~/app/_core/utils/cn";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  isValidUrl: boolean;
  isDisabled: boolean;
}

export function UrlInput({
  url,
  setUrl,
  isValidUrl,
  isDisabled,
}: UrlInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <Input
      className={cn(
        "pl-8",
        !isValidUrl && "border-red-500 focus-visible:ring-0",
      )}
      placeholder="Paste a link to add a bookmark"
      disabled={isDisabled}
      value={url}
      onChange={handleChange}
    />
  );
}
