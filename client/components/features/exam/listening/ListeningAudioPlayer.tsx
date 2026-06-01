'use client';

import { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BoltIcon from '@mui/icons-material/Bolt';

interface Props {
  audioUrl?: string;
  sectionNumber: number;
  testMode: 'timed' | 'practice';
  onEnded?: () => void;
}

function fmt(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function ListeningAudioPlayer({ audioUrl, sectionNumber, testMode, onEnded }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [speed, setSpeed] = useState(1);

  const canSeek = testMode === 'practice' || !hasPlayed;
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a || !audioUrl) return;
    if (isPlaying) {
      a.pause();
    } else {
      if (!hasPlayed) setHasPlayed(true);
      a.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !canSeek) return;
    const t = Number(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const skip = (delta: number) => {
    if (!audioRef.current || !canSeek) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + delta));
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] z-20 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200 px-5 py-3 flex flex-col gap-2">
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => { setIsPlaying(false); onEnded?.(); }}
          />
        )}

        {/* Row 1: time · progress · volume */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium text-slate-500 tabular-nums shrink-0">
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          {/* Progress track */}
          <div className="relative flex-1 h-1.5 bg-slate-100 rounded-full cursor-pointer group">
            <div
              className="absolute top-0 left-0 h-full bg-orange-500 rounded-full pointer-events-none"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-orange-600 rounded-full border-2 border-white shadow-sm pointer-events-none"
              style={{ left: `${pct}%` }}
            />
            <input
              type="range" min={0} max={duration || 0} step={0.1} value={currentTime}
              onChange={handleSeek}
              disabled={!canSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
            />
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5 shrink-0">
            <VolumeUpIcon style={{ fontSize: '0.875rem' }} className="text-slate-400" />
            <div className="relative w-16 h-1 bg-orange-100 rounded-full">
              <div className="absolute top-0 left-0 h-full bg-orange-400 rounded-full" style={{ width: `${volume * 100}%` }} />
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={handleVolume}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Row 2: label · controls · speed */}
        <div className="flex items-center justify-between">
          <p className="flex-1 text-[10px] italic text-slate-400 truncate">
            {audioUrl ? `Playing section ${sectionNumber}…` : 'No audio available'}
            {testMode === 'timed' && hasPlayed && !isPlaying && (
              <span className="ml-2 not-italic text-amber-500 font-medium">Played once</span>
            )}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => skip(-10)}
              disabled={!canSeek}
              className="text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30"
              title="Back 10s"
            >
              <SkipPreviousIcon className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!audioUrl}
              className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white shadow hover:bg-orange-600 transition-all disabled:opacity-40"
            >
              {isPlaying
                ? <PauseIcon style={{ fontSize: '1.2rem' }} />
                : <PlayArrowIcon style={{ fontSize: '1.2rem', marginLeft: '1px' }} />
              }
            </button>
            <button
              onClick={() => skip(10)}
              disabled={!canSeek}
              className="text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30"
              title="Forward 10s"
            >
              <SkipNextIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={cycleSpeed}
              className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <BoltIcon style={{ fontSize: '0.75rem' }} />
              Speed: {speed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
