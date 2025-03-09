"use client";

import { PlusIcon } from "lucide-react";

import { Input } from "~/app/_core/components/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_core/components/sheet";
import { createCategory } from "../actions/category.action";
import React, { useActionState } from "react";
import { useRouter } from "next/navigation";

export const AddCategoryButton = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (_: { error: string }, formData: FormData) => {
      const categoryName = formData.get("categoryName");
      if (typeof categoryName !== "string") {
        return { error: "Invalid category name" };
      }
      await createCategory(categoryName);
      setOpen(false);
      router.refresh();
      return { error: "" };
    },
    { error: "" },
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative ml-4 flex cursor-pointer items-center justify-center rounded-lg bg-black px-2 py-1 text-white transition-colors hover:bg-black/80">
          <PlusIcon size={16} />
        </div>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="flex w-full justify-center border-none bg-transparent shadow-none"
        style={{
          pointerEvents: "none",
        }}
      >
        <form
          style={{ pointerEvents: "auto" }}
          className="flex w-[400px] flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg"
          action={formAction}
        >
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base">
              Create New Category
            </SheetTitle>
          </SheetHeader>
          <Input
            ref={inputRef}
            name="categoryName"
            placeholder="Category Name"
            disabled={isPending}
          />
          {state.error && (
            <p className="mt-1 text-sm text-red-500">{state.error}</p>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};
