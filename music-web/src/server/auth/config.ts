/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import { compare } from "bcrypt";
import { type NextAuthConfig, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
import { signInSchema } from "@/lib/validation";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const validatedCredentials = signInSchema.parse(credentials);
        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }
        const isPasswordValid = await compare(
          validatedCredentials.password,
          user.password,
        );
        if (!isPasswordValid) throw new Error("Invalid credentials.");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
