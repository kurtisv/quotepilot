import { Resend } from "resend";
import type React from "react";

import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  if (!resend || !env.RESEND_FROM_EMAIL) {
    return { skipped: true as const };
  }

  return resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    react: input.react,
  });
}
