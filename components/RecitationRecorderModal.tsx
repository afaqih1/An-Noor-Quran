import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, Pause, RotateCcw, Check, X, 
  Volume2, VolumeX, AlertCircle, Sparkles, Music, Trash2, Clock
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export interface RecitationFragment {
  id: string;
  title: string;
  ayahReference?: string;
  audioData: string; // Base64 data URL
  duration: number; // in seconds
  createdAt: string;
  mimeType: string;
}

interface RecitationRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahNameEnglish: string;
  surahNameArabic: string;
  defaultAyahRange?: string;
  onSaveRecitation: (fragment: RecitationFragment) => void;
}

const recorderTranslations = {
  en: {
    title: 'Record Your Recitation',
    subtitle: 'Record and save your personal Quranic recitation fragment for this reflection.',
    readyToRecord: 'Click the button below to start recording your recitation with Tajweed practice.',
    recordingActive: 'Recording your voice...',
    stopBtn: 'Stop Recording',
    startBtn: 'Start Recording',
    previewTitle: 'Recitation Preview',
    saveBtn: 'Attach Recitation',
    discardBtn: 'Discard',
    rerecordBtn: 'Record Again',
    fragmentTitle: 'Recitation Title / Label',
    fragmentTitlePlaceholder: 'e.g. Ayah 1-5 Tajweed practice',
    verseRef: 'Verse Reference (Optional)',
    verseRefPlaceholder: 'e.g. Ayah 1-5',
    micError: 'Could not access microphone. Please check your browser permissions.',
    recordingLimitNotice: 'Maximum 5 minutes per recording.',
    durationLabel: 'Duration:',
    listeningToYourself: 'Listen to your recitation to verify Tajweed and pronunciation before saving.'
  },
  ar: {
    title: 'تسجيل تلاوتك القرآنية',
    subtitle: 'سجّل واحفظ تلاوتك الشخصية بصوتك وراجع تجويدك ملحقاً بهذا التدبر.',
    readyToRecord: 'انقر على الزر أدناه لبدء تسجيل تلاوتك وممارسة أحكام التجويد.',
    recordingActive: 'جاري تسجيل صوتك الآن...',
    stopBtn: 'إيقاف التسجيل',
    startBtn: 'بدء التسجيل',
    previewTitle: 'معاينة التلاوة المسجلة',
    saveBtn: 'إرفاق التلاوة بالتدبر',
    discardBtn: 'تجاهل',
    rerecordBtn: 'إعادة التسجيل',
    fragmentTitle: 'عنوان أو وصف التلاوة',
    fragmentTitlePlaceholder: 'مثال: تلاوة وتدبر الآيات ١-٥',
    verseRef: 'الآيات المعنية (اختياري)',
    verseRefPlaceholder: 'مثال: الآيات ١-٥',
    micError: 'تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن في المتصفح.',
    recordingLimitNotice: 'الحد الأقصى للتسجيل هو ٥ دقائق.',
    durationLabel: 'المدة:',
    listeningToYourself: 'استمع لتلاوتك للتأكد من صحة التجويد ومخارج الحروف قبل الحفظ.'
  },
  am: {
    title: 'የእርስዎን የቁርአን ንባብ ይቅረጹ',
    subtitle: 'የግል የቁርአን ንባብዎን በዚህ ማስተንተኛ ውስጥ ይቅረጹ እና ያስቀምጡ።',
    readyToRecord: 'የቁርአን ንባብዎን ለመቅረጽ ከታች ያለውን ቁልፍ ይጫኑ።',
    recordingActive: 'ድምጽዎ እየተቀረጸ ነው...',
    stopBtn: 'መቅረጽ አቁም',
    startBtn: 'መቅረጽ ጀምር',
    previewTitle: 'የተቀረጸውን ንባብ ያዳምጡ',
    saveBtn: 'ከማስታወሻው ጋር አያይዝ',
    discardBtn: 'አጥፋ',
    rerecordBtn: 'እንደገና ቅረጽ',
    fragmentTitle: 'የንባቡ ርዕስ / መግለጫ',
    fragmentTitlePlaceholder: 'ምሳሌ: አንቀጽ 1-5 የተጅዊድ ልምምድ',
    verseRef: 'የአንቀጽ ማጣቀሻ (አማራጭ)',
    verseRefPlaceholder: 'ምሳሌ: አንቀጽ 1-5',
    micError: 'ማይክሮፎኑን ማግኘት አልተቻለም። እባክዎ የአሳሽ ፈቃድዎን ያረጋግጡ።',
    recordingLimitNotice: 'ከፍተኛው የቆይታ ጊዜ 5 ደቂቃ ነው።',
    durationLabel: 'ቆይታ:',
    listeningToYourself: 'ከማስቀመጥዎ በፊት ተጅዊዱን ለማረጋገጥ የተቀረጸውን ንባብ ያዳምጡ።'
  },
  har: {
    title: 'የእርስዎን የቁርአን ንባብ መቅዳት',
    subtitle: 'የቁርአን ንባብህን በድምጽህ በዚህ ማስተንተኛ ውስጥ አሕፍዝ።',
    readyToRecord: 'የቁርአን ንባብ ለመቅዳት ከታች ያለውን ቁልፍ ጫን።',
    recordingActive: 'ድምጽህ እየተቀዳ ኢንታ...',
    stopBtn: 'መቅዳት ማቆም',
    startBtn: 'መቅዳት መጀመር',
    previewTitle: 'የተቀዳው ንባብ ማዳመጥ',
    saveBtn: 'ከማስታወሻው ጋር አያይዝ',
    discardBtn: 'ሰርዝ',
    rerecordBtn: 'እንደገና መቅዳት',
    fragmentTitle: 'የንባብ ርዕስ',
    fragmentTitlePlaceholder: 'ምሳሌ: አያህ 1-5 ተጅዊድ ልምምድ',
    verseRef: 'የአያህ ማስታወሻ',
    verseRefPlaceholder: 'ምሳሌ: አያህ 1-5',
    micError: 'ማይክሮፎን ማግኘት አልተቻለም።',
    recordingLimitNotice: 'ከፍተኛው 5 ደቂቃ ኢንታ።',
    durationLabel: 'ቆይታ:',
    listeningToYourself: 'ከማስቀመጥህ በፊት የተቀዳውን ንባብ አድምጥ።'
  }
};

