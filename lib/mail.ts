import { Resend } from "resend";

// make new instance of resend
export const resend = new Resend(process.env.RESEND_API_KEY as string);

const domain = process.env.NEXT_PUBLIC_APP_URL;

// fungsi untuk mengirim email code 2FA
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  // send email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Here is your 2FA code: ${token}</p>`,
  });
};

// fungsi untuk mengirim email reset password
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  // send email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

// fungsi untuk mengirim email verifikasi
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  // send email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm email account",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm  your email.</p>`,
  });
};
