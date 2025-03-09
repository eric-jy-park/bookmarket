"use client";
import { AnimatePresence, motion } from "framer-motion";
import { parseAsString, useQueryState } from "nuqs";

interface AnimatedTabProps {
  tabs: {
    label: string;
    value: string;
  }[];
}

export const AnimatedTab = ({ tabs }: AnimatedTabProps) => {
  const [category, setCategory] = useQueryState("category", parseAsString);

  const activeTab = tabs.find((tab) => tab.value === category);

  const handleClick = (value: string) => {
    if (activeTab?.value === value) return setCategory(null);
    setCategory(value);
  };

  return (
    <div className="absolute left-1/2 flex -translate-x-1/2 gap-2 bg-background">
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
          <span className="relative z-10 text-white mix-blend-exclusion">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
