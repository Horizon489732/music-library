import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="mb-4 animate-pulse text-5xl font-bold">🛑 HOLD ON!</h1>
      <p className="mb-6 text-xl">
        Slow down, speedster! You’re moving faster than a caffeinated squirrel
        on roller skates. 🐿️🛼
      </p>
      <p className="text-xl">
        We tried to catch you… but even our servers are like “bro, chill.” 😵‍💫
      </p>
      <Image
        src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
        alt="Funny waiting"
        width={256}
        height={256}
        unoptimized
        className="rounded-lg shadow-lg"
      />
      <p className="text-sm">
        Recommendation: do a dramatic hair flip, sip some water, or question
        your life choices while you wait. 💃🕺
      </p>
      <p className="text-muted-foreground mt-8 text-sm italic">
        The paragraphs here are written by ChatGPT. It is supposed to be funny
      </p>
    </div>
  );
};

export default Page;
