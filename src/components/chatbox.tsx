"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ChatBox({ transcript }: { transcript: any[] }) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question, transcript }),
      headers: { "Content-Type": "application/json" },
    });
    const { answer } = await res.json();
    setHistory((h) => [...h, { q: question, a: answer }]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <div className="space-y-4">
        {history.map((m, i) => (
          <div key={i} className="space-y-1">
            <p className="font-semibold">You: {m.q}</p>
            <p className="text-gray-800">AI: {m.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          className="flex-1 rounded border px-3 py-2"
          type="text"
          placeholder="Ask about the video…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          onClick={ask}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </Button>
        {loading && <span className="text-sm text-gray-500">
          thinking...
        </span>}
      </div>
    </div>
  );
}
