"use server";

import { signOut } from "@/auth";

export const logoutAction = async () => {
  // Lakukan sign out tanpa *redirect* di sini
  await signOut({ redirect: false });

  // Kembalikan URL tujuan untuk *redirect* dari sisi klien
  return "/auth/login";
};
