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
import { FiLoader } from "react-icons/fi";
import { CardWrapper } from "./card-wrapper";
import { RegisterSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { registerAction } from "@/actions/register";
import { useState, useTransition } from "react";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleCloseSuccess = () => setSuccess("");
  const handleCloseError = () => setError("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      registerAction(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
          setSuccess("");
          form.reset();
          setTimeout(() => setError(""), 5000);
        } else {
          setSuccess(data.success);
          setError("");
          setTimeout(() => setSuccess(""), 5000);
          form.reset();
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create your account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Jonny" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
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
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormError message={error} onClose={handleCloseError} />
          <FormSuccess message={success} onClose={handleCloseSuccess} />
          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <div className="flex items-center gap-2">
                <span>Registering...</span>
                <FiLoader className="animate-spin h-5 w-5" />
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
