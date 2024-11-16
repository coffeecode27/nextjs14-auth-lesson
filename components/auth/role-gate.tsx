"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "../form-error";
import { UserRole } from "@prisma/client"; // untuk menggunakan enum role pada type dalam props interface RoleGateProps

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function RoleGate({ children, allowedRole }: RoleGateProps) {
  const handleCloseError = () => {
    return;
  };
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <FormError
        message="You do not have permission to view this page"
        onClose={handleCloseError}
      />
    );
  }
  return <>{children}</>;
}
