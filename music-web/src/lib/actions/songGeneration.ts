"use server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { enqueueSong } from "../workflow";
import { db } from "@/server/db";

export interface GenerateSongRequest {
  prompt?: string;
  lyric?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  instrumental: boolean;
  audioDuration: number;
  inferStep: number;
  guidanceScale: number;
  guidanceScaleText: number;
  guidanceScaleLyric: number;
  schedulerType: string;
  useErgTag: boolean;
  useErgLyric: boolean;
  useErgDiffusion: boolean;
  guidanceInterval: number;
  guidanceIntervalDecay: number;
  seed: number;
  cfgType: string;
}

export const generateSong = async (request: GenerateSongRequest) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  const song = await db.song.create({
    data: {
      userId: userId,
      title: "Untitled",
      lyrics: request.lyric,
      isAISong: true,
      instrumental: request.instrumental,
      duration: request.audioDuration,
    },
  });

  let aiDetailsId: string | null = null;

  if (request.prompt || request.fullDescribedSong || request.describedLyrics) {
    const aiDetails = await db.aISongDetails.create({
      data: {
        prompt: request.prompt,
        fullDescribedSong: request.fullDescribedSong,
        describedLyrics: request.describedLyrics,
        inferStep: request.inferStep,
        guidanceScale: request.guidanceScale,
        guidanceScaleText: request.guidanceScaleText,
        guidanceScaleLyric: request.guidanceScaleLyric,
        schedulerType: request.schedulerType,
        useErgTag: request.useErgTag,
        useErgLyric: request.useErgLyric,
        useErgDiffusion: request.useErgDiffusion,
        guidanceInterval: request.guidanceInterval,
        guidanceIntervalDecay: request.guidanceIntervalDecay,
        cfgType: request.cfgType,
      },
    });

    aiDetailsId = aiDetails.id;
  }

  if (aiDetailsId) {
    await db.song.update({
      where: { id: song.id },
      data: {
        aiDetailsId: aiDetailsId,
      },
    });
  }

  await enqueueSong({
    userId: userId,
    songId: song.id,
  });
};
