import { workflowClient } from "@/lib/workflow";
import { env } from "@/env";
import { Receiver } from "@upstash/qstash";

const BASE_URL = env.NEXT_APP_URL || "http://localhost:3000";
const currentKey = env.QSTASH_CURRENT_SIGNING_KEY;
const nextKey = env.QSTASH_NEXT_SIGNING_KEY ?? "";

if (!currentKey) {
  throw new Error("QSTASH_CURRENT_SIGNING_KEY is not set");
}

const receiver = new Receiver({
  currentSigningKey: currentKey,
  nextSigningKey: nextKey,
});

export async function POST(req: Request) {
  try {
    const signature =
      req.headers.get("Upstash-Signature") ??
      req.headers.get("upstash-signature");
    const rawBody = await req.text();
    const isValid = await receiver.verify({
      signature: signature ?? "",
      body: rawBody,
    });

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: "Invalid QStash signature" }),
        { status: 401 },
      );
    }

    const { userId, songId } = JSON.parse(rawBody) as {
      userId: string;
      songId: string;
    };

    console.log("In process-song", "userId: ", userId, "songId: ", songId);

    //trigger Upstash workflow
    await workflowClient.trigger({
      url: `${BASE_URL}/api/workflow/generate-song`,
      body: {
        userId: userId,
        songId: songId,
      },
    });

    return new Response(JSON.stringify({ queued: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to trigger workflow", { status: 500 });
  }
}
