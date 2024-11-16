import { auth } from "@/auth";

// lib untuk mendapatkan session dan mengambil data user (cara server side)
export const CurrentUser = async () => {
  const session = await auth();
  return session?.user;
};

// lib untuk mendapatkan session dan mengambil data user role (cara server side)
export const CurrentRole = async () => {
  const session = await auth();
  return session?.user?.role;
};
