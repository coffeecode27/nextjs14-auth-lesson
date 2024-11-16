import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

const Registerpage = () => {
  return (
    <div className="text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};
export default Registerpage;
