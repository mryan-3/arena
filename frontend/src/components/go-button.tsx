"use client";

import { Play } from "@phosphor-icons/react";

interface GoButtonProps {
  onGo: () => void;
  disabled: boolean;
}

export function GoButton({ onGo, disabled }: GoButtonProps) {
  return (
    <button
      onClick={onGo}
      disabled={disabled}
      className={`w-full py-8 flex items-center justify-center gap-4 transition-all duration-150 border-2 ${
        disabled
          ? "border-zinc-300 bg-zinc-100 text-zinc-400 cursor-not-allowed"
          : "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white active:scale-[0.98] shadow-[0_4px_0_0_#047857] hover:shadow-[0_2px_0_0_#047857] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#047857] active:translate-y-[4px]"
      }`}
    >
      <Play weight="fill" size={32} />
      <span className="text-3xl font-black uppercase tracking-widest font-mono">
        GO
      </span>
    </button>
  );
}
