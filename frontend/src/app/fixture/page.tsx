"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../context/socket-provider";

export default function FixturePage() {
  const { socket, isConnected } = useSocket();
  const [state, setState] = useState({ color: "#ffffff", brightness: 100 });
  const [isRegistered, setIsRegistered] = useState(false);
  const [fixtureName, setFixtureName] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!socket || !isConnected || !fixtureName) return;

    if (!isRegistered) {
      socket.emit("fixture:register", {
        name: fixtureName,
        deviceInfo: {
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
        },
      });
    }

    socket.on("fixture:registered", () => setIsRegistered(true));
    socket.on("fixture:cue", (newState) => setState(newState));

    return () => {
      socket.off("fixture:registered");
      socket.off("fixture:cue");
    };
  }, [socket, isConnected, isRegistered, fixtureName]);

  const handleJoin = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setFixtureName(trimmed);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white font-mono uppercase tracking-widest">
        Connecting...
      </div>
    );
  }

  if (!fixtureName) {
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

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center transition-colors duration-200"
      style={{
        backgroundColor: state.color,
        opacity: state.brightness / 100,
      }}
    >
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-xs uppercase tracking-widest font-mono">
        Fixture: {fixtureName} | Status: Online
      </div>
    </div>
  );
}
