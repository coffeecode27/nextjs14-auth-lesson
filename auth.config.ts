import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";

// objek auth.config.js umum yang dapat digunakan di mana saja. Ini tidak akan menyertakan adaptor basis data
// dan nantinya, auth didalam middleware akan menggunakan objek ini (auth.config.ts)
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null; // untuk kasus ketika user mendafatar menggunakan google (tidak ada password)
          const passwordMatch = await bcrypt.compare(password, user.password); // melakukan compare password user dengan password yang ada di database
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
