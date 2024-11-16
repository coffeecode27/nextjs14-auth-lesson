import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: UserRole; // Menambahkan properti role ke dalam user session
      isTwoFactorEnabled: boolean; // Menambahkan properti isTwoFactorEnabled ke dalam user session
      isOAuth: boolean; // Menambahkan properti isOAuth ke dalam user session
      // Menggabungkan properti bawaan dari DefaultSession["user"] dengan properti role menggunakan intersection type (&)
    } & DefaultSession["user"];
  }
}
