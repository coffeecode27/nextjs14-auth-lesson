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

import { CardWrapper } from "./card-wrapper";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { loginAction } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";

export const LoginForm = () => {
  const handleCloseSuccess = () => setSuccess("");
  const handleCloseError = () => setError("");
  const handleCloseSuccessTwoFactor = () => setSuccessTwoFactor("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already linked to another account!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [successTwoFactor, setSuccessTwoFactor] = useState<string | undefined>(
    ""
  );
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      loginAction(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
            setSuccess("");
            setTimeout(() => setError(""), 5000);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
            setError("");
            setTimeout(() => setSuccess(""), 5000);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            setSuccessTwoFactor(data.successTwoFactor);
            setTimeout(() => setSuccessTwoFactor(""), 5000);
            setError("");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Sign in to your account"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* email and password input field */}
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                disabled={isPending}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Authentication code</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  disabled={isPending}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Jonny@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  disabled={isPending}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          size="sm"
                          variant="link"
                          asChild
                          className="px-0"
                        >
                          <Link href="/auth/reset">Forgot Password?</Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
          </div>
          {/* end email and password input field */}

          {/* error and success message */}
          <FormError message={error || urlError} onClose={handleCloseError} />
          <FormSuccess message={success} onClose={handleCloseSuccess} />
          {
            <FormSuccess
              message={successTwoFactor}
              onClose={handleCloseSuccessTwoFactor}
            />
          }
          {/* end error and success message */}

          {/* button */}
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <div className="flex items-center gap-2">
                <span>{showTwoFactor ? "Verifying ..." : "Logging in..."}</span>
                <FiLoader className="animate-spin h-5 w-5" />
              </div>
            ) : (
              `${showTwoFactor ? "Verify" : "Login"}`
            )}
          </Button>
          {/* end button */}
        </form>
      </Form>
    </CardWrapper>
  );
};
