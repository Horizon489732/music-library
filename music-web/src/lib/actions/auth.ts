"use server";
import { signUpSchema } from "../validation";
import { signIn, signOut } from "@/server/auth";
import { db } from "@/server/db";
import { executeAction } from "../executeActions";
import { hash } from "bcrypt";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import { env } from "@/env";

interface SignUpInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInInput {
  email: string;
  password: string;
}

export const signUp = async (formData: SignUpInput) => {
  return executeAction({
    actionFn: async () => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const ipAddress = (await headers()).get("x-forwarded-for") || "127.0.0.1";

      const { success } = await ratelimit.limit(ipAddress);

      if (!success) {
        return redirect("/hold-on");
      }

      const validatedData = signUpSchema.parse(formData);
      const hashedPassword = await hash(validatedData.password, 10);

      const BASE_URL = env.NEXT_APP_URL
        ? `${env.NEXT_APP_URL}`
        : `http://localhost:3000`;

      await workflowClient.trigger({
        url: `${BASE_URL}/api/workflow/onboarding`,
        body: {
          email: validatedData.email.toLocaleLowerCase(),
          name: validatedData.username,
        },
      });

      await db.user.create({
        data: {
          name: validatedData.username,
          email: validatedData.email.toLocaleLowerCase(),
          password: hashedPassword,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export const signInWithCredentials = async (formData: SignInInput) => {
  return executeAction({
    actionFn: async () => {
      await signIn("credentials", {
        redirect: false,
        ...formData,
      });
    },
    successMessage: "Signed in successfully",
  });
};

export const loggingOut = async () => {
  return executeAction({
    actionFn: async () => {
      await signOut({ redirect: false });
    },
    successMessage: "Sign out successfully",
  });
};
