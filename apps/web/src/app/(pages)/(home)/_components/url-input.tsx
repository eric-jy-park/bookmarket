import React from "react";
import { Input } from "~/app/_core/components/input";
import { cn } from "~/app/_core/utils/cn";

interface UrlInputProps {
  url: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isValidUrl: boolean;
  isDisabled: boolean;
  animating: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  setCanvasValue: React.Dispatch<React.SetStateAction<string>>;
}

export function UrlInput({
  url,
  handleChange,
  isValidUrl,
  isDisabled,
  animating,
  canvasRef,
  inputRef,
  setCanvasValue,
}: UrlInputProps) {
  return (
    <div className="relative">
      <canvas
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-full w-full invert filter dark:invert-0",
          !animating ? "opacity-0" : "opacity-100",
        )}
        ref={canvasRef}
      />
      <Input
        onChange={(e) => {
          if (!animating) {
            setCanvasValue(e.target.value);
            handleChange?.(e);
          }
        }}
        ref={inputRef}
        className={cn(
          "pl-8",
          !isValidUrl && "border-red-500 focus-visible:ring-0",
        )}
        placeholder={animating ? "" : "Paste a link to add a bookmark"}
        disabled={isDisabled}
        value={url}
      />
    </div>
  );
}
