import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { type NextAuthConfig } from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
import { signInSchema } from "@/lib/validation";

const adapter = PrismaAdapter(db);

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

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
} satisfies NextAuthConfig;
