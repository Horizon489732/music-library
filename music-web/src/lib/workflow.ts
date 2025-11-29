import { env } from "@/env";
import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
  baseUrl: env.QSTASH_URL,
  token: env.QSTASH_TOKEN,
});

const client = new QStashClient({ token: env.QSTASH_TOKEN });

const BASE_URL = env.NEXT_APP_URL
  ? `${env.NEXT_APP_URL}`
  : `http://localhost:3000`;

//Sending Emails
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

//Generate Songs
type SongPayload = {
  userId: string;
  songId: string;
};

const queue = client.queue({
  queueName: `song-generation`,
});

await queue.upsert({
  //max 3 songs generation at a time so don't overload my AI endpoints
  parallelism: 3,
});

export const enqueueSong = async (payload: SongPayload) => {
  try {
    const { userId, songId } = payload;

    await queue.enqueueJSON({
      url: `${BASE_URL}/api/process-song`,
      body: { userId, songId },
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to queue songs:", error);
    throw error;
  }
};
