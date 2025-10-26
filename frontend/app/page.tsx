"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../contexts/SessionContext";

export default function Home() {
  const router = useRouter();
  const {
    audioBlob,
    audioUrl,
    isPlaying,
    isRecording,
    setAudioBlob,
    setAudioUrl,
    setIsPlaying,
    setIsRecording,
    clearAudio,
    getAudioRef,
    setAudioRef,
  } = useSession();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // Clear any existing recording when starting new one
      if (audioBlob) {
        clearAudio();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    const audioRef = getAudioRef();
    if (audioUrl && audioRef) {
      audioRef.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    const audioRef = getAudioRef();
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup audio URL when component unmounts
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      // Stop any active recording
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white">
      {/* Fixed Center Content - Microphone and Status */}
      <main className="flex flex-col items-center space-y-6">
        {/* Microphone Icon Button */}
        <div className="relative">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {/* Microphone Icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className={`${isRecording ? 'text-white' : 'text-gray-600'}`}
            >
              <path
                d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
                fill="currentColor"
              />
              <path
                d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z"
                fill="currentColor"
              />
              <path
                d="M11 22H13V24H11V22Z"
                fill="currentColor"
              />
            </svg>
          </button>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {isRecording ? 'Recording...' : audioBlob ? 'Recording Complete' : 'Click to Record'}
          </h2>
          <p className="text-gray-600">
            {isRecording 
              ? 'Click the microphone to stop recording' 
              : audioBlob 
                ? 'Your audio is ready to play'
                : 'Click the microphone to start recording'
            }
          </p>
        </div>
      </main>

      {/* Playback Controls - Absolutely positioned so they don't affect center alignment */}
      {audioBlob && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={isPlaying ? stopAudio : playAudio}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
          
          <button
            onClick={() => router.push('/chat')}
            className="px-6 py-2 rounded-full font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={setAudioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
