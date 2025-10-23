import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/server/db";
import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  name: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THREE_HUNDRED_DAYS_IN_MS = 300 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return "non-active";
  }

  const updateAt = user?.updatedAt;
  const today = new Date();

  const timeDifference = today.getTime() - updateAt.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THREE_HUNDRED_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      to: email,
      subject: "Welcome to the platform",
      body: `Hello ${name}. Thanks for signing up!`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          to: email,
          subject: "We miss you!",
          body: "Come back and check out our platform.",
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          to: email,
          subject: "Thank you",
          body: "Thank you for using the service. Enjoy the music!",
        });
      });
    }

    await context.sleep("wait-for-10-month", 60 * 60 * 24 * 30 * 10);
  }
});
