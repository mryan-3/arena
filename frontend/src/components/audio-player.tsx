"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "../context/socket-provider";

interface AudioPlayerProps {
  src: string | null;
}

interface PlaybackState {
  isPlaying: boolean;
  currentTimeMs: number;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const { socket, isConnected } = useSocket();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playbackRef = useRef<PlaybackState>({ isPlaying: false, currentTimeMs: 0 });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUpdate = (data: { playback: PlaybackState }) => {
      playbackRef.current = data.playback;
      const audio = audioRef.current;
      
      if (!audio || !src) return;

      if (data.playback.isPlaying && audio.paused) {
        audio.play().catch(console.error);
      } else if (!data.playback.isPlaying && !audio.paused) {
        audio.pause();
      }

      // Drift correction
      if (data.playback.isPlaying) {
        const audioTimeMs = audio.currentTime * 1000;
        const drift = Math.abs(audioTimeMs - data.playback.currentTimeMs);
        if (drift > 200) { // If drifted more than 200ms
          audio.currentTime = data.playback.currentTimeMs / 1000;
        }
      } else if (data.playback.currentTimeMs === 0) {
        audio.currentTime = 0; // Reset
      }
    };

    socket.on("operator:timeline-update", handleUpdate);
    return () => {
      socket.off("operator:timeline-update", handleUpdate);
    };
  }, [socket, isConnected, src]);

  return <audio ref={audioRef} src={src || undefined} preload="auto" />;
}
