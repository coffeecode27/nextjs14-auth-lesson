import { db } from "@/lib/db";

// fungsi untuk mengambil data user pada tabel account berdasarkan userId
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });
    return account;
  } catch (error) {
    return null;
  }
};
