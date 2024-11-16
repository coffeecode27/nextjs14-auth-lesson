import { useSession } from "next-auth/react";

// Membuat dan menggunakan hook useSession untuk mengambil data user role dari session (cara client side)
export const useCurrentRole = () => {
  const session = useSession();
  return session.data?.user.role;
};
