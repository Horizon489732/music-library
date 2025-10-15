"use server";
import { signUpSchema, signInSchema } from "../validation";
import { signIn } from "@/server/auth";
import { db } from "@/server/db";
import { executeAction } from "../executeActions";
import { hash } from "bcrypt";

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
      const validatedData = signUpSchema.parse(formData);
      const hashedPassword = await hash(validatedData.password, 10);

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

export const signInWithCredentials = async (
  formData: SignInInput,
) => {
  return executeAction({
    actionFn: async () => {
      await signIn("credentials", {
        redirect: false,
        ...formData
      })
    },
    successMessage: "Signed in successfully"
  })
};