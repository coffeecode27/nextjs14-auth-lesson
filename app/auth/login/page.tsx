import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

const Loginpage = () => {
  return (
    <div className="text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default Loginpage;
