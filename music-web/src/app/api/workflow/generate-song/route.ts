import { db } from "@/server/db";
import { env } from "@/env";
import { serve } from "@upstash/workflow/nextjs";
import { WorkflowNonRetryableError } from "@upstash/workflow";

type InitialData = {
  userId: string;
  songId: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { userId, songId } = context.requestPayload;

  //checking environment variables
  if (
    !env.GENERATE_FROM_DESCRIPTION_URL ||
    !env.GENERATE_FROM_DESCRIBED_LYRICS_URL ||
    !env.GENERATE_WITH_LYRICS_URL
  ) {
    throw new Error("Missing music generation url");
  }

  //get the song
  const song = await context.run("fetch-song", async () => {
    console.log("Inside fetch-song workflow step", "songId:", songId);
    return await db.song.findUniqueOrThrow({
      where: { id: songId },
      include: { aiDetails: true },
    });
  });

  if (!song) {
    throw new WorkflowNonRetryableError("Song does not exist!");
  }

  if (song.status === "processing") {
    console.log(`Song ${songId} is already processing. Aborting generation.`);
    throw new WorkflowNonRetryableError(
      "Song is already processing. Aborting generation",
    );
  }

  //change the status to processing
  await context.run("set-processing", async () => {
    await db.song.update({
      where: { id: songId },
      data: { status: "processing" },
    });
  });

  type RequestPayload = {
    full_described_song?: string;
    lyrics?: string;
    described_lyrics?: string;
    prompt?: string;
    audio_duration?: number;
    seed?: number;
    guidance_scale?: number;
    infer_step?: number;
    instrumental?: boolean;
    guidance_scale_text?: number;
    guidance_scale_lyric?: number;
    scheduler_type?: string;
    use_erg_tag?: boolean;
    use_erg_lyric?: boolean;
    use_erg_diffusion?: boolean;
    cfg_type?: string;
    guidance_interval?: number;
    guidance_interval_decay?: number;
  };

  const commonParams = {
    audio_duration: song.duration,
    seed: song.aiDetails?.seed ?? undefined,
    guidance_scale: song.aiDetails?.guidanceScale ?? undefined,
    infer_step: song.aiDetails?.inferStep ?? undefined,
    instrumental: song.instrumental,
    guidance_scale_text: song.aiDetails?.guidanceScaleText ?? undefined,
    guidance_scale_lyric: song.aiDetails?.guidanceScaleLyric ?? undefined,
    scheduler_type: song.aiDetails?.schedulerType ?? undefined,
    use_erg_tag: song.aiDetails?.useErgTag ?? undefined,
    use_erg_lyric: song.aiDetails?.useErgLyric ?? undefined,
    use_erg_diffusion: song.aiDetails?.useErgDiffusion ?? undefined,
    cfg_type: song.aiDetails?.cfgType ?? undefined,
    guidance_interval: song.aiDetails?.guidanceInterval ?? undefined,
    guidance_interval_decay: song.aiDetails?.guidanceIntervalDecay ?? undefined,
  };

  let endpoint = "";
  let bodyPayload: RequestPayload = {};

  if (song.aiDetails?.fullDescribedSong) {
    endpoint = env.GENERATE_FROM_DESCRIPTION_URL;
    bodyPayload = {
      full_described_song: song.aiDetails.fullDescribedSong,
      ...commonParams,
    };
  } else if (song.lyrics && song.aiDetails?.prompt) {
    endpoint = env.GENERATE_WITH_LYRICS_URL;
    bodyPayload = {
      lyrics: song.lyrics,
      prompt: song.aiDetails.prompt,
      ...commonParams,
    };
  } else if (song.aiDetails?.describedLyrics && song.aiDetails.prompt) {
    endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS_URL;
    bodyPayload = {
      described_lyrics: song.aiDetails.describedLyrics,
      prompt: song.aiDetails.prompt,
      ...commonParams,
    };
  } else {
    throw new WorkflowNonRetryableError("No valid generation mode detected.");
  }

  console.log(
    "Calling AI endpoint",
    endpoint,
    "with body:",
    JSON.stringify(bodyPayload),
  );
  //calling AI endpoints
  const response = await context.call("generate-song", {
    url: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Modal-Key": env.MODAL_KEY,
      "Modal-Secret": env.MODAL_SECRET,
    },
    retries: 1,
    body: bodyPayload,
  });

  if (response.status >= 400) {
    console.error(
      `Song generation failed for songId: ${songId}, Response status: ${response.status}`,
    );
    await db.song.update({
      where: { id: songId },
      data: { status: "failed" },
    });
    throw new WorkflowNonRetryableError("No valid generation mode detected.");
  }

  const responseData = response.body as {
    s3_key: string;
    thumbnails_image_s3_key: string;
    categories: string[];
  };

  //update song with new data
  await context.run("update-song", async () => {
    await db.song.update({
      where: { id: songId },
      data: {
        audioUrl: responseData.s3_key,
        imageUrl: responseData.thumbnails_image_s3_key,
        status: "processed",
        categories: {
          connectOrCreate: responseData.categories.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });
  });

  return new Response(JSON.stringify({ success: true, userId, songId }), {
    status: 200,
  });
});
