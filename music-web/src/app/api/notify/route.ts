/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { z } from "zod";

const EmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
});

const POST = verifySignatureAppRouter(sendEmail, {
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

async function sendEmail(req: NextRequest) {
  const data = await req.json();
  const { to, subject, body } = EmailSchema.parse(data);

  console.log("Sending email to:", to);
  console.log("Subject:", subject);
  console.log("Body:", body);

  return NextResponse.json({ status: "ok" });
}

export { POST };
