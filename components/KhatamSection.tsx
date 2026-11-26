import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, 
  ChevronDown, ChevronUp, Check, BookOpen, Music, 
  Languages, Eye, EyeOff, Info, HelpCircle
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { TTSButton } from './TTSButton';

interface DuaVerse {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  startTime: number; // in seconds
}

const KHAATM_DUAS: DuaVerse[] = [
  {
    id: 1,
    arabic: "اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ\nوَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً",
    transliteration: "Allahumma-rhamni bil-Qur'an,\nwaj'alhu li imaman wa nuran wa hudan wa rahmah.",
    translation: "O Allah, have mercy on me with the Quran,\nand make it for me a guide, a light, a direction, and a mercy.",
    startTime: 0
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ\nوَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ\nوَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ",
    transliteration: "Allahumma dhakkirni minhu ma nasitu, wa 'allimni minhu ma jahiltu,\nwarzuqni tilawatahu ana'a-layli wa atrafan-nahar,\nwaj'alhu li hujjatan ya Rabbal-'alamin.",
    translation: "O Allah, remind me of whatever I have forgotten of it, teach me of what I am ignorant of,\ngrant me its recitation during the hours of night and the ends of the day,\nand make it a proof for me, O Lord of the Worlds.",
    startTime: 18
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي،\nوَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي،\nوَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي،\nوَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ\nوَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ",
    transliteration: "Allahumma aslih li diniyalladhi huwa 'ismatu amri,\nwa aslih li dunyayallati fiha ma'ashi,\nwa aslih li akhiratillati fiha ma'adi,\nwaj'alil-hayata ziyadatan li fi kulli khayr,\nwaj'alil-mawta rahatallan li min kulli sharr.",
    translation: "O Allah, rectify for me my religion which is the safeguard of my affairs,\nrectify for me my worldly life in which is my livelihood,\nrectify for me my Hereafter to which is my return,\nand make life an increase for me in every good,\nand make death a relief for me from every evil.",
    startTime: 43
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ\nوَخَيْرَ عَمَلِي خَوَاتِمَهُ\nوَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ",
    transliteration: "Allahumma-j'al khayra 'umri akhirahu,\nwa khayra 'amali khawatimahu,\nwa khayra ayyami yawma alqaka fih.",
    translation: "O Allah, make the best part of my life the end of it,\nthe best of my deeds its completion,\nand the best of my days the day when I meet You.",
    startTime: 74
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً\nوَمِيتَةً سَوِيَّةً\nوَمَرَدًّا غَيْرَ مُخْزٍ وَلاَ فَاضِحٍ",
    transliteration: "Allahumma inni as'aluka 'ishatan haniyyah,\nwa mitatan sawiyyah,\nwa maraddan ghayra mukhzin wa la fadih.",
    translation: "O Allah, I ask You for a pleasant life,\nan honorable death,\nand a destination that is neither humiliating nor shameful.",
    startTime: 98
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلَةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخَيْرَ المَمَاتِ\nوَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَتِي\nوَتَقَبَّلْ صَلاَتِي وَاغْفِرْ خَطِيئَتِي\nوَأَسْأَلُكَ الدَّرَجَاتِ العُلَى مِنَ الجَنَّةِ",
    transliteration: "Allahumma inni as'aluka khayral-mas'alati wa khayrad-du'a'i wa khayran-najahi wa khayral-'ilmi wa khayral-'amali wa khayrath-thawabi wa khayral-hayati wa khayral-mamati\nwa thabbitni wa thaqqil mawazini wa haqqiq imani warfa' darajati\nwa taqabbal salati waghfir khati'ati\nwa as'alukad-darajatil-'ula minal-jannah.",
    translation: "O Allah, I ask You for the best petition, the best supplication, the best success, the best knowledge, the best deed, the best reward, the best life, and the best death.\nStrengthen me, make heavy my scales, realize my faith, elevate my rank,\naccept my prayers, forgive my sins,\nand I ask You for the highest ranks of Paradise.",
    startTime: 118
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ\nوَالسَّلاَمَةَ مِنْ كُلِّ إِثْمٍ وَالغَنِيمَةَ مِنْ كُلِّ بِرٍّ\nوَالفَوْزَ بِالجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ",
    transliteration: "Allahumma inni as'aluka mujibati rahmatik, wa 'aza'ima maghfiratik,\nwas-salamata min kulli ithm, wal-ghanimata min kulli birr,\nwal-fawza bil-jannati wan-najata minan-nar.",
    translation: "O Allah, I ask You for the causes of Your mercy, the resolves of Your forgiveness,\nsafety from every sin, gain from every righteousness,\nthe attainment of Paradise, and salvation from the Fire.",
    startTime: 154
  },
  {
    id: 8,
    arabic: "اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الأُمُورِ كُلِّهَا\nوَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الآخِرَةِ",
    transliteration: "Allahumma ahsin 'aqibatana fil-umuri kulliha,\nwa ajirna min khizyid-dunya wa 'adhabil-akhirah.",
    translation: "O Allah, grant a good outcome for us in all our affairs,\nand save us from the disgrace of this world and the punishment of the Hereafter.",
    startTime: 181
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَا تَحُولُ بِهِ بَيْنَنَا وَبَيْنَ مَعْصِيَتِكَ\nوَمِنْ طَاعَتِكَ مَا تُبَلِّغُنَا بِهَا جَنَّتَكَ\nوَمِنَ اليَقِينِ مَا تُهَوِّنُ بِهِ عَلَيْنَا مَصَائِبَ الدُّنْيَا",
    transliteration: "Allahumma-qsim lana min khashyatika ma tahulu bihi baynana wa bayna ma'siyatik,\nwa min ta'atika ma tuballighuna biha jannatak,\nwinal-yaqini ma tuhawwinu bihi 'alayna masa'ibad-dunya.",
    translation: "O Allah, apportion to us of Your fear that which prevents us from disobeying You,\nand of Your obedience that which delivers us to Your Paradise,\nand of conviction that which makes light for us the calamities of this world.",
    startTime: 198
  },
  {
    id: 10,
    arabic: "وَمَتِّعْنَا بِأَسْمَاعِنَا وَأَبْصَارِنَا وَقُوَّتِنَا مَا أَحْيَيْتَنَا وَاجْعَلْهُ الوَارِثَ مِنَّا\nوَاجْعَلْ ثَأْرَنَا عَلَى مَنْ ظَلَمَنَا وَانْصُرْنَا عَلَى مَنْ عَادَانَا\nوَلاَ تَجْعَلْ مُصِيبَتَنَا فِي دِينِنَا\nوَلاَ تَجْعَلِ الدُّنْيَا أَكْبَرَ هَمِّنَا وَلاَ مَبْلَغَ عِلْمِنَا\nوَلاَ تُسَلِّطْ عَلَيْنَا مَنْ لاَ يَرْحَمُنَا",
    transliteration: "Wa matti'na bi-asma'ina wa absarina wa quwwatina ma ahyaytana, waj'alhul-waritha minna,\nwaj'al tharana 'ala man zalamana, wan-surna 'ala man 'adana,\nwa la taj'al musibatana fi dinina,\nwa la taj'alid-dunya akbara hammina wa la mablagha 'ilmina,\nwa la tusallit 'alayna man la yarhamuna.",
    translation: "And grant us enjoyment of our hearing, our sight, and our strength for as long as You keep us alive, and make it a legacy for us.\nLet our vengeance be upon those who have oppressed us, and support us against those who show enmity towards us.\nDo not make our calamity be in our religion,\nand do not make this worldly life our greatest concern nor the limit of our knowledge,\nand do not place over us authority that shows no mercy to us.",
    startTime: 226
  },
  {
    id: 11,
    arabic: "اللَّهُمَّ لاَ تَدَعْ لَنَا ذَنْبًا إِلاَّ غَفَرْتَهُ\nوَلاَ هَمَّاً إِلاَّ فَرَّجْتَهُ وَلاَ دَيْنًا إِلاَّ قَضَيْتَهُ\nوَلاَ حَاجَةً مِنْ حَوَائِجِ الدُّنْيَا وَالآخِرَةِ إِلاَّ قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ",
    transliteration: "Allahumma la tada' lana dhanban illa ghafartah,\nwa la hamman illa farrajtah, wa la daynan illa qadaytah,\nwa la hajatan min hawa'ijid-dunya wal-akhirati illa qadaytaha ya Arhamar-rahimin.",
    translation: "O Allah, do not leave for us any sin but that You forgive it,\nnor any worry but that You relieve it, nor any debt but that You pay it,\nnor any need of the needs of this world or the Hereafter but that You fulfill it, O Most Merciful of the merciful.",
    startTime: 275
  },
  {
    id: 12,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ\nوَصَلَّى اللهُ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَأَصْحَابِهِ الأَخْيَارِ\nوَسَلَّمَ تَسْلِيمًا كَثِيرًا",
    transliteration: "Rabbana atina fid-dunya hasanataw-wa fil-akhirati hasanataw-wa qina 'adhaban-nar,\nwa sallallahu 'ala nabiyyina Muhammadin wa 'ala alihi wa ashabihil-akhyari\nwa sallama tasliman kathira.",
    translation: "Our Lord, grant us good in this world and good in the Hereafter, and save us from the punishment of the Fire.\nAnd may Allah send blessings upon our Prophet Muhammad, and upon his family and his noble companions,\nand grant them abundant peace.",
    startTime: 318
  }
];

