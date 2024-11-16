import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { get } from "http";
import { getAccountByUserId } from "./data/account";

//  instance auth.js terpisah yang mengimpor konfigurasi dari auth.config.js,
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // dijalankan setiap kali pengguna berhasil menautkan akun provider eksternal (misalnya Google, GitHub, dll.)
    // jadi intinya, event linkAccount ini hanya akan dijakankan untuk external account (google, github, dll.)
    // dan callback linkAccount akan dijalankan setelah data user yg login dengan provider eksternal, disimpan kedalam database
    async linkAccount({ user }) {
      // proses update field emailVerified
      await db.user.update({
        where: {
          // update user berdasarkan id user yg login menggunakan provider eksternal (google, github, dll.)
          id: user.id,
        },
        data: {
          // mengupdate field emailVerified
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // pengecekan jika user login menggunakan oauth (external account google, github, dll.)
      if (account?.provider !== "credentials") {
        // jika menggunakan ouath, artinya tidak menggunakan email dan password(credential)
        // maka izinkan, karena akun user dengan provider oauth (bukan credential), tidak perlu melakukan verifikasi email
        return true;
      }
      // pengecekan jika user login menggunakan email dan password (credential)
      const existingUser = await getUserById(user.id as string); // mengambil data user berdasarkan id
      // kondisi jika user belum melakukan verifikasi email
      if (!existingUser?.emailVerified) {
        return false;
      }

      // kondisi jika status 2FA user sudah aktif (tapi belum melakukan confirmasi code yg didapat dari emailnya)
      if (existingUser.isTwoFactorEnabled) {
        // maka lakukan cek terlebih dahulu apakah user sudah melakukan confirmasi code
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        console.log({ twoFactorConfirmation });
        // jika belum, maka kembalikan false
        if (!twoFactorConfirmation) {
          return false;
        }
        // jika sudah, maka hapus data 2FA confirmation
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }
      return true;
    },

    // callback session akan dijalankan setelah callback jwt dijalankan
    // berfungsi untuk membuat atau memperbarui session berdasarkan token JWT yang telah dihasilkan
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // menggabungkan properti id ke dalam session dengan nilai sub dari token
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // menggabungkan properti role ke dalam session dengan nilai role dari token
      }

      if (session.user) {
        // menggabungkan properti isTwoFactorEnabled ke dalam session dengan nilai isTwoFactorEnabled dari token
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        // menggabungkan properti name ke dalam session dengan nilai name dari token
        session.user.name = token.name as string;
        // menggabungkan properti email ke dalam session dengan nilai email dari token
        session.user.email = token.email as string;
        // menggabungkan properti isOAuth ke dalam session dengan nilai isOAuth dari token
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },

    // callback jwt akan dijalankan setelah callback signIn berhasil dijalankan
    // berfungsi untuk membuat atau memperbarui token JWT yang digunakan untuk otentikasi user.
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub); // mengambil data user dari database berdasarkan id(sub) dari token
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id); // mengambil data akun user dari tabel account berdasarkan id(user) dari token
      token.isOAuth = !!existingAccount; // menggabungkan dan mengisi nilai kedalam properti isOAuth pada token (true/false)
      token.name = existingUser.name; // menggabungkan dan mengisi nilai kedalam properti name pada token
      token.email = existingUser.email; // menggabungkan dan mengisi nilai kedalam properti email pada token
      token.role = existingUser.role; // menggabungkan dan mengisi nilai kedalam properti role pada token
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled; // menggabungkan dan mengisi nilai kedalam properti isTwoFactorEnabled pada token
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
