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
import { ResetSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { resetAction } from "@/actions/reset";
import { useState, useTransition } from "react";
import { FiLoader } from "react-icons/fi";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleCloseSuccess = () => setSuccess("");
  const handleCloseError = () => setError("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      resetAction(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
          setSuccess("");
          form.reset();
          setTimeout(() => setError(""), 5000);
        } else {
          setSuccess(data?.success);
          setError("");
          form.reset();
          setTimeout(() => setSuccess(""), 5000);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset your password"
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
          </div>
          {/* end email input field */}

          {/* error and success message */}
          <FormError message={error} onClose={handleCloseError} />
          <FormSuccess message={success} onClose={handleCloseSuccess} />
          {/* end error and success message */}

          {/* button */}
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <div className="flex items-center gap-2">
                <span>Sending...</span>
                <FiLoader className="animate-spin h-5 w-5" />
              </div>
            ) : (
              "Send reset email"
            )}
          </Button>
          {/* end button */}
        </form>
      </Form>
    </CardWrapper>
  );
};
