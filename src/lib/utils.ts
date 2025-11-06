// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This is your existing function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- NEW FUNCTION ADDED ---

/**
 * Cleans a full website URL into a plain root domain.
 * e.g., "https://www.google.com/search" becomes "google.com"
 * @param urlString The full URL to clean.
 * @returns The root domain, or an empty string if invalid.
 */
export function getDomainFromUrl(urlString: string): string {
  if (!urlString) {
    return "";
  }

  try {
    // 1. Ensure it has a protocol for the URL parser to work
    let fullUrl = urlString;
    if (!/^https?:\/\//.test(fullUrl)) {
      fullUrl = `https://${fullUrl}`;
    }

    // 2. Use the browser's built-in URL parser
    const url = new URL(fullUrl);
    let hostname = url.hostname; // "www.google.com" or "google.com"

    // 3. Remove "www." prefix if it exists
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4); // "google.com"
    }

    return hostname;

  } catch (error) {
    // Handle cases where the URL is completely invalid
    console.error("Could not parse URL:", urlString);
    return "";
  }
}