import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

// fungsi untuk generate token 2FA
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString(); // generate token (menghasilkan angka acak yang selalu enam digit)
  const expires = new Date(new Date().getTime() + 3600 * 1000); // menambhakan waktu expired 1 jam dari waktu sekarang

  // check berdasarkan email apakah user didalam tabel TwoFactorToken sudah ada
  const existingToken = await getTwoFactorTokenByEmail(email);
  // jika sudah ada, hapus token lama
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // dan membuat token baru
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email, // email user
      token, // token yang di generate
      expires, // expired token
    },
  });

  // kembalikan data token
  return twoFactorToken;
};

// fungsi generate token untuk reset password user
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // menambhakan waktu expired 1 jam dari waktu sekarang

  // check jika user didalam tabel password reset token sudah ada
  const existingToken = await getPasswordResetTokenByEmail(email);
  // jika sudah ada, itu artinya user sudah melakukan reset password sebelumnya
  // maka hapus token lama berdasarkan id user (didalam tabel password reset token)
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // dan membuat token baru
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email, // email user
      token, // token yang di generate
      expires, // expired token
    },
  });

  // kembalikan data token
  return passwordResetToken;
};

// fungsi generate token untuk verifikasi email user
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // menambhakan waktu expired 1 jam dari waktu sekarang
  const existingToken = await getVerificationTokenByEmail(email); // mengambil data token berdasarkan email user

  // cek apakah data token sudah ada, jika token sudah ada, hapus token lama dan buat token baru
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  //  generate token baru (untuk user lama dan user baru)
  const verificationToken = await db.verificationToken.create({
    data: {
      email, // email user
      token, // token yang di generate
      expires, // expired token
    },
  });
  // kembalikan data token
  return verificationToken;
};
