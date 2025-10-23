import { env } from "@/env";
import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
  baseUrl: env.QSTASH_URL,
  token: env.QSTASH_TOKEN,
});

const client = new QStashClient({ token: env.QSTASH_TOKEN });

const BASE_URL = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : `http://localhost:3000`;

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export const sendEmail = async (payload: EmailPayload) => {
  try {
    const res = await client.publishJSON({
      url: `${BASE_URL}/api/notify`,
      body: payload,
      headers: { "Content-Type": "application/json" },
    });
    console.log("Email queued successfully:", res);
    return res;
  } catch (error) {
    console.error("Failed to queue email:", error);
    throw error;
  }
};
