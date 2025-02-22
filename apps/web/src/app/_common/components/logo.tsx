import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex cursor-pointer items-center gap-1">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={120}
        height={120}
        className={"size-7"}
      />
      <h1 className="text-lg font-black">Bookmarket</h1>
    </div>
  );
};
