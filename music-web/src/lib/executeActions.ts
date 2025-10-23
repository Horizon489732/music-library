import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Prisma } from "@prisma/client";

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = "The actions was successful",
}: Options<T>): Promise<{ success: boolean; message: string }> => {
  try {
    await actionFn();

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);

    // Handling email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Email already exists!" };
    }

    return {
      success: false,
      message: "An error has occurred during executing the action",
    };
  }
};

export { executeAction };
