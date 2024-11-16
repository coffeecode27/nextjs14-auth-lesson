"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "./card-wrapper";
import { NewPasswordSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPasswordAction } from "@/actions/new-password";
import { useState, useTransition } from "react";
import { FiLoader } from "react-icons/fi";

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // mengambil query url token dan kirim ke newPasswordAction sebagai parameter token

  const handleCloseSuccess = () => setSuccess("");
  const handleCloseError = () => setError("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPasswordAction(values, token).then((data) => {
        if (data?.error) {
          setError(data?.error);
          setSuccess("");
          setTimeout(() => setError(""), 5000);
        } else {
          setSuccess(data?.success);
          setError("");
          setTimeout(() => setSuccess(""), 5000);
          form.reset();
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* email and password input field */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              disabled={isPending}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          {/* end password input field */}

          {/* error and success message */}
          <FormError message={error} onClose={handleCloseError} />
          <FormSuccess message={success} onClose={handleCloseSuccess} />
          {/* end error and success message */}

          {/* button */}
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <div className="flex items-center gap-2">
                <span>processing...</span>
                <FiLoader className="animate-spin h-5 w-5" />
              </div>
            ) : (
              "Reset password"
            )}
          </Button>
          {/* end button */}
        </form>
      </Form>
    </CardWrapper>
  );
};
