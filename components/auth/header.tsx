import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });
interface headerProps {
  label: string;
}

export const Header = ({ label }: headerProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <h1 className={cn("text-3xl font-semibold", font.className)}>(•‿•)</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
