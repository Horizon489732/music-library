import { type InferRealtimeEvents, Realtime } from "@upstash/realtime";
import { Redis } from "@upstash/redis";
import z from "zod/v4";

const redis = Redis.fromEnv();

const schema = {
  workflow: {
    runFinish: z.object({}),
    stepFinish: z.object({
      stepName: z.string(),
      result: z.unknown().optional(),
    }),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
