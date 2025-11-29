import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { after } from "next/server";
import { db } from "@/server/db";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import BreadcrumbClient from "@/components/ui/breadcrumb-client";

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
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset className="flex h-screen flex-col">
        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 border-b-1 px-4 py-2">
            <div className="flex shrink-0 grow items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <SidebarSeparator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbClient />
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div>{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
