"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, FolderIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_core/components/dropdown-menu";
import { TextMorph } from "./text-morph";

const tabs = [
  { label: "UI/UX", value: "ui-ux" },
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Other", value: "other" },
];

export const AnimatedTab = () => {
  const [category, setCategory] = useQueryState("category", parseAsString);

  const activeTab = tabs.find((tab) => tab.value === category);

  const handleClick = (value: string) => {
    if (activeTab?.value === value) return setCategory(null);
    setCategory(value);
  };

  return (
    <>
      <div className="absolute left-1/2 hidden -translate-x-1/2 gap-2 bg-background sm:flex">
        {tabs.map((tab) => (
          <button
            className="relative cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium"
            key={tab.value}
            onClick={() => handleClick(tab.value)}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <AnimatePresence>
              {activeTab?.value === tab.value && (
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
            <span className="relative z-10 text-white mix-blend-exclusion transition-opacity duration-300 hover:opacity-60">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2 bg-background sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-fit items-center justify-center gap-2 rounded-xl bg-black px-4 py-1.5 text-sm font-medium text-white">
              <TextMorph className="text-sm font-medium">
                {activeTab?.label ?? "All"}
              </TextMorph>
              <FolderIcon size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-full">
            {tabs.map((tab) => (
              <DropdownMenuCheckboxItem
                key={tab.value}
                onClick={() => handleClick(tab.value)}
                checked={activeTab?.value === tab.value}
              >
                {tab.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
