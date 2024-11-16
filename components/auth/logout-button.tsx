"use client";

import { logoutAction } from "@/actions/logout";
import { useRouter } from "next/navigation"; // untuk *redirect* dari sisi klien
interface LogoutButtonProps {
  children: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const onClick = async () => {
    const redirectUrl = await logoutAction();
    // Redirect dari sisi klien setelah aksi logout
    router.push(redirectUrl);
  };
  return (
    <span className="cursor-pointer" onClick={onClick}>
      <button type="submit">{children}</button>
    </span>
  );
};
