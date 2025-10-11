import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  if (!str || str === "") return;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
