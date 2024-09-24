"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "~/app/_core/components/input";
import { useUrlMetadataMutation } from "../_state/mutations/use-url-metadata-mutation";

export function BookmarkInput() {
  const [url, setUrl] = React.useState("");

  const { mutateAsync, isPending } = useUrlMetadataMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await mutateAsync(url);
    console.log(data);
    setUrl("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Paste a link to add a bookmark"
          disabled={isPending}
          value={url}
          onChange={handleChange}
        />
        {isPending && (
          <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    </form>
  );
}
