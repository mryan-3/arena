"use client";

import { useSocket } from "../context/socket-provider";

export function ColorControls() {
  const { socket, isConnected } = useSocket();

  const handleColorChange = (color: string) => {
    if (socket && isConnected) {
      socket.emit("operator:trigger-color", { color, brightness: 100 });
    }
  };

  const colors = [
    { name: "White", hex: "#ffffff" },
    { name: "Red", hex: "#ff0000" },
    { name: "Blue", hex: "#0000ff" },
    { name: "Green", hex: "#00ff00" },
    { name: "Amber", hex: "#ffbf00" },
    { name: "Blackout", hex: "#000000" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">Manual Control</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {colors.map((c) => (
          <button
            key={c.hex}
            onClick={() => handleColorChange(c.hex)}
            className="flex flex-col border border-zinc-200 bg-white hover:bg-zinc-100 transition-colors p-4 items-center justify-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-full border border-zinc-300"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-950">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
