"use client";

import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Line = { id: number; text: string };

export function Transcript({
  lines,
  onHighlightChange,
}: {
  lines: Line[];
  onHighlightChange: (ids: number[]) => void;
}) {
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    const next = new Set(highlighted);
    next.has(id) ? next.delete(id) : next.add(id);
    setHighlighted(next);
    onHighlightChange(Array.from(next));
  };

  return (
    <div className="space-y-1">
      {lines.map((line) => (
        <Tooltip key={line.id}>
          <TooltipTrigger asChild>
            <p
              onClick={() => toggle(line.id)}
              className={cn(
                "cursor-pointer rounded px-1",
                highlighted.has(line.id) && "bg-yellow-200"
              )}
            >
              {line.text}
            </p>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
          >
            {highlighted.has(line.id) ? "Un-highlight" : "Highlight"}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
