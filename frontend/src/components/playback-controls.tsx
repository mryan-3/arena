"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/socket-provider";
import { Play, Pause, Stop, UploadSimple } from "@phosphor-icons/react";
import { AudioPlayer } from "./audio-player";

interface PlaybackState {
  isPlaying: boolean;
  currentTimeMs: number;
}

export function PlaybackControls() {
  const { socket, isConnected } = useSocket();
  const [playback, setPlayback] = useState<PlaybackState>({ isPlaying: false, currentTimeMs: 0 });
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.on("operator:timeline-update", (data: { playback: PlaybackState }) => {
      setPlayback(data.playback);
    });
    return () => {
      socket.off("operator:timeline-update");
    };
  }, [socket, isConnected]);

  const formatClock = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    const dec = Math.floor((ms % 1000) / 100).toString(); // tenths of a second
    return `${m}:${s}.${dec}`;
  };

  const handlePlay = () => {
    if (socket) socket.emit("operator:play-show");
  };

  const handlePause = () => {
    if (socket) socket.emit("operator:pause-show");
  };

  const handleStop = () => {
    if (socket) socket.emit("operator:stop-show");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setAudioName(file.name);
    }
  };

  return (
    <div className="flex flex-col gap-6 border border-zinc-200 bg-zinc-900 text-white p-8">
      <AudioPlayer src={audioSrc} />
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <input 
            type="file" 
            accept="audio/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold border border-zinc-600 px-4 py-2 hover:bg-zinc-800 transition-colors"
          >
            <UploadSimple size={16} /> Load Audio Track
          </button>
          {audioName && (
            <span className="text-[10px] text-zinc-400 font-mono">
              Loaded: {audioName}
            </span>
          )}
        </div>
        
        <div className="text-6xl font-black font-mono tracking-widest text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
          {formatClock(playback.currentTimeMs)}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {!playback.isPlaying ? (
          <button
            onClick={handlePlay}
            className="flex-1 py-4 border border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
          >
            <Play weight="fill" size={20} /> Play
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 py-4 border border-amber-500 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
          >
            <Pause weight="fill" size={20} /> Pause
          </button>
        )}
        <button
          onClick={handleStop}
          className="flex-1 py-4 border border-red-500 bg-zinc-800 hover:bg-red-600 text-white font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2"
        >
          <Stop weight="fill" size={20} /> Stop
        </button>
      </div>
    </div>
  );
}
