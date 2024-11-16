import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[60%]  shadow-md backdrop-blur-sm bg-black/10 rounded-lg">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-black/15 rounded-md">
            {user?.id}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-black/15 rounded-md">
            {user?.name}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-black/15 rounded-md">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-black/15 rounded-md">
            {user?.role}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
