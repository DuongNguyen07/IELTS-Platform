'use client';

import { useState, useEffect, useRef } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import CountdownTimer from './CountdownTimer';

type Phase = 'waiting' | 'prep' | 'recording';

interface Props {
  phase: Phase;
  timeLimitSecs: number;
  prepTimeSecs?: number;
  onStartRecording: () => void;
  onSubmit: (blob: Blob | null) => void;
  onPrepDone: () => void;
}

export default function SpeakingRecordButton({
  phase, timeLimitSecs, prepTimeSecs = 60,
  onStartRecording, onSubmit, onPrepDone,
}: Props) {
  const [timeLeft, setTimeLeft]     = useState(timeLimitSecs);
  const [prepLeft, setPrepLeft]     = useState(prepTimeSecs);
  const [canSubmit, setCanSubmit]   = useState(false);
  const [waveLevels, setWaveLevels] = useState<number[]>(Array(20).fill(0.2));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const blobRef          = useRef<Blob | null>(null);

  // Prep countdown (Part 2)
  useEffect(() => {
    if (phase !== 'prep') return;
    setPrepLeft(prepTimeSecs);
    const id = setInterval(() => {
      setPrepLeft((t) => { if (t <= 1) { clearInterval(id); onPrepDone(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Recording countdown + MediaRecorder + waveform
  useEffect(() => {
    if (phase !== 'recording') return;
    setTimeLeft(timeLimitSecs);
    setCanSubmit(false);
    chunksRef.current = [];
    blobRef.current = null;

    // Start recording
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        blobRef.current = new Blob(chunksRef.current, { type: 'audio/webm' });
      };
      mr.start();
    }).catch(() => {});

    // Animated waveform (random levels)
    const waveId = setInterval(() => {
      setWaveLevels(Array(20).fill(0).map(() => 0.15 + Math.random() * 0.85));
    }, 100);

    // Unlock submit after 10s
    const unlockId = setTimeout(() => setCanSubmit(true), 10_000);

    // Countdown tick
    const tickId = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickId);
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(waveId);
      clearTimeout(unlockId);
      clearInterval(tickId);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Auto-submit when countdown hits 0
  useEffect(() => {
    if (phase === 'recording' && timeLeft <= 0) {
      onSubmit(blobRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function handleSubmit() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    onSubmit(blobRef.current);
  }

  // ── Prep phase ─────────────────────────────────────────────────────────────
  if (phase === 'prep') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2 bg-amber-50 border-2 border-amber-300 rounded-2xl px-8 py-5">
          <p className="text-sm font-semibold text-amber-700">Preparation time</p>
          <CountdownTimer seconds={prepLeft} urgent={prepLeft <= 10} />
          <p className="text-xs text-amber-600 text-center">Recording starts automatically when preparation time ends.</p>
        </div>
      </div>
    );
  }

  // ── Waiting phase ──────────────────────────────────────────────────────────
  if (phase === 'waiting') {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center">
        <button
          onClick={onStartRecording}
          className="flex items-center gap-3 px-10 h-14 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors text-base shadow-lg shadow-primary/20"
        >
          <MicIcon />
          Begin answering
        </button>
      </div>
    );
  }

  // ── Recording phase ────────────────────────────────────────────────────────
  const isUrgent = timeLeft <= 10;
  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className={`flex items-center gap-4 rounded-2xl px-6 py-4 border-2 transition-colors ${
        isUrgent ? 'border-red-400 bg-red-50' : 'border-red-300 bg-red-50/60'
      }`}>
        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex-shrink-0" />

        {/* Animated waveform bars */}
        <div className="flex items-end gap-0.5 h-8 flex-1">
          {waveLevels.map((level, i) => (
            <div
              key={i}
              className="flex-1 bg-red-400 rounded-full transition-all duration-100"
              style={{ height: `${Math.max(4, level * 32)}px` }}
            />
          ))}
        </div>

        <CountdownTimer seconds={timeLeft} urgent={isUrgent} />
      </div>

      {/* Submit button — fades in after 10s */}
      <div className={`flex justify-center transition-all duration-500 ${
        canSubmit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-10 h-11 bg-success text-white font-bold rounded-full hover:bg-success/90 transition-colors text-sm shadow-lg shadow-success/30"
        >
          Submit answer →
        </button>
      </div>
    </div>
  );
}
