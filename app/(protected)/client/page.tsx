"use client";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const CLientPage = () => {
  const user = useCurrentUser(); // mendapatkan session dengan cara server action
  return <UserInfo user={user} label="💻 Server Component" />;
};

export default CLientPage;
