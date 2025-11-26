import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";

const Layout = async ({children}: {children: ReactNode}) => {

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in"); 
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
        <Sidebar />

        <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-admin-primary-foreground p-5 xs:p-10">
          <p>header</p>
          {children}
        </div>
    </main>
  );
};

export default Layout;
