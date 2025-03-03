import Image from "next/image";
import { cn } from "~/app/_core/utils/cn";

export const Logo = ({
  className,
  includeText = true,
}: {
  className?: string;
  includeText?: boolean;
}) => {
  return (
    <div className="flex cursor-pointer items-center gap-1">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={120}
        height={120}
        className={cn("size-7", className)}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      {includeText && <h1 className="text-lg font-black">Bookmarket</h1>}
    </div>
  );
};
