"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerificationAction = async (token: string) => {
  // check if token exists
  const existingToken = await getVerificationTokenByToken(token);
  console.log(existingToken);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // check if user with email exists
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "email does not exist!" };
  }

  // if all checks pass, update user email as verified
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // delete verification token
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified!" };
};
