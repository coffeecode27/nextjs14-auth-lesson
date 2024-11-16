"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // untuk mengakses database
import { SettingsSchema } from "@/schemas"; // untuk validasi form berdasarkan skema settingsForm
import { getUserByEmail, getUserById } from "@/data/user"; // untuk mendapatkan data user berdasarkan Id
import { CurrentUser } from "@/lib/auth"; // untuk mendapatkan data user yg login saat ini berdasarkan session
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settingsAction = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await CurrentUser();
  // cek jka tidak ada user pada session current user
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);
  // cek jika tidak ada user pada database berdasarkan Id dari session
  if (!dbUser) {
    return { error: "User not found" };
  }

  // cek jika user login menggunakan oauth provider (google, github, dll.), maka kosongkan beberapa property didalam values
  // sehingga data data yg kosong tersebut tidak akan diupdate, kerena hal hal tersebut harusnya dihandle oleh provider
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // HANDLE UPDATE EMAIL
  // cek jika email dari values ada, dan email dari values tidak sama dengan email yg ada di database
  if (values.email && values.email !== user.email) {
    // cari email dari values tersebut pada database
    const existingUser = await getUserByEmail(values.email);

    // jika email tersebut ditemukan, dan id user tersebut tidak sama dengan id user yg sedang login saat ini
    // itu berarti email tersebut sudah terdaftar dan mungkin saja milik user lain
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    // dan jika email dari values tidak ditemukan pada database, maka generate token verifikasi untuk email tersebut
    const verificationToken = await generateVerificationToken(values.email);
    // lalu kirim email verifikasi ke alamat email user, dengan token yg didapat dari proses generate token
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent!" };
  }

  // HANDLE UPDATE PASSWORD
  // cek jika password dari values ada, dan new password dari values ada, dan password dari dbUser ada
  if (values.password && values.newPassword && dbUser.password) {
    // lakukan hash dan compare password dari values dengan password yg ada di dbUser
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    // jika password tidak cocok, maka kembalikan error
    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }
    // jika cocok, maka lakukan hash password baru
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword; // akan digunakan untuk update field password
    values.newPassword = undefined; // karna tidak ada field dengan nama newPassword, maka kembalikan undefined
  }

  // lakukan update data
  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values, // mengupdate field dengan semua data yg didapat dari values
    },
  });

  // jika berhasil, maka kembalikan success
  return { success: "Settings updated!" };
};
