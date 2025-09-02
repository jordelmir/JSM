import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join CSS class names and resolve Tailwind CSS conflicts.
 * It combines `clsx` for conditional class joining and `tailwind-merge` for intelligently merging Tailwind classes.
 *
 * @param {...ClassValue[]} inputs - A list of class values (strings, objects, arrays) to be joined.
 * @returns {string} The merged and joined CSS class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}