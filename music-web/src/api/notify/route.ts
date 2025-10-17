import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

type EmailRequest = {
  to: string;
  subject: string;
  body: string;
};

async function sendEmail(req: NextRequest) {
  const { to, subject, body } = (await req.json()) as EmailRequest;

  console.log("Sending email to:", to);
  console.log("Subject:", subject);
  console.log("Body:", body);

  return NextResponse.json({ status: "ok" });
}

export const POST = verifySignatureAppRouter(sendEmail, {
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});
