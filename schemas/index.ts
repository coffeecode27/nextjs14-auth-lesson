// schemas bertujuan untuk membuat atau merangkai skema dari form yg akan dibuat
import { UserRole } from "@prisma/client";
import * as z from "zod";

// schema untuk form settings
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      // jika password ada dan newPassword tidak ada
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      // jika newPassword ada dan password tidak ada
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

// schema untuk form password baru
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});
// schema untuk form reset password
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

// schema untuk form login
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, "Password is required"), // dont limit the minimum password at login form
  code: z.optional(z.string()), // optional input for 2FA code
});

// schema untuk form register
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
