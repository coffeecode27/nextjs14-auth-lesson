"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validatedFields = RegisterSchema.safeParse(values);

  // jika gagal validasi ketika melakukan register
  if (!validatedFields.success) {
    return { error: "Invalid email or password" };
  }

  // jika berhasil validasi ketika melakukan register
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10); // lakukan hashing password

  // sebelum insert ke database, pastikan email belum terdaftar (cek dengan memanggil fungsi getUserByEmail)
  const existingUser = await getUserByEmail(email);

  // jika email sudah terdaftar, kembalikan error
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // jika email belum terdaftar, insert ke database
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // generate verification token
  const verificationToken = await generateVerificationToken(email);
  console.log(verificationToken);

  // kirim email verifikasi dengan menggunakan email dan token yg didapat dari verificationtoken
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Confirmation email sent!",
  };
};
