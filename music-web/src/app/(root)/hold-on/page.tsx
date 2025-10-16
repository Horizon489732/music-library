import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 gap-4">
      <h1 className="text-5xl font-bold mb-4 animate-pulse">⏳ Hold On!</h1>
      <p className="text-xl mb-6">
        Whoa there! You're moving faster than the internet itself. 🌐💨
      </p>
      <p className="mb-6">
        Please take a short break before trying again. Your future self will thank you. 😎
      </p>
      <img
        src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
        alt="Funny waiting"
        className="w-64 h-64 rounded-lg shadow-lg"
      />
      <p className="mt-4 text-sm italic">The paragraphs here are written by ChatGPT. It is supposed to be funny</p>
    </div>
  );
};

export default Page;
