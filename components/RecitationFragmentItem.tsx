import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Download, Trash2, 
  Mic, Clock, Check, Sparkles, Music 
} from 'lucide-react';
import { RecitationFragment } from './RecitationRecorderModal';

interface RecitationFragmentItemProps {
  fragment: RecitationFragment;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export const RecitationFragmentItem: React.FC<RecitationFragmentItemProps> = ({
  fragment,
  onDelete,
  canDelete = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(fragment.duration || 0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(fragment.audioData);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [fragment.audioData]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.playbackRate = playbackRate;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Recitation playback failed', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = fragment.audioData;
      const sanitizedTitle = (fragment.title || 'Recitation').replace(/[^a-zA-Z0-9_-]/g, '_');
      const ext = fragment.mimeType.includes('mp4') ? 'm4a' : 'webm';
      link.download = `${sanitizedTitle}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (e) {
      console.error('Failed to download audio file', e);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-emerald-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 transition-all hover:border-emerald-300 dark:hover:border-emerald-800">
      
      {/* Top Header: Title, Ayah Badge, and Actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-300/40">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {fragment.title}
            </h5>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              <span>{fragment.createdAt}</span>
              {fragment.ayahReference && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-900/50 px-1.5 py-0.2 rounded">
                    {fragment.ayahReference}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action icons: Download, Speed multiplier, Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Playback speed toggle */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {[0.75, 1.0, 1.25].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer
                  ${playbackRate === speed 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                title={`Playback Speed ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer
              ${isDownloaded 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white border-slate-200 dark:border-slate-700'}`}
            title="Download Recording"
          >
            {isDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
          </button>

          {/* Delete button */}
          {canDelete && onDelete && (
            isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-rose-200">
                <button
                  onClick={() => onDelete(fragment.id)}
                  className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer hover:bg-rose-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                className="p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer"
                title="Remove recitation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Playback Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer active:scale-95
            ${isPlaying 
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-800 animate-pulse' 
              : 'bg-emerald-700 hover:bg-emerald-600 text-white'}`}
          title={isPlaying ? "Pause" : "Play Recitation"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
        </button>

        <div className="flex-1 space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecitationFragmentItem;
