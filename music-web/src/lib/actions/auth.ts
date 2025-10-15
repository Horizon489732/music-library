"use server";
import { signUpSchema } from "../validation";
import { db } from "@/server/db";
import { executeAction } from "../executeActions";
import { hash } from "bcrypt";

interface SignUpInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const signUp = async (formData: SignUpInput) => {
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

export { signUp };
