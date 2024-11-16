import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({
  href,
  label,
}: BackButtonProps & { asChild?: boolean }) => {
  return (
    <Button variant="link" className="w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
