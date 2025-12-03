import { Realtime, type InferRealtimeEvents } from "@upstash/realtime";
import { Redis } from "@upstash/redis";
import z from "zod/v4";

const redis = Redis.fromEnv();

const schema = {
  workflow: {
    started: z.object({
      songId: z.string(),
      workflowRunId: z.string(),
    }),
    runFinish: z.object({}),
    stepFinish: z.object({
      stepName: z.string(),
      result: z.unknown().optional()
    }),
  },
}
export const realtime = new Realtime({ schema, redis });

// Infer TS types
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
