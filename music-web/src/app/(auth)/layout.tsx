import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth/index";
import Link from "next/link";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <main className="text-muted-foreground relative flex flex-col-reverse sm:flex-row">
      <section className="my-auto flex h-full min-h-screen flex-1 items-center px-5 py-10">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-lg border-2 border-black p-10">
          <div className="flex flex-row flex-wrap justify-between items-center gap-3">
              <div className="flex flex-row items-center gap-3">
                <Image src="/icons/logo.svg" alt="logo" width={48} height={48} />
                <h1 className="text-2xl font-semibold">iLoveMusic</h1>
              </div>
              <Link href="/" className="text-foreground">Homepage</Link>
          </div>
          <div>{children}</div>
        </div>
      </section>

      <section className="sticky h-40 w-full sm:top-0 sm:h-screen sm:flex-1">
        <Image
          src="/images/auth-illustration.png"
          alt="image"
          width={1000}
          height={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout;
