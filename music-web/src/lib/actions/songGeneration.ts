"use server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { enqueueSong } from "../workflow";
import { db } from "@/server/db";

export const generateSong = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  await db.song.update({
    where: { id: "test song 1" },
    data: {
      lyrics: "Some test lyrics",
      aiDetails: {
        upsert: {
          create: {
            fullDescribedSong: "A happy, upbeat song for testing",
            useErgTag: false,
          },
          update: {
            fullDescribedSong: "A happy, upbeat song for testing",
          },
        },
      },
    },
  });

  const song = await enqueueSong({
    userId: session.user.id,
    songId: "test song 1",
  });

  console.log(song);
};
