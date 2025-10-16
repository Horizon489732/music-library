import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ProfileHeader } from "@/components/Header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }
  return (
  <div>
    <ProfileHeader session={session}/>
    <div>{children}</div>
  </div>);
};

export default Layout;
