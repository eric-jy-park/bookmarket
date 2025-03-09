"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_core/components/dropdown-menu";
import { TextMorph } from "./text-morph";
import React from "react";
import { AddCategoryButton } from "./add-category-button";
import { Category } from "../interfaces/category.interface";

export const AnimatedTab = ({ categories }: { categories: Category[] }) => {
  const [category, setCategory] = useQueryState("c", parseAsString);

  const activeTab = categories.find((tab) => tab.name === category);

  const handleClick = (value: string) => {
    if (activeTab?.name === value) return setCategory(null);
    setCategory(value);
  };

  return (
    <>
      {/* Desktop */}
      <div className="absolute left-1/2 hidden h-8 -translate-x-1/2 gap-2 bg-background sm:flex">
        {categories.map((category) => (
          <button
            className="relative cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium"
            key={category.id}
            onClick={() => handleClick(category.name)}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <AnimatePresence>
              {activeTab?.name === category.name && (
                <motion.span
                  className="absolute inset-0 bg-black"
                  layoutId="active-category"
                  style={{ borderRadius: 8 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10 truncate text-white mix-blend-exclusion transition-opacity duration-300 hover:opacity-60">
              {category.name}
            </span>
          </button>
        ))}
        {categories.length <= 5 && <AddCategoryButton />}
      </div>

      {/* Mobile */}
      <div className="flex w-full flex-col items-center justify-center gap-2 bg-background sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-fit items-center justify-center gap-2 rounded-xl bg-black px-4 py-1.5 text-sm font-medium text-white">
              <FolderIcon size={16} />
              <TextMorph className="text-sm font-medium">
                {activeTab?.name ?? "All"}
              </TextMorph>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-full">
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                onClick={() => handleClick(category.name)}
                checked={activeTab?.name === category.name}
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
