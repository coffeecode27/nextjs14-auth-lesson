import { db } from "@/lib/db";

// fungsi untuk mencari data token 2FA berdasarkan token
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token: token,
      },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

// fungsi untuk mencari data token 2FA berdasarkan email user
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email: email,
      },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
