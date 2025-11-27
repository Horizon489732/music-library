import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <main className="text-admin-foreground bg-admin-background flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="bg-admin-primary-foreground xs:p-10 flex w-[calc(100%-264px)] flex-1 flex-col p-5">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default Layout;
