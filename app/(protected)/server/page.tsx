// contoh server component
import { UserInfo } from "@/components/user-info";
import { CurrentUser } from "@/lib/auth";
const ServerPage = async () => {
  const user = await CurrentUser(); // mendapatkan session dengan cara server side pada server component
  return <UserInfo user={user} label="🖥️ Server Component" />;
};

export default ServerPage;
