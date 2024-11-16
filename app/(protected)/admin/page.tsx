"use client";

import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const handleCloseSuccess = () => {
    return;
  };
  // cara menggunakan server side menggunakan server action dalam nextjs
  const onServerActionClick = async () => {
    admin().then((data) => {
      if (data.success) {
        toast.success("You are allowed to view this page from server action");
      } else {
        toast.error("You are not allowed to view this page from server action");
      }
    });
  };

  // cara menggunakan server side menggunakan api route dalam nextjs
  const onApiRouteClick = async () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("You are allowed to view this page from api route");
      } else {
        toast.error("You are not allowed to view this page from api route");
      }
    });
  };
  return (
    <Card className="w-[60%] shadow-md backdrop-blur-sm bg-black/10 rounded-lg">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">👨‍💻 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess
            message="You are allowed to view this page"
            onClose={handleCloseSuccess}
          />
        </RoleGate>
        <div className="flex flex-row  items-center justify-between rounded-lg border border-slate-700 p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row  items-center justify-between rounded-lg border border-slate-700 p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
