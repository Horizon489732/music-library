"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { DefaultValues, Path } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";

import { FIELD_NAMES, FIELD_TYPES } from "@/contants";

interface Props<T extends z.ZodTypeAny> {
  type: string;
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends z.ZodTypeAny>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";

  const router = useRouter();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<z.infer<T>>,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const myPromise = onSubmit(data);

    toast.promise(myPromise, {
      loading: isSignIn ? "Signing in..." : "Signing up...",
      success: (result: { success: boolean; error?: string }) => {
        if (result.success) {
          router.push("/user-profile");
          return isSignIn
            ? "Signed in successfully!"
            : "Account created! Please sign in.";
        } else {
          throw new Error(result.error ?? "Something went wrong");
        }
      },
      error: (err: Error) => err.message || "Error occurred",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-foreground text-2xl font-semibold">
        {isSignIn ? "Welcome Back!" : "Create Your Account"}
      </h1>
      <p className="text-accent">
        {isSignIn
          ? "Ready to enjoy some music?"
          : "Just a few details to get you started"}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field: string) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<z.infer<T>>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      {...field}
                      className="rounded-md border-2 border-black focus-visible:shadow-none focus-visible:ring-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="submit"
            className="cursor-pointer inline-flex min-h-12 w-full items-center justify-center rounded-md px-6 text-base font-bold"
          >
            Submit
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "First time?" : "Already have an account?"}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-accent ml-2 font-bold"
        >
          {isSignIn ? "Sign Up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
