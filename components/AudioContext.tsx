import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { surahTableData, SurahEntry } from '../data';

interface AudioContextType {
  currentSurah: SurahEntry | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  playSurah: (surah: SurahEntry) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setSpeed: (rate: number) => void;
  setVolumeState: (vol: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrev: () => void;
  isActive: (surahId: number) => boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSurah, setCurrentSurah] = useState<SurahEntry | null>(() => {
    // Default to Al-Kahf so the player has something loaded on startup!
    const alKahf = surahTableData.find(s => s.chapter === 18);
    return alKahf || null;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element once on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial source if available
    if (currentSurah) {
      audio.src = currentSurah.audioUrl;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      playNextTrack();
    };

    const handleCanPlay = () => {
      audio.playbackRate = playbackRate;
    };

    const handlePauseRecitation = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    window.addEventListener('pause-recitation', handlePauseRecitation);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      window.removeEventListener('pause-recitation', handlePauseRecitation);
      audioRef.current = null;
    };
  }, []);

  // Monitor changes to currentSurah and load the source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSurah) return;

    const isSameSrc = audio.src === currentSurah.audioUrl;
    if (!isSameSrc) {
      const wasPlaying = isPlaying;
      audio.src = currentSurah.audioUrl;
      audio.load();
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : volume;
      
      if (wasPlaying) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.warn("Autoplay was blocked or failed:", err);
            setIsPlaying(false);
          });
      } else {
        setCurrentTime(0);
      }
    }
  }, [currentSurah]);

  // Handle setting isPlaying state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn("Playback play() failed:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSurah = (surah: SurahEntry) => {
    if (currentSurah?.id === surah.id) {
      setIsPlaying(true);
    } else {
      setCurrentSurah(surah);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setSpeed = (rate: number) => {
    setPlaybackRate(rate);
  };

  const setVolumeState = (vol: number) => {
    setVolume(vol);
    if (vol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playNextTrack = () => {
    if (!currentSurah) return;
    const currentIndex = surahTableData.findIndex(s => s.id === currentSurah.id);
    if (currentIndex !== -1 && currentIndex < surahTableData.length - 1) {
      setCurrentSurah(surahTableData[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      // Loop back to the first surah
      setCurrentSurah(surahTableData[0]);
      setIsPlaying(true);
    }
  };

  const playPrevTrack = () => {
    if (!currentSurah) return;
    const currentIndex = surahTableData.findIndex(s => s.id === currentSurah.id);
    if (currentIndex !== -1 && currentIndex > 0) {
      setCurrentSurah(surahTableData[currentIndex - 1]);
      setIsPlaying(true);
    } else {
      // Loop back to the last surah
      setCurrentSurah(surahTableData[surahTableData.length - 1]);
      setIsPlaying(true);
    }
  };

  const isActive = (surahId: number) => {
    return currentSurah?.id === surahId;
  };

  return (
    <AudioContext.Provider value={{
      currentSurah,
      isPlaying,
      currentTime,
      duration,
      playbackRate,
      volume,
      isMuted,
      playSurah,
      togglePlay,
      pause,
      seek,
      setSpeed,
      setVolumeState,
      toggleMute,
      playNext: playNextTrack,
      playPrev: playPrevTrack,
      isActive
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
