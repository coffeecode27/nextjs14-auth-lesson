"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="shadow-md backdrop-blur-sm bg-black/10 flex justify-between items-center p-4 rounded-lg w-[60%]">
      <div className="flex gap-x-2">
        <Button
          variant={pathname === "/server" ? "default" : "customOutline"}
          asChild
        >
          <Link href="/server">Server</Link>
        </Button>

        <Button
          variant={pathname === "/client" ? "default" : "customOutline"}
          asChild
        >
          <Link href="/client">Client</Link>
        </Button>

        <Button
          variant={pathname === "/admin" ? "default" : "customOutline"}
          asChild
        >
          <Link href="/admin">Admin</Link>
        </Button>

        <Button
          variant={pathname === "/settings" ? "default" : "customOutline"}
          asChild
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <p>
        <UserButton />
      </p>
    </nav>
  );
};
