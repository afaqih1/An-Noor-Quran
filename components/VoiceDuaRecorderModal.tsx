import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Square, Play, Pause, RotateCcw, Check, X, 
  Volume2, VolumeX, Sparkles, Tag, Heart, Globe, Clock, 
  Download, AlertCircle, FileText, ChevronDown, CheckCircle2,
  Bookmark, Sliders, Waves, Layers
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { SavedDua } from './MyDuasSection';

export interface VoiceDuaRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDua?: (newDua: SavedDua) => void;
  initialLanguage?: 'ar-SA' | 'ar-EG' | 'en-US' | 'en-GB';
}

const SUPPORTED_LANGUAGES = [
  { code: 'ar-SA', label: 'العربية (السعودية - فصحى)', flag: '🇸🇦', dir: 'rtl', short: 'العربية' },
  { code: 'ar-EG', label: 'العربية (مصر)', flag: '🇪🇬', dir: 'rtl', short: 'عربي' },
  { code: 'en-US', label: 'English (United States)', flag: '🇺🇸', dir: 'ltr', short: 'English' },
  { code: 'en-GB', label: 'English (United Kingdom)', flag: '🇬🇧', dir: 'ltr', short: 'English (UK)' },
];

const PRESET_TAGS = [
  'Voice Note',
  'Personal Supplication',
  'Tahajjud',
  'Forgiveness',
  'Gratitude (Shukr)',
  'Healing & Health',
  'Family & Children',
  'Peace of Mind',
  'Protection',
  'Ramadan'
];

