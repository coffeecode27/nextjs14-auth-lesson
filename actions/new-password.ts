"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const newPasswordAction = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  // validate field
  const validateFields = NewPasswordSchema.safeParse(values);
  // jika validasi field gagal
  if (!validateFields.success) {
    return { error: "Invalid field" };
  }

  // jika validasi field sukses, ambil value dari password
  const { password } = validateFields.data;

  // selanjutnya, lakukan validasi token (dengan cara mengecek apakah token ada di database)
  const existingToken = await getPasswordResetTokenByToken(token);
  // jika tidak ada, maka kembalikan error
  if (!existingToken) {
    return { error: "Invalid token" };
  }

  // jika ada, maka cek apakah token expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  // jika expired, maka kembalikan error
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // lalu, cek apakah email ditabel User sama dengan email yg ada di tabel ResetPasswordToken (mencari kecocokan email)
  const existingUser = await getUserByEmail(existingToken.email);
  // jika tidak ada, kembalikan error
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // jika user ada, lakukan hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  // lalu update password user
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  // lalu, hapus token didalam tabel passwordResetToken
  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  // kembalikan success
  return { success: "Password updated!" };
};