const RECITERS = [
  {
    id: 'sudais',
    name: 'Sheikh Abdul Rahman Al-Sudais',
    desc: 'Grand Mosque of Makkah (Emotional & Classic)',
    url: 'https://archive.org/download/Ramadhan291430MakkahKhatamAlQuraanDua/Ramadhaan29th_KhatamDua.mp3',
    urls: [
      'https://archive.org/download/Ramadhan291430MakkahKhatamAlQuraanDua/Ramadhaan29th_KhatamDua.mp3',
      'https://ia800903.us.archive.org/31/items/Ramadhan291430MakkahKhatamAlQuraanDua/Ramadhaan29th_KhatamDua.mp3',
      'https://ia600903.us.archive.org/31/items/Ramadhan291430MakkahKhatamAlQuraanDua/Ramadhaan29th_KhatamDua.mp3'
    ],
    startTimes: {
      1: 0,
      2: 120,
      3: 240,
      4: 360,
      5: 480,
      6: 600,
      7: 720,
      8: 840,
      9: 960,
      10: 1080,
      11: 1200,
      12: 1320
    }
  },
  {
    id: 'alafasy',
    name: 'Sheikh Mishary Rashid Alafasy',
    desc: 'Kuwait (Melodic & Highly Soothing)',
    url: 'https://archive.org/download/DuaAlafasy/15-Dua.mp3',
    urls: [
      'https://archive.org/download/DuaAlafasy/15-Dua.mp3',
      'https://ia800108.us.archive.org/3/items/DuaAlafasy/15-Dua.mp3',
      'https://ia600108.us.archive.org/3/items/DuaAlafasy/15-Dua.mp3'
    ],
    startTimes: {
      1: 0,
      2: 18,
      3: 43,
      4: 74,
      5: 98,
      6: 118,
      7: 154,
      8: 181,
      9: 198,
      10: 226,
      11: 275,
      12: 318
    }
  }
];

