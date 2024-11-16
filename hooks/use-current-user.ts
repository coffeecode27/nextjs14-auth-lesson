import { useSession } from "next-auth/react";

// Membuat dan menggunakan hook useSession untuk mengambil data user dari session (cara client side)
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
