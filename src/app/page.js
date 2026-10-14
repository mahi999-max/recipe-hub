import Banner from "@/lib/Banner";
import Image from "next/image";

export default function Home({children}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Banner></Banner>
      {children}
    </div>
  );
}