export const VoiceDuaRecorderModal: React.FC<VoiceDuaRecorderModalProps> = ({
  isOpen,
  onClose,
  onSaveDua,
  initialLanguage = 'ar-SA'
}) => {
  const { language: uiLang } = useLanguage();

  // Speech Recognition Language
  const [selectedLang, setSelectedLang] = useState<'ar-SA' | 'ar-EG' | 'en-US' | 'en-GB'>(initialLanguage);
  
  // Recording & Speech State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  // Live Transcripts
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  
  // Recorded Audio State
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [recordedDurationTotal, setRecordedDurationTotal] = useState<number>(0);
  
  // Post-recording Review Form State
  const [step, setStep] = useState<'record' | 'review'>('record');
  const [duaTitle, setDuaTitle] = useState<string>('');
  const [arabicText, setArabicText] = useState<string>('');
  const [translationText, setTranslationText] = useState<string>('');
  const [transliterationText, setTransliterationText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Voice Note', 'Personal Supplication']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackCurrentTime, setPlaybackCurrentTime] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(0);

  // Audio Context & MediaRecorder Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup on modal close or unmount
  useEffect(() => {
    if (!isOpen) {
      stopAllMedia();
      resetAll();
    }
  }, [isOpen]);

  const resetAll = () => {
    setStep('record');
    setIsRecording(false);
    setRecordingDuration(0);
    setInterimTranscript('');
    setFinalTranscript('');
    setAudioBlobUrl(null);
    setAudioBase64(null);
    setRecordedDurationTotal(0);
    setDuaTitle('');
    setArabicText('');
    setTranslationText('');
    setTransliterationText('');
    setSelectedTags(['Voice Note', 'Personal Supplication']);
    setSpeechError(null);
    setIsPlaying(false);
    setSaveSuccess(false);
  };

  const stopAllMedia = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
      mediaRecorderRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.src = '';
    }
  };

  // Start Visualizer
  const startVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.8;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

          // Gradient color: Emerald to Amber Gold
          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#047857');
          grad.addColorStop(0.6, '#10b981');
          grad.addColorStop(1, '#f59e0b');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - Math.max(barHeight, 4), barWidth - 2, Math.max(barHeight, 4), 3);
          ctx.fill();

          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualizer error:', e);
    }
  };

  // Start Recording and Speech Recognition
  const handleStartRecording = async () => {
    setSpeechError(null);
    setInterimTranscript('');
    setFinalTranscript('');
    audioChunksRef.current = [];

    try {
      // 1. Get Microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      audioStreamRef.current = stream;

      // 2. Setup MediaRecorder
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const fullBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const url = URL.createObjectURL(fullBlob);
        setAudioBlobUrl(url);

        // Convert to Base64 for permanent local storage
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(fullBlob);
      };

      recorder.start(250); // Slice every 250ms

      // 3. Setup Web Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = selectedLang;

          recognition.onresult = (event: any) => {
            let interim = '';
            let finalAccumulator = '';

            for (let i = 0; i < event.results.length; i++) {
              const res = event.results[i];
              if (res.isFinal) {
                finalAccumulator += res[0].transcript + ' ';
              } else {
                interim += res[0].transcript;
              }
            }

            if (finalAccumulator) {
              setFinalTranscript(finalAccumulator.trim());
            }
            setInterimTranscript(interim);
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech recognition warning/error:', event.error);
            if (event.error === 'not-allowed') {
              setSpeechError('Microphone permission blocked. Please allow microphone access in browser settings.');
            } else if (event.error === 'no-speech') {
              // benign, user was quiet
            } else {
              setSpeechError(`Speech recognition notice: ${event.error}. You can still save your voice recording!`);
            }
          };

          recognition.onend = () => {
            // If still recording and user paused speaking, restart recognition
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              try {
                recognition.start();
              } catch (e) {
                // Ignore restart error
              }
            }
          };

          recognition.start();
        } catch (err: any) {
          console.warn('Could not start speech recognition:', err);
          setSpeechError('Live transcription is not available on this browser, but audio recording works fully.');
        }
      }

      // 4. Start visualizer & timer
      startVisualizer(stream);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 300) { // 5-minute cap
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Microphone error:', err);
      setSpeechError(
        err.name === 'NotAllowedError' 
          ? 'Microphone permission was denied. Please grant permission in your browser.' 
          : 'Could not access device microphone. Please check your audio settings.'
      );
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedDurationTotal(recordingDuration);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    // Prepare review form defaults
    const combinedTranscript = (finalTranscript + ' ' + interimTranscript).trim();
    const isArabic = selectedLang.startsWith('ar');

    const defaultTitle = isArabic
      ? `دعاء شخصي مسجل (${new Date().toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })})`
      : `Personal Voice Dua (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;

    setDuaTitle(defaultTitle);

    if (isArabic) {
      setArabicText(combinedTranscript || 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي');
      setTranslationText(combinedTranscript ? `[Personal Supplication recorded in Arabic]: ${combinedTranscript}` : 'O Allah, forgive me and have mercy on me.');
    } else {
      setTranslationText(combinedTranscript || 'O Allah, I ask You for Your mercy, guidance, and peace.');
      setArabicText('اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ مِنْهُ نَبِيُّكَ مُحَمَّدٌ ﷺ');
    }

    setStep('review');
  };

  // Audio preview playback handlers
  const handleTogglePreviewPlay = () => {
    if (!previewAudioRef.current) return;
    if (isPlaying) {
      previewAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      previewAudioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (previewAudioRef.current) {
      setPlaybackCurrentTime(previewAudioRef.current.currentTime);
      setPlaybackDuration(previewAudioRef.current.duration || recordedDurationTotal);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (previewAudioRef.current) {
      previewAudioRef.current.currentTime = val;
      setPlaybackCurrentTime(val);
    }
  };

  // Tag Helpers
  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const clean = customTagInput.trim();
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
      setCustomTagInput('');
    }
  };

  // Save to My Duas
  const handleSaveToMyDuas = () => {
    const newDua: SavedDua = {
      id: `voice_dua_${Date.now()}`,
      category: 'custom',
      title: duaTitle.trim() || 'My Personal Voice Supplication',
      arabicText: arabicText.trim(),
      transliterationText: transliterationText.trim() || undefined,
      translationText: translationText.trim(),
      reference: 'Personal Voice Supplication (Recorded)',
      tags: selectedTags.length > 0 ? selectedTags : ['Voice Note', 'Personal Supplication'],
      timestamp: Date.now(),
      voiceRecordingUrl: audioBase64 || audioBlobUrl || undefined,
      isVoiceNote: true,
      audioDuration: recordedDurationTotal || playbackDuration || 0
    };

    if (onSaveDua) {
      onSaveDua(newDua);
    } else {
      // Fallback: direct localStorage persistence & event dispatch
      try {
        const stored = localStorage.getItem('my-favorite-duas');
        const list: SavedDua[] = stored ? JSON.parse(stored) : [];
        list.unshift(newDua);
        localStorage.setItem('my-favorite-duas', JSON.stringify(list));
        window.dispatchEvent(new Event('my-duas-updated'));
      } catch (e) {
        console.error('Error saving voice dua:', e);
      }
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-150 dark:border-slate-800 bg-gradient-to-r from-primary-900 via-primary-800 to-emerald-900 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-white/15 shadow-inner">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  {uiLang === 'ar' ? 'استوديو الدعاء الصوتي الشخصي' : 'Voice Supplication Studio'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  Voice-to-Text
                </span>
              </div>
              <p className="text-xs text-primary-200">
                {uiLang === 'ar' 
                  ? 'تحدث بدعائك بصوتك، وسيقوم النظام بتسجيله وتحويله لنص وحفظه بمكتبتك.'
                  : 'Speak your heartfelt supplications to record audio and transcribe them live.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAllMedia();
              onClose();
            }}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative z-10"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">
                  {uiLang === 'ar' ? 'تم حفظ دعائك الصوتي بنجاح!' : 'Supplication Successfully Saved!'}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {uiLang === 'ar' ? 'أصبح الآن محفوظاً في قسم أدعيتي مع ملفك الصوتي.' : 'Now stored in your personal vault with full audio and transcription.'}
                </p>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {speechError && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {step === 'record' ? (
            /* ============================================================ */
            /* RECORDING VIEW                                               */
            /* ============================================================ */
            <div className="space-y-6">
              {/* Language Selector Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {uiLang === 'ar' ? 'لغة التحويل الصوتي:' : 'Speech Recognition Language:'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isSelected = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        disabled={isRecording}
                        onClick={() => setSelectedLang(lang.code as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected 
                            ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Visualizer & Mic Hero */}
              <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Background pulse rings when recording */}
                {isRecording && (
                  <>
                    <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping pointer-events-none" />
                    <div className="absolute w-64 h-64 rounded-full bg-emerald-500/5 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Audio Canvas Visualizer */}
                <div className="w-full max-w-sm h-20 mb-4 flex items-center justify-center">
                  <canvas 
                    ref={canvasRef} 
                    width={320} 
                    height={70} 
                    className={`w-full h-full ${isRecording ? 'opacity-100' : 'opacity-20'}`} 
                  />
                </div>

                {/* Central Record Button */}
                <div className="relative z-10 mb-4">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="group relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-700 via-primary-700 to-emerald-600 hover:from-emerald-600 hover:to-primary-600 text-white flex flex-col items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white dark:border-slate-800"
                    >
                      <Mic className="w-10 h-10 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
                        {uiLang === 'ar' ? 'ابدأ التسجيل' : 'Tap to Record'}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-rose-700 text-white flex flex-col items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white dark:border-slate-800 animate-pulse"
                    >
                      <Square className="w-8 h-8 fill-current" />
                      <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
                        {uiLang === 'ar' ? 'إيقاف وإنهاء' : 'Stop & Done'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Duration Counter */}
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className={isRecording ? 'text-rose-500 animate-spin-slow' : 'text-slate-400'} />
                  <span className="font-mono text-2xl font-black text-slate-800 dark:text-slate-100">
                    {formatTime(recordingDuration)}
                  </span>
                  {isRecording && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      LIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  {isRecording 
                    ? (uiLang === 'ar' 
                        ? 'تحدث الآن بدعائك ورجائك.. الكلمات تظهر مباشرة في الأسفل.'
                        : 'Speak clearly into your microphone. Your words will appear in the box below.')
                    : (uiLang === 'ar'
                        ? 'اضغط على زر الميكروفون للبدء، يمكنك التحدث بالعربية الفصحى أو الإنجليزية.'
                        : 'Click the microphone to start recording your personal prayer. Maximum 5 minutes.')}
                </p>
              </div>

              {/* Live Speech-to-Text Transcription Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText size={14} className="text-primary-600" />
                    {uiLang === 'ar' ? 'النص المحول تلقائياً (مباشر)' : 'Live Speech-to-Text Transcript'}
                  </span>
                  {(finalTranscript || interimTranscript) && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(finalTranscript + ' ' + interimTranscript).trim().split(/\s+/).filter(Boolean).length} {uiLang === 'ar' ? 'كلمة' : 'words'}
                    </span>
                  )}
                </div>

                <div 
                  className="w-full min-h-[110px] max-h-40 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 text-sm leading-relaxed"
                  dir={currentLangObj.dir}
                >
                  {finalTranscript || interimTranscript ? (
                    <div>
                      <span className={selectedLang.startsWith('ar') ? 'font-arabic text-lg' : ''}>
                        {finalTranscript}{' '}
                      </span>
                      {interimTranscript && (
                        <span className={`text-slate-400 italic ${selectedLang.startsWith('ar') ? 'font-arabic text-lg' : ''}`}>
                          {interimTranscript}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs italic py-6">
                      {isRecording 
                        ? (uiLang === 'ar' ? 'في انتظار صوتك الكريم...' : 'Listening... Speak your supplication now.')
                        : (uiLang === 'ar' ? 'سوف يظهر النص المكتوب هنا أثناء حديثك...' : 'Transcribed words will appear here in real time as you speak...')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* REVIEW & EDIT VIEW                                           */
            /* ============================================================ */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Audio Playback Player Bar */}
              {audioBlobUrl && (
                <div className="bg-gradient-to-r from-emerald-50 via-primary-50/50 to-amber-50/30 dark:from-slate-950 dark:via-primary-950/20 dark:to-slate-900 border border-emerald-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
                  <audio
                    ref={previewAudioRef}
                    src={audioBlobUrl}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onEnded={handleAudioEnded}
                    className="hidden"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTogglePreviewPlay}
                        className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md transition-all cursor-pointer flex-shrink-0"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <Waves size={14} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                            {uiLang === 'ar' ? 'معاينة التسجيل الصوتي' : 'Recorded Supplication Audio'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatTime(playbackCurrentTime)} / {formatTime(recordedDurationTotal || playbackDuration)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          stopAllMedia();
                          setStep('record');
                          setIsRecording(false);
                          setAudioBlobUrl(null);
                          setAudioBase64(null);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Discard and record again"
                      >
                        <RotateCcw size={13} />
                        <span>{uiLang === 'ar' ? 'إعادة التسجيل' : 'Record Again'}</span>
                      </button>

                      <a
                        href={audioBlobUrl}
                        download={`voice_dua_${Date.now()}.webm`}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Download audio recording"
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </div>

                  {/* Audio Seek bar */}
                  <div className="w-full">
                    <input
                      type="range"
                      min={0}
                      max={recordedDurationTotal || playbackDuration || 1}
                      step={0.1}
                      value={playbackCurrentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                    {uiLang === 'ar' ? 'عنوان الدعاء *' : 'Supplication Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={duaTitle}
                    onChange={e => setDuaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Arabic Supplication Script */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                      {uiLang === 'ar' ? 'النص العربي المنطوق / المأثور' : 'Arabic Supplication Text (Transcribed or Script)'}
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {uiLang === 'ar' ? 'قابل للتعديل' : 'Editable'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={arabicText}
                    onChange={e => setArabicText(e.target.value)}
                    placeholder="اللَّهُمَّ..."
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-arabic leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Translation / Meaning / Personal supplication */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                      {uiLang === 'ar' ? 'المعنى / الترجمة / الدعاء الشخصي *' : 'Translation / Personal Supplication Words *'}
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {uiLang === 'ar' ? 'مستخرج من الصوت' : 'From Voice Recording'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={translationText}
                    onChange={e => setTranslationText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 leading-relaxed"
                  />
                </div>

                {/* Transliteration (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                    {uiLang === 'ar' ? 'النطق اللاتيني (اختياري)' : 'Roman Transliteration (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={transliterationText}
                    onChange={e => setTransliterationText(e.target.value)}
                    placeholder="e.g. Allahumma inni as'aluka..."
                    className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs italic focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Preset Tag Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <Tag size={13} className="text-primary-600" />
                    <span>{uiLang === 'ar' ? 'الوسوم والتصنيفات' : 'Tags & Categories'}</span>
                  </label>

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAGS.map(t => {
                      const isSel = selectedTags.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleToggleTag(t)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                            isSel
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-transparent'
                          }`}
                        >
                          {t}
                          {isSel && ' ✓'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add custom tag */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder={uiLang === 'ar' ? 'أضف وسماً مخصصاً...' : 'Add a custom tag...'}
                      value={customTagInput}
                      onChange={e => setCustomTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                      className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {uiLang === 'ar' ? 'إضافة' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              stopAllMedia();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-transparent rounded-xl transition-all cursor-pointer"
          >
            {uiLang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          {step === 'record' ? (
            <button
              type="button"
              disabled={!isRecording}
              onClick={handleStopRecording}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isRecording 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Square size={13} className="fill-current" />
              <span>{uiLang === 'ar' ? 'إنهاء ومراجعة' : 'Done & Review'}</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('record')}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {uiLang === 'ar' ? 'السابق' : 'Back to Mic'}
              </button>

              <button
                type="button"
                onClick={handleSaveToMyDuas}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-primary-700 hover:from-emerald-600 hover:to-primary-600 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Check size={14} />
                <span>{uiLang === 'ar' ? 'حفظ في أدعيتي' : 'Save to My Duas'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceDuaRecorderModal;
