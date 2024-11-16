"use server";
import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const loginAction = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email or password" };
  }
  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email); // mengambil data user berdasarkan email

  // pengecekan jika user tidak ada, email tidak ada, atau password tidak ada(karna login menggunakan oauth)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // Pengecekan jika user belum verifikasi email
  if (!existingUser.emailVerified) {
    // jika iya, maka generate token
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    // kirim email verifikasi dengan email dan token yg didapat dari proses generate token
    await sendVerificationEmail(existingUser.email, verificationToken.token);
    return {
      success: "Confirmation email sent!",
    };
  }

  // Pengecekan apakah status 2FA user aktif atau true dan email user ada (true)
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // jadi, karena tombol confirm dan login menggunakan action yg sama,
    // maka kita cek dulu, apakah tombol ditekan dengan menyertakan code 2FA
    // jika iya, artinya user sedang pada proses confirmasi code 2FA, maka kita perlu melakukan pengecekan atau verify
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      // jika code 2FA tidak ditemukan, kembalikan error
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      // jika code 2FA yg ditemukan tidak sesuai dengan code yg dimasukkan, kembalikan error
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      // jika code 2FA sudah masuk waktu expired, kembalikan error
      if (new Date(twoFactorToken.expires) < new Date()) {
        return { error: "Code has expired!" };
      }

      // jika code 2FA sudah sesuai, hapus token 2FA
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // lalu cari confirmation code 2FA berdasarkan id user didalam table TwoFactorConfirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      // jika confirmation code 2FA ditemukan, hapus confirmation code 2FA
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      // lalu create atau buat confirmation code 2FA baru
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // dan, jika tombol ditekan tidak menyertakan code 2FA, artinya user sedang melakukan login, dan lakukan generate token 2FA
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      // lalu kirim code 2FA ke email user untuk melakukan aktifasi atau confirmasi code
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      return {
        successTwoFactor: "2FA code has already sent to your email!",
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };

        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
