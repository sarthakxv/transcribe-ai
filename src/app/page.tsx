"use client";

import { useState } from "react";
import { actionGetTranscript } from "@/app/actions/getTranscript";
import { Transcript } from "@/components/transcript";
import { ChatBox } from "@/components/chatbox";
import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";

export default function Home() {
  const [lines, setLines] = useState<any[] | undefined>(undefined);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setLines(undefined);
    
    try {
      const result = await actionGetTranscript(formData); // server action
      logger.info("Result: ", result);
      setLines(result);
    } catch (err) {
      logger.error("Error getting transcript:", err);
      setError(err instanceof Error ? err.message : "An error occurred while transcribing");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">YouTube Transcriber</h1>

      <form action={onSubmit} className="mb-6 flex gap-2">
        <Input
          name="url"
          className="flex-1 rounded border px-3 py-2"
          placeholder="Paste YouTube URL"
          required
          disabled={isLoading}
        />
        <button 
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? "Transcribing..." : "Transcribe"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {lines && lines.length === 0 && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          No transcript found
        </div>
      )}

      {lines && lines.length > 0 && (
        <>
          <Transcript
            lines={lines}
            onHighlightChange={setHighlightedIds}
          />
          <ChatBox transcript={lines} />
        </>
      )}
    </main>
  );
}
