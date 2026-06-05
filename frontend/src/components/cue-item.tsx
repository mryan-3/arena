"use client";

import { Trash, Play } from "@phosphor-icons/react";

interface CueItemProps {
  id: string;
  name: string;
  color: string;
  brightness: number;
  isActive: boolean;
  onTrigger: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CueItem({ id, name, color, brightness, isActive, onTrigger, onDelete }: CueItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 border transition-colors ${
        isActive
          ? "border-zinc-950 bg-zinc-100"
          : "border-zinc-200 bg-white hover:bg-zinc-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {isActive && (
          <div className="w-1.5 h-6 bg-zinc-950" />
        )}
        <div
          className="w-6 h-6 rounded-sm border border-zinc-300 flex-shrink-0"
          style={{ backgroundColor: color, opacity: brightness / 100 }}
        />
        <div className="flex flex-col">
          <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-zinc-950" : "text-zinc-700"}`}>
            {name}
          </span>
          <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono">
            {color} @ {brightness}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onTrigger(id)}
          className={`p-1.5 border transition-colors ${
            isActive ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-600 hover:text-zinc-950 hover:border-zinc-950"
          }`}
          title="Direct Trigger"
        >
          <Play weight="fill" size={14} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 border border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-red-600 transition-colors"
          title="Delete Cue"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
}
