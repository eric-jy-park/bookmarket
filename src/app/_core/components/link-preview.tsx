"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import Image from "next/image";
import { encode } from "qss";
import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { cn } from "../utils/cn";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

const getMicrolinkSrc = (url: string) => {
  const params = encode({
    url,
    screenshot: true,
    meta: false,
    embed: "screenshot.url",
    colorScheme: "light",
    "viewport.isMobile": false,
    "viewport.deviceScaleFactor": 1,
    "viewport.width": 1280,
    "viewport.height": 720,
  });
  return `https://api.microlink.io/?${params}`;
};

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = "fixed",
  isStatic = false,
  imageSrc = "",
}) => {
  const [isOpen, setOpen] = useState(false);
  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.target instanceof HTMLElement) {
      const { left, width } = event.target.getBoundingClientRect();
      const offsetFromCenter = (event.clientX - left - width / 2) / 2;
      x.set(offsetFromCenter);
    }
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={50}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn("text-black dark:text-white", className)}
        href={url}
      >
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="rounded-xl shadow-xl"
              style={{ x: translateX }}
            >
              <Link
                target="_blank"
                href={url}
                className="block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800"
                style={{ fontSize: 0 }}
              >
                <Image
                  src={isStatic ? imageSrc : getMicrolinkSrc(url)}
                  width={width}
                  height={height}
                  quality={quality}
                  layout={layout}
                  priority={true}
                  className="rounded-lg"
                  alt="preview image"
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};