export const RecitationRecorderModal: React.FC<RecitationRecorderModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahNameEnglish,
  surahNameArabic,
  defaultAyahRange = '',
  onSaveRecitation,
}) => {
  const { language } = useLanguage();
  const tRec = recorderTranslations[language as keyof typeof recorderTranslations] || recorderTranslations.en;

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);
  const [recordedMimeType, setRecordedMimeType] = useState<string>('audio/webm');
  const [micError, setMicError] = useState<string | null>(null);

  // Form State
  const [fragmentTitle, setFragmentTitle] = useState<string>('');
  const [verseRef, setVerseRef] = useState<string>(defaultAyahRange);

  // Preview Playback State
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(0);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reset states when opening modal
  useEffect(() => {
    if (isOpen) {
      setVerseRef(defaultAyahRange);
      const defaultTitle = defaultAyahRange 
        ? `${surahNameEnglish} (${defaultAyahRange}) Recitation` 
        : `${surahNameEnglish} Recitation`;
      setFragmentTitle(defaultTitle);
      setRecordedAudioUrl(null);
      setRecordedBase64(null);
      setIsRecording(false);
      setRecordDuration(0);
      setMicError(null);
      setIsPreviewPlaying(false);
    } else {
      stopAllMedia();
    }
  }, [isOpen, defaultAyahRange, surahNameEnglish]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
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

  // Start live visualizer
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
      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

          // Gradient color: emerald to gold
          const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#059669'); // emerald-600
          gradient.addColorStop(0.6, '#10b981'); // emerald-500
          gradient.addColorStop(1, '#f59e0b'); // amber-500

          canvasCtx.fillStyle = gradient;
          canvasCtx.beginPath();
          canvasCtx.roundRect(x, canvas.height - barHeight, barWidth - 2, Math.max(3, barHeight), 4);
          canvasCtx.fill();

          x += barWidth + 1;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualizer could not be initialized:', e);
    }
  };

  // Start Recording
  const handleStartRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Determine supported MIME type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        }
      }
      setRecordedMimeType(mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        // Convert Blob to Base64 data URL for durable storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedBase64(reader.result as string);
        };

        // Determine audio duration
        const tempAudio = new Audio(url);
        tempAudio.onloadedmetadata = () => {
          const dur = isFinite(tempAudio.duration) ? tempAudio.duration : recordDuration;
          setPreviewDuration(dur);
        };
      };

      mediaRecorder.start(250); // collect chunks every 250ms
      setIsRecording(true);
      setRecordDuration(0);

      // Start visualizer
      startVisualizer(stream);

      // Timer
      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordDuration(elapsed);

        // Auto-stop at 5 minutes (300 seconds)
        if (elapsed >= 300) {
          handleStopRecording();
        }
      }, 500);

    } catch (err: any) {
      console.error('Microphone error:', err);
      setMicError(tRec.micError);
      setIsRecording(false);
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
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

    setIsRecording(false);
  };

  // Format Seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Preview Playback Controls
  const togglePreviewPlay = () => {
    if (!previewAudioRef.current && recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      previewAudioRef.current = audio;

      audio.ontimeupdate = () => {
        setPreviewCurrentTime(audio.currentTime);
      };
      audio.onended = () => {
        setIsPreviewPlaying(false);
        setPreviewCurrentTime(0);
      };
    }

    const audio = previewAudioRef.current;
    if (!audio) return;

    if (isPreviewPlaying) {
      audio.pause();
      setIsPreviewPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPreviewPlaying(true);
      }).catch(err => {
        console.error('Playback error:', err);
      });
    }
  };

  // Seek Preview
  const handleSeekPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setPreviewCurrentTime(time);
    if (previewAudioRef.current) {
      previewAudioRef.current.currentTime = time;
    }
  };

  // Save Recitation to Parent
  const handleSave = () => {
    if (!recordedBase64) return;

    const newFragment: RecitationFragment = {
      id: 'rec_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      title: fragmentTitle.trim() || `${surahNameEnglish} Recitation`,
      ayahReference: verseRef.trim() || undefined,
      audioData: recordedBase64,
      duration: previewDuration || recordDuration,
      createdAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mimeType: recordedMimeType
    };

    onSaveRecitation(newFragment);
    stopAllMedia();
    onClose();
  };

  // Discard & Re-record
  const handleDiscard = () => {
    stopAllMedia();
    setRecordedAudioUrl(null);
    setRecordedBase64(null);
    setRecordDuration(0);
    setPreviewCurrentTime(0);
    setIsPreviewPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-secondary-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white flex items-center justify-between border-b border-primary-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-500/20 border border-secondary-400/40 flex items-center justify-center text-secondary-300">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-base sm:text-lg text-white flex items-center gap-2">
                <span>{tRec.title}</span>
              </h3>
              <p className="text-xs text-primary-200 font-medium">
                Surah {surahNumber}. {surahNameEnglish} ({surahNameArabic})
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              stopAllMedia();
              onClose();
            }}
            className="p-2 text-primary-300 hover:text-white hover:bg-primary-800/80 rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Error notice */}
          {micError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{micError}</p>
                <p className="opacity-80 mt-0.5">Please allow microphone permissions in your browser bar and try again.</p>
              </div>
            </div>
          )}

          {/* RECORDING / IDLE STAGE */}
          {!recordedAudioUrl ? (
            <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
              
              {/* Visualizer Canvas / Waveform */}
              <div className="w-full h-24 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-secondary-200/80 dark:border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner">
                {isRecording ? (
                  <>
                    <canvas 
                      ref={canvasRef} 
                      width={380} 
                      height={96} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-3 flex items-center gap-1.5 bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-mono font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                        REC {formatTime(recordDuration)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Music className="w-7 h-7 opacity-40" />
                    <span className="text-xs font-medium">{tRec.readyToRecord}</span>
                  </div>
                )}
              </div>

              {/* Central Main Record / Stop Action Button */}
              <div className="flex flex-col items-center gap-3">
                {isRecording ? (
                  <button
                    onClick={handleStopRecording}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-500/30 transition-all cursor-pointer ring-4 ring-red-200 dark:ring-red-950/60 animate-pulse"
                    title={tRec.stopBtn}
                  >
                    <Square className="w-7 h-7 fill-white" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 active:scale-95 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer ring-4 ring-emerald-100 dark:ring-emerald-950/60"
                    title={tRec.startBtn}
                  >
                    <Mic className="w-7 h-7" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Record</span>
                  </button>
                )}

                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {isRecording ? tRec.recordingActive : tRec.startBtn}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {isRecording ? `${formatTime(recordDuration)} / 05:00` : tRec.recordingLimitNotice}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            
            /* PREVIEW & METADATA FORM STAGE */
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              
              {/* Playback Box */}
              <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-slate-50 dark:from-emerald-950/30 dark:to-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary-500" />
                    <span>{tRec.previewTitle}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    {formatTime(previewCurrentTime)} / {formatTime(previewDuration || recordDuration)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePreviewPlay}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
                    title={isPreviewPlaying ? "Pause" : "Play"}
                  >
                    {isPreviewPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={previewDuration || recordDuration || 1}
                      step={0.1}
                      value={previewCurrentTime}
                      onChange={handleSeekPreview}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  {tRec.listeningToYourself}
                </p>
              </div>

              {/* Title & Verse Reference Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {tRec.fragmentTitle}
                  </label>
                  <input
                    type="text"
                    value={fragmentTitle}
                    onChange={(e) => setFragmentTitle(e.target.value)}
                    placeholder={tRec.fragmentTitlePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-secondary-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {tRec.verseRef}
                  </label>
                  <input
                    type="text"
                    value={verseRef}
                    onChange={(e) => setVerseRef(e.target.value)}
                    placeholder={tRec.verseRefPlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-secondary-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{tRec.saveBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDiscard}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{tRec.rerecordBtn}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default RecitationRecorderModal;