const getVerseStartTime = (verseId: number, reciterId: string): number => {
  const reciter = RECITERS.find(r => r.id === reciterId);
  if (reciter && reciter.startTimes && verseId in reciter.startTimes) {
    return reciter.startTimes[verseId as keyof typeof reciter.startTimes];
  }
  const verse = KHAATM_DUAS.find(v => v.id === verseId);
  return verse ? verse.startTime : 0;
};

export default function KhatamSection() {
  const { 
    language, 
    t, 
    showDuaTransliteration: showTransliteration, 
    setShowDuaTransliteration: setShowTransliteration, 
    showDuaTranslation: showTranslation, 
    setShowDuaTranslation: setShowTranslation 
  } = useLanguage();
  
  // Player states
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [urlIndex, setUrlIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);

  // Global toggle displays
  const [showArabic, setShowArabic] = useState(true);

  // Expanded card state
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset URL index when reciter changes
  useEffect(() => {
    setUrlIndex(0);
  }, [selectedReciter]);

  // Initialize Audio
  useEffect(() => {
    const urls = (selectedReciter as any).urls || [selectedReciter.url];
    const currentUrl = urls[urlIndex] || selectedReciter.url;
    
    const audio = new Audio(currentUrl);
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Find which verse corresponds to the current playback time
      let activeIndex = null;
      for (let i = KHAATM_DUAS.length - 1; i >= 0; i--) {
        const verseStartTime = getVerseStartTime(KHAATM_DUAS[i].id, selectedReciter.id);
        if (time >= verseStartTime) {
          activeIndex = i;
          break;
        }
      }
      setActiveVerseIndex(activeIndex);
    };

    const handleDurationChange = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveVerseIndex(null);
    };

    const handlePauseRecitation = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.sender === 'khatam') {
        return;
      }
      audio.pause();
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.warn("Audio element reported load error on url:", audio.src, e);
      const reciterUrls = (selectedReciter as any).urls || [selectedReciter.url];
      if (urlIndex < reciterUrls.length - 1) {
        console.log(`Encountered error. Attempting next fallback URL: ${urlIndex + 1}`);
        setUrlIndex(prev => prev + 1);
      } else {
        console.error("All fallback URLs failed for this reciter.");
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Apply states
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;

    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('pause-recitation', { detail: { sender: 'khatam' } }));
    }

    window.addEventListener('pause-recitation', handlePauseRecitation);

    if (isPlaying) {
      audio.play().catch(playErr => {
        // If play is blocked or fails immediately, check if we should try next fallback
        console.warn("Audio play() failed/blocked:", playErr);
        const reciterUrls = (selectedReciter as any).urls || [selectedReciter.url];
        if (urlIndex < reciterUrls.length - 1) {
          console.log(`Triggering next fallback from play catch: ${urlIndex + 1}`);
          setUrlIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      window.removeEventListener('pause-recitation', handlePauseRecitation);
      audioRef.current = null;
    };
  }, [selectedReciter, urlIndex]);

  // Handle Playback rate / Volume / Mutiness changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync active verse auto scrolling
  useEffect(() => {
    if (activeVerseIndex !== null) {
      // Disable auto-scrolling when reciting Grand Mosque of Makkah (sudais) or Kuwait (alafasy)
      if (selectedReciter.id === 'sudais' || selectedReciter.id === 'alafasy') {
        return;
      }

      const activeVerse = KHAATM_DUAS[activeVerseIndex];
      const element = verseRefs.current[activeVerse.id];
      const container = containerRef.current;
      if (element && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Element's top position relative to the scroll container's content
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        
        // Center the card in the container's scrollable viewport
        const targetScrollTop = relativeTop - (container.clientHeight / 2) + (element.clientHeight / 2);
        
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, [activeVerseIndex, selectedReciter.id]);

  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any other recitation globally first, passing khatam sender
      window.dispatchEvent(new CustomEvent('pause-recitation', { detail: { sender: 'khatam' } }));
      
      // Give a tiny delay for other system pauses to process
      setTimeout(() => {
        if (audioRef.current) {
          const isAbortError = (err: any) => {
            return err && (
              err.name === 'AbortError' || 
              err.message?.includes('interrupted') || 
              err.message?.includes('pause') ||
              err.message?.includes('The play() request was interrupted')
            );
          };

          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
              if (!isAbortError(e)) {
                console.error("Audio playback error:", e);
              }
            });
        }
      }, 50);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkipTime = (amount: number) => {
    if (audioRef.current) {
      const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount));
      handleSeek(target);
    }
  };

  const handleVerseClick = (verse: DuaVerse, index: number) => {
    const startTime = getVerseStartTime(verse.id, selectedReciter.id);
    handleSeek(startTime);
    setActiveVerseIndex(index);
    if (!isPlaying) {
      handlePlayToggle();
    }
  };

  const handleReciterChange = (reciterId: string) => {
    const reciter = RECITERS.find(r => r.id === reciterId);
    if (reciter) {
      const wasPlaying = isPlaying;
      setSelectedReciter(reciter);
      // Selected reciter update will trigger useEffect to reload source
      if (wasPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const toggleCardExpanded = (id: number) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Content strings for multilingual headings
  const headers = {
    en: {
      title: "Khatam-ul-Quran (Quran Completion Dua)",
      desc: "Reciting this beautiful, comprehensive traditional supplication upon completing the reading of the Holy Quran is a highly recommended practice (Sunnah). It encompasses deep prayers for worldly guidance, relief from hardship, a blessed end of life, and the highest ranks of Paradise.",
      aboutTitle: "About the Completion Dua",
      hadith: "The Prophet Muhammad (peace be upon him) said: 'Whosoever completes the recitation of the Quran, then he has a supplication that will be answered.' It is also reported that mercy descends upon completing the Quran, and Anas ibn Malik (R.A) used to gather his family and make Dua when completing it.",
      reciterLabel: "Choose Reciter Style",
      masterControls: "Global Text View Options",
      clickTip: "Tip: Click on any Dua verse card to jump directly to its recitation time."
    },
    ar: {
      title: "دعاء ختم القرآن الكريم",
      desc: "إن تلاوة هذا الدعاء التقليدي المبارك عند الانتهاء من قراءة كتاب الله تعالى هو عمل مستحب وعظيم الأجر. يحتوي هذا الدعاء الشامل على تضرع عميق لله بطلب الهداية والرحمة، وصلاح الدين والدنيا والآخرة، والفوز بالجنة والنجاة من النار.",
      aboutTitle: "حول فضيلة دعاء ختم القرآن",
      hadith: "عن أنس بن مالك رضي الله عنه أنه كان إذا ختم القرآن جمع أهله وولده ودعا بهم. وروي في الحديث: 'عند ختم القرآن دعوة مستجابة'. ومن ثم يسن للمسلم التضرع والإلحاح بالدعاء والخيرات.",
      reciterLabel: "اختر صوت القارئ",
      masterControls: "خيارات عرض النص الشاملة",
      clickTip: "نصيحة: انقر فوق أي بطاقة آية للانتقال مباشرة إلى وقت تلاوتها في الصوت."
    },
    am: {
      title: "ኻታም-ኡል-ቁርአን (የቁርአን ማጠናቀቂያ ዱዓ)",
      desc: "የተከበረውን ቁርአን አንብበው ሲያጠናቅቁ ይህንን ውብ እና ሁለንተናዊ የባህል ዱዓ ማድረግ እጅግ የተወደደ ሱና ነው። ይህ ዱዓ ለዱንያ መሪነት፣ ከችግሮች ለመገላገል፣ ለመልካም መጨረሻ እና ለላቀው የጀነት ማዕረግ የሚጠየቁ ጥልቅ ልመናዎችን ያካትታል።",
      aboutTitle: "ስለ ቁርአን ማጠናቀቂያ ዱዓ",
      hadith: "ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) እንዲህ ብለዋል፡ 'ቁርአንን ያጠናቀቀ ሰው ተቀባይነት ያለው ዱዓ አለው።' እንዲሁም ቁርአን ሲጠናቀቅ የአላህ እዝነት እንደሚወርድ ይነገራል። ሰሐባው አነስ ኢብኑ ማሊክ (ረ.ዐ) ቁርአን ሲያጠናቅቁ ቤተሰቦቻቸውን ሰብስበው ዱዓ ያደርጉ ነበር።",
      reciterLabel: "የቃሪዕ ድምጽ ይምረጡ",
      masterControls: "የጽሑፍ ማሳያ ምርጫዎች",
      clickTip: "ጠቃሚ ምክር: ድምጹን በቀጥታ ወደዚያ ቦታ ለማስተላለፍ በዱዓው ካርድ ላይ ይጫኑ።"
    },
    har: {
      title: "ኻታም-ኡል-ቁርአን (የቁርአን ማጠናቀቂያ ዱዓ)",
      desc: "የተከበረውን ቁርአን አንብበው ሲያጠናቅቁ ይህንን ውብ እና ሁለንተናዊ የባህል ዱዓ ማድረግ እጅግ የተወደደ ሱና ነው። ይህ ዱዓ ለዱንያ መሪነት፣ ከችግሮች ለመገላገል፣ ለመልካም መጨረሻ እና ለላቀው የጀነት ማዕረግ የሚጠየቁ ጥልቅ ልመናዎችን ያካትታል።",
      aboutTitle: "ስለ ቁርአን ማጠናቀቂያ ዱዓ",
      hadith: "ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) እንዲህ ብለዋል፡ 'ቁርአንን ያጠናቀቀ ሰው ተቀባይነት ያለው ዱዓ አለው።' እንዲሁም ቁርአን ሲጠናቀቅ የአላህ እዝነት እንደሚወርድ ይነገራል። ሰሐባው አነስ ኢብኑ ማሊክ (ረ.ዐ) ቁርአን ሲያጠናቅቁ ቤተሰቦቻቸውን ሰብስበው ዱዓ ያደርጉ ነበር።",
      reciterLabel: "የቃሪዕ ድምጽ ይምረጡ",
      masterControls: "የጽሑፍ ማሳያ ምርጫዎች",
      clickTip: "ጠቃሚ ምክር: ድምጹን በቀጥታ ወደዚያ ቦታ ለማስተላለፍ በዱዓው ካርድ ላይ ይጫኑ።"
    }
  };

  const localizedHeader = headers[language as keyof typeof headers] || headers.en;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner Section */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-8 sm:px-10 border-b border-secondary-400">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm ring-1 ring-secondary-400/30 text-secondary-300">
              <Sparkles className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">{localizedHeader.title}</h2>
              <p className="text-primary-100 mt-1.5 text-xs sm:text-sm font-medium tracking-wide uppercase">
                {language === 'ar' ? 'أَدْعِيَةُ خَتْمِ القُرْآنِ الكَرِيمِ • ثَوَابٌ وَبَرَكَةٌ' : 'Remembrance, Solace & Elevated Devotion'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            {localizedHeader.desc}
          </p>

          {/* About Section (Hadith Box) */}
          <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-200/40 rounded-2xl p-5 flex gap-4 items-start">
            <Info className="text-emerald-600 dark:text-emerald-400 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400">{localizedHeader.aboutTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed select-text font-serif italic">
                {localizedHeader.hadith}
              </p>
            </div>
          </div>

          {/* Audio Player and Config Box */}
          <div className="bg-gradient-to-br from-slate-50 to-secondary-50/50 dark:from-slate-900/30 dark:to-slate-950/20 border border-secondary-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            
            {/* Upper Player Area: Reciter selector & info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-secondary-200/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-100 dark:bg-slate-800 rounded-xl text-primary-700 dark:text-secondary-400">
                  <Music size={18} />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">{localizedHeader.reciterLabel}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <select
                      value={selectedReciter.id}
                      onChange={(e) => handleReciterChange(e.target.value)}
                      className="text-sm font-bold bg-white dark:bg-slate-900 border border-secondary-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      {RECITERS.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Audio Recitation Info</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 block">
                  {selectedReciter.desc}
                </span>
              </div>
            </div>

            {/* Middle Player Area: Play, Timeline & Seek Controls */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {/* Audio Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSkipTime(-10)}
                    title="10s Back"
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-secondary-200 hover:border-primary-300 text-slate-600 dark:text-slate-300 hover:text-primary-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={handlePlayToggle}
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white cursor-pointer select-none shadow-md hover:scale-105 active:scale-95 transition-all
                      ${isPlaying 
                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100 dark:shadow-none' 
                        : 'bg-primary-600 hover:bg-primary-700 shadow-primary-100 dark:shadow-none'
                      }`}
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>

                  <button
                    onClick={() => handleSkipTime(10)}
                    title="10s Forward"
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-secondary-200 hover:border-primary-300 text-slate-600 dark:text-slate-300 hover:text-primary-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
                  >
                    <RotateCcw size={15} className="scale-x-[-1]" />
                  </button>
                </div>

                {/* Timeline Sliders */}
                <div className="flex-1 w-full flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 font-mono w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-secondary-200/60 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />

                  <span className="text-xs font-semibold text-slate-500 font-mono w-10">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Volume and Speed Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer select-none"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-20 sm:w-24 h-1 bg-secondary-200/50 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>

                {/* Playback speed buttons */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5">Speed:</span>
                  {[0.75, 1, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer select-none
                        ${playbackRate === rate 
                          ? 'bg-primary-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-secondary-200'
                        }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Master Text View Customizer Controls */}
          <div className="border border-secondary-200 rounded-2xl p-4 sm:p-5 bg-white/50 dark:bg-slate-900/10 space-y-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <Languages size={14} className="text-primary-600" />
              <span>{localizedHeader.masterControls}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowArabic(!showArabic)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none
                  ${showArabic 
                    ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800'
                  }`}
              >
                {showArabic ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>Arabic Script</span>
              </button>

              <button
                onClick={() => setShowTransliteration(!showTransliteration)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none
                  ${showTransliteration 
                    ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800'
                  }`}
              >
                {showTransliteration ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>Phonetic Transliteration</span>
              </button>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none
                  ${showTranslation 
                    ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800'
                  }`}
              >
                {showTranslation ? <Eye size={13} /> : <EyeOff size={13} />}
                <span>English Translation</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Staggered Verse Lists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>{KHAATM_DUAS.length} supplication sections</span>
          <span className="italic">{localizedHeader.clickTip}</span>
        </div>

        <div ref={containerRef} className="space-y-4 max-h-[800px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200/80">
          {KHAATM_DUAS.map((verse, index) => {
            const isActive = activeVerseIndex === index;
            const isExpanded = !!expandedCards[verse.id];

            return (
              <div
                key={verse.id}
                ref={el => verseRefs.current[verse.id] = el}
                onClick={() => handleVerseClick(verse, index)}
                className={`group rounded-2xl border transition-all duration-300 p-5 sm:p-6 text-left cursor-pointer select-none relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/70 shadow-md ring-1 ring-emerald-500/20' 
                    : 'bg-white/90 backdrop-blur-sm border-secondary-200 hover:border-secondary-300 hover:shadow-sm'
                  }`}
              >
                {/* Active side highlighter bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-md animate-pulse" />
                )}

                {/* Card index badge and playback jump controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold
                      ${isActive 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {verse.id}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Reciting Now...</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      Starts at {formatTime(getVerseStartTime(verse.id, selectedReciter.id))}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardExpanded(verse.id);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Toggle layout detail"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Text Layout Stack */}
                <div className="space-y-4">
                  {/* 1. Arabic Text */}
                  {showArabic && (
                    <div className="flex items-start gap-3 justify-between" dir="rtl">
                      <div className="flex-1 text-right space-y-4">
                        {verse.arabic.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="font-arabic text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 leading-[1.8] font-bold font-serif select-all">
                            {line}
                          </p>
                        ))}
                      </div>
                      <TTSButton 
                        text={verse.arabic.replace(/\n/g, ' ')} 
                        lang="ar" 
                        className="h-7 w-7 p-1 rounded-lg shrink-0 mt-1" 
                        tooltipText="Listen to Arabic recitation (TTS)"
                      />
                    </div>
                  )}

                  {/* 2. Phonetic Transliteration */}
                  {showTransliteration && (showArabic || isExpanded) && (
                    <div className="border-t border-dashed border-secondary-200/40 pt-3">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-primary-100/60 text-[9px] font-bold text-primary-800 uppercase tracking-wider mb-1.5">
                        Transliteration
                      </span>
                      <div className="space-y-3">
                        {verse.transliteration.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed select-text font-serif">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. English Translation */}
                  {showTranslation && (showArabic || showTransliteration || isExpanded) && (
                    <div className="border-t border-dashed border-secondary-200/40 pt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100/60 text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                          Translation
                        </span>
                        <TTSButton 
                          text={verse.translation.replace(/\n/g, ' ')} 
                          lang="en" 
                          className="h-6 w-6 p-1 rounded-lg" 
                          tooltipText="Listen to English translation (TTS)"
                        />
                      </div>
                      <div className="space-y-3">
                        {verse.translation.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans text-justify select-text">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
