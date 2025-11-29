"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
            <Button className="cursor-pointer rounded-4xl hover:scale-105">
              <p>Your Turn</p>
              <svg
                width="12px"
                height="12px"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points="7 2 17 12 7 22"
                />
              </svg>
            </Button>
          </Link>
        </li>
      </ul>
    </header>
  );
};
