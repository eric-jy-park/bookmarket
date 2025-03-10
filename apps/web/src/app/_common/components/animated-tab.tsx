"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, FolderIcon } from "lucide-react";
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
import { DrawerClose } from "~/app/_core/components/drawer";
import { Button } from "~/app/_core/components/button";
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
  DrawerDescription,
} from "~/app/_core/components/drawer";
import { cn } from "~/app/_core/utils/cn";

export const AnimatedTab = ({ categories }: { categories: Category[] }) => {
  const [category, setCategory] = useQueryState("c", parseAsString);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
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
            <p className="relative z-10 max-w-16 truncate text-white mix-blend-exclusion transition-opacity duration-300">
              {category.name}
            </p>
          </button>
        ))}
        {categories.length <= 5 && <AddCategoryButton />}
      </div>

      {/* Mobile */}
      <div className="flex w-full flex-col items-center justify-center gap-2 bg-background sm:hidden">
        <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="flex w-fit max-w-32 items-center justify-center gap-2 rounded-xl bg-black px-4 py-1.5 text-sm font-medium text-white">
              <FolderIcon size={16} />
              <TextMorph className="truncate text-sm font-medium">
                {activeTab?.name ?? "All"}
              </TextMorph>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Categories</DrawerTitle>
            </DrawerHeader>
            <hr className="my-2" />
            <div className="flex flex-col gap-2 pb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className={cn(
                    "h-12 justify-between",
                    activeTab?.name === category.name && "bg-muted",
                  )}
                  onClick={() => {
                    handleClick(category.name);
                    setIsMobileDrawerOpen(false);
                  }}
                >
                  {category.name}
                  {activeTab?.name === category.name && <CheckIcon size={16} />}
                </Button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
