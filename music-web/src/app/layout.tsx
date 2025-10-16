import type { Metadata } from "next";
import "@/styles/globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth/index";

export const metadata: Metadata = {
  title: "My Web App",
  description: "Good luck on this journey!",
  icons: "/favicon.ico",
};

const dmSans = localFont({
  src: [
    {
      path: "../fonts/DMSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/DMSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    { path: "../fonts/DMSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const spaceMono = localFont({
  src: [{ path: "../fonts/SpaceMono-Regular.ttf" }],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${dmSans.className} ${spaceMono.variable} font-sans antialiased`}
        >
          <Toaster richColors closeButton position="top-right" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
