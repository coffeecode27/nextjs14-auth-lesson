"use client";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation"; // untuk mendapatkan url parameter
import { CardWrapper } from "./card-wrapper";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useCallback, useEffect, useState } from "react";
import { newVerificationAction } from "@/actions/new-verification";
const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const handleCloseSuccess = () => setSuccess("");
  const handleCloseError = () => setError("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // mengambil parameter token

  // menjalankan fungsi onSubmit dengan useCallback tiap kali token berubah
  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }
    // cek ketika token tidak ada
    if (!token) {
      setError("Missing token!");
      return;
    }
    // ketika token ada jalankan server action newVerificationAction dan kirimkan parameter token
    newVerificationAction(token)
      .then((data) => {
        if (data?.error) {
          setError(data?.error); // ketika proses newVerificationAction gagal dan mengembalikan error
          setSuccess("");
        } else {
          setSuccess(data?.success); // ketika proses newVerificationAction sukses dan mengembalikan success
          setError("");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your email verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader color="black" />}
        <FormSuccess message={success} onClose={handleCloseSuccess} />
        {!success && <FormError message={error} onClose={handleCloseError} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
