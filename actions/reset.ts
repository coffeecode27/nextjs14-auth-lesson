"use server";
import { z } from "zod";
import { ResetSchema } from "@/schemas"; // untuk validasi form berdasarkan skema resetForm
import { getUserByEmail } from "@/data/user"; // untuk mendapatkan data user berdasarkan email
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetAction = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  // jika value yg dimasukkan tidak sesuai dengan skema, kembalikan error
  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  // jika sesuai dengan skema, maka ambil nilai email dari input formnya
  const { email } = validatedFields.data;

  // lalu cari user berdasarkan email yang dimasukkan kedalam input form
  const existingUser = await getUserByEmail(email);

  // jika user tidak ada, kembalikan error
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }
  // jika ada, maka jalankan fungsi generate token untuk reset password user
  const passwordResetToken = await generatePasswordResetToken(email);
  // dan kirim email untuk reset password
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  // lalu, kembalikan success
  return { success: "Confirmation email sent!" };
};
