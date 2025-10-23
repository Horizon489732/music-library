import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ProfileHeader } from "@/components/Header";
import { after } from "next/server";
import { db } from "@/server/db";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  after(async () => {
    if (!session.user?.id) return;

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    const updateAt = user?.updatedAt;
    const today = new Date();

    const isSameDay =
      updateAt?.getUTCFullYear() === today.getUTCFullYear() &&
      updateAt?.getUTCMonth() === today.getUTCMonth() &&
      updateAt?.getUTCDate() === today.getUTCDate();

    if (isSameDay) return;

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        updatedAt: today,
      },
    });
  });
  return (
    <div>
      <ProfileHeader session={session} />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
