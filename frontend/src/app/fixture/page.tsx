"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../context/socket-provider";
import { FixtureJoin } from "../../components/fixture-join";
import { FixtureDisplay } from "../../components/fixture-display";

export default function FixturePage() {
  const { socket, isConnected } = useSocket();
  const [state, setState] = useState({ color: "#ffffff", brightness: 100 });
  const [isRegistered, setIsRegistered] = useState(false);
  const [fixtureId, setFixtureId] = useState<string | null>(null);
  const [fixtureName, setFixtureName] = useState("");
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("arena_fixture_id");
    const storedName = localStorage.getItem("arena_fixture_name");
    if (storedId && storedName) {
      setFixtureId(storedId);
      setFixtureName(storedName);
    }
    setIsCheckingStorage(false);
  }, []);

  useEffect(() => {
    if (!socket || !isConnected || !fixtureName) return;

    if (!isRegistered) {
      socket.emit("fixture:register", {
        id: fixtureId || undefined,
        name: fixtureName,
        deviceInfo: {
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
        },
      });
    }

    socket.on("fixture:registered", (data: { id: string }) => {
      setIsRegistered(true);
      setFixtureId(data.id);
      localStorage.setItem("arena_fixture_id", data.id);
    });

    socket.on("fixture:cue", (newState) => setState(newState));

    return () => {
      socket.off("fixture:registered");
      socket.off("fixture:cue");
    };
  }, [socket, isConnected, isRegistered, fixtureName, fixtureId]);

  const handleJoin = (name: string) => {
    setFixtureName(name);
    localStorage.setItem("arena_fixture_name", name);
  };

  const handleReset = () => {
    localStorage.removeItem("arena_fixture_id");
    localStorage.removeItem("arena_fixture_name");
    setFixtureId(null);
    setFixtureName("");
    setIsRegistered(false);
  };

  if (!isConnected || isCheckingStorage) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white font-mono uppercase tracking-widest">
        Connecting...
      </div>
    );
  }

  if (!fixtureName) {
    return <FixtureJoin onJoin={handleJoin} />;
  }

  return (
    <FixtureDisplay
      name={fixtureName}
      color={state.color}
      brightness={state.brightness}
      onReset={handleReset}
    />
  );
}
