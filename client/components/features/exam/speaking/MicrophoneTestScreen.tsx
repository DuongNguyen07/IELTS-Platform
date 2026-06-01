'use client';

import { useState, useEffect, useRef } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type TestState = 'idle' | 'testing' | 'done' | 'denied';

interface Props {
  onComplete: () => void;
}

export default function MicrophoneTestScreen({ onComplete }: Props) {
  const [state, setState] = useState<TestState>('idle');
  const [countdown, setCountdown] = useState(20);
  const [levels, setLevels] = useState<number[]>(Array(16).fill(0.05));
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // 20s countdown while testing
  useEffect(() => {
    if (state !== 'testing') return;
    if (countdown <= 0) {
      setState('done');
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animFrameRef.current);
      setLevels(Array(16).fill(0.05));
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [state, countdown]);

  function startWaveform(stream: MediaStream) {
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const bars = Array.from({ length: 16 }, (_, i) => {
        const val = data[Math.floor((i / 16) * data.length)] / 255;
        return Math.max(0.05, val);
      });
      setLevels(bars);
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  }

  async function handleStartTest() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setCountdown(20);
      setState('testing');
      startWaveform(stream);
    } catch {
      setState('denied');
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-6 px-6">
      {/* Icon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
        state === 'denied' ? 'bg-red-100' : state === 'done' ? 'bg-success/10' : 'bg-primary/10'
      }`}>
        {state === 'denied'
          ? <MicOffIcon style={{ fontSize: 40 }} className="text-red-500" />
          : state === 'done'
          ? <CheckCircleIcon style={{ fontSize: 40 }} className="text-success" />
          : <MicIcon style={{ fontSize: 40 }} className="text-primary" />
        }
      </div>

      {/* Text */}
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          TEST YOUR MICROPHONE
        </h2>
        {state === 'denied' ? (
          <p className="text-red-500 text-sm leading-relaxed">
            Microphone access was denied. Please allow microphone access in your browser settings and try again.
          </p>
        ) : state === 'done' ? (
          <p className="text-success font-medium text-sm">Your microphone is working. You are ready to begin.</p>
        ) : state === 'testing' ? (
          <p className="text-slate-600 text-sm">You have <span className="font-bold text-primary">{countdown}s</span> remaining to speak.</p>
        ) : (
          <>
            <p className="text-slate-600 text-sm mb-2">You have 20 seconds to speak.</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              To complete this activity, you must allow access to your system&apos;s microphone.
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Click <strong>&quot;Test microphone&quot;</strong> below to Start.
            </p>
          </>
        )}
      </div>

      {/* Waveform (real audio analysis) */}
      <div className="flex items-end gap-1 h-12">
        {levels.map((level, i) => (
          <div
            key={i}
            className={`w-2.5 rounded-full transition-all duration-75 ${
              state === 'testing' ? 'bg-primary' : 'bg-slate-200'
            }`}
            style={{ height: `${Math.max(4, level * 48)}px` }}
          />
        ))}
      </div>

      {/* CTA */}
      {state === 'idle' && (
        <button
          onClick={handleStartTest}
          className="px-8 h-12 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/20"
        >
          Test microphone
        </button>
      )}

      {state === 'testing' && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Recording…
        </div>
      )}

      {state === 'done' && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onComplete}
            className="px-10 h-12 bg-success text-white font-bold rounded-full hover:bg-success/90 transition-colors text-sm shadow-lg shadow-success/30"
          >
            ✓ Start Test
          </button>
          <button
            onClick={() => { setState('idle'); setCountdown(20); setLevels(Array(16).fill(0.05)); }}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Re-test microphone
          </button>
        </div>
      )}

      {state === 'denied' && (
        <button
          onClick={() => setState('idle')}
          className="px-8 h-12 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}
