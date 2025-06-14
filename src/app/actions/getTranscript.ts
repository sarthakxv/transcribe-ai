"use server";

import { getTranscript } from "@/lib/getTranscript";
import { logger } from "@/lib/logger";

export async function actionGetTranscript(formData: FormData) {
  const url = formData.get("url") as string;
  logger.info("Getting transcript for URL: ", url);

  if (!url) {
    throw new Error("URL is required");
  }

  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    throw new Error("Invalid URL, must be a YouTube URL");
  }

  try {
    // serialisable → returns to client
    return await getTranscript(url);
  } catch (error) {
    logger.error("Error in actionGetTranscript:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get transcript");
  }
}
