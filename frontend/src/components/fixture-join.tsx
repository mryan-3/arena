"use client";

import { useState } from "react";

interface FixtureJoinProps {
  onJoin: (name: string) => void;
}

export function FixtureJoin({ onJoin }: FixtureJoinProps) {
  const [inputValue, setInputValue] = useState("");

  const handleJoin = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onJoin(trimmed);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-sm border border-zinc-300 bg-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-900">
          Join as Fixture
        </h2>
        <input
          autoFocus
          type="text"
          placeholder="Enter Device Name (e.g. Stage Left)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-zinc-300 p-3 text-sm text-zinc-950 bg-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 font-mono"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleJoin();
          }}
        />
        <button
          onClick={handleJoin}
          className="border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 p-3 text-xs font-bold uppercase tracking-widest transition-colors font-mono"
        >
          Join
        </button>
      </div>
    </div>
  );
}
