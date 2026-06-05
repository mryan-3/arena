"use client";

interface FixtureDisplayProps {
  name: string;
  color: string;
  brightness: number;
  onReset: () => void;
}

export function FixtureDisplay({ name, color, brightness, onReset }: FixtureDisplayProps) {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center transition-colors duration-200 relative"
      style={{
        backgroundColor: color,
        opacity: brightness / 100,
      }}
    >
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-xs uppercase tracking-widest font-mono flex items-center gap-3">
        <span>Fixture: {name} | Online</span>
        <button
          onClick={onReset}
          className="border-l border-zinc-500 pl-3 hover:text-red-400 transition-colors uppercase text-[10px] font-bold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
