import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string): string => {
  return (name ?? "H")
    .split(/[\s-_]+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};
