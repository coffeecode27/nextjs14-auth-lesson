import { db } from "@/lib/db";

// fungsi untuk mencari data konfirmasi 2FA berdasarkan userId
// jadi, fungsi ini nantinya juga akan mencari data userId kedalam table User (field id)
// karena table TwoFactorConfirmation memiliki relasi dengan table User
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
