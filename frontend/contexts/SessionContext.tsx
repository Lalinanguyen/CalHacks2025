"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

interface AudioState {
  audioBlob: Blob | null;
  audioUrl: string | null;
  isPlaying: boolean;
  isRecording: boolean;
}

interface AudioActions {
  setAudioBlob: (blob: Blob | null) => void;
  setAudioUrl: (url: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  clearAudio: () => void;
  getAudioRef: () => HTMLAudioElement | null;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
}

type SessionContextType = AudioState & AudioActions;

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getAudioRef = () => audioRef.current;
  const setAudioRef = (ref: HTMLAudioElement | null) => {
    audioRef.current = ref;
  };

  const value: SessionContextType = {
    // State
    audioBlob,
    audioUrl,
    isPlaying,
    isRecording,
    // Actions
    setAudioBlob,
    setAudioUrl,
    setIsPlaying,
    setIsRecording,
    clearAudio,
    getAudioRef,
    setAudioRef,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
