"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";

export const HomeHeader = () => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={48} height={48} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              "cursor-pointer text-base capitalize",
              pathname === "/library"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Library
          </Link>
        </li>

        <li>
          <Link href="user-profile">
            <Button>Try It Out</Button>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export const ProfileHeader = ({session}:{session?:Session | null}) => {

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={48} height={48} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Avatar className="shadow-sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </li>
      </ul>
    </header>
  );
};
