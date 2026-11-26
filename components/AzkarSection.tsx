import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Shield, Hash, List, Heart, Sparkles, Play, Pause, BookOpen, Volume2, VolumeX, RotateCcw, Loader2 } from 'lucide-react';
import { TTSButton } from './TTSButton';
import { HighlightableText } from './HighlightableText';
import { 
  dailyAdhkar, 
  generalSupplications, 
  specificWird, 
  istighfarCollection, 
  hizbs, 
  asmaUlHusna,
  DhikrItem,
  TimeMode,
  Category 
} from './AzkarModal';
import { useLanguage } from './LanguageContext';

const morningDhikrs = [
  {
    id: 'waking',
    title: 'Praise upon Waking',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    targetCount: 1,
    reference: "Page 53 (Booklet)"
  },
  {
    id: 'declaration',
    title: 'Declaration of Sovereignty',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْعَظَمَةُ وَالسُّلْطَانُ لِلَّهِ، وَالْعِزَّةُ وَالْقُدْرَةُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشْرِكِينَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ أَنْ تَبْعَثَنَا فِي هَذَا الْيَوْمِ إِلَى كُلِّ خَيْرٍ وَنَعُوذُ بِكَ أَنْ نَجْتَرِحَ فِيهِ سُوءاً أَوْ نَجُرَّهُ إِلَى مُسْلِمٍ.',
    translation: "We have entered the morning and at this very time the whole kingdom belongs to Allah, and all greatness and authority belong to Allah, Lord of the worlds. We have entered the morning upon the natural religion of Islam, the word of pure faith, the religion of our Prophet Muhammad (peace be upon him), and the faith of our father Ibrahim, who was a true believer and a Muslim, and was not of the polytheists. O Allah, we ask You to send us in this day to every good, and we seek refuge in You from committing any evil in it or bringing it upon a Muslim.",
    targetCount: 1,
    reference: "Page 53 (Booklet)"
  },
  {
    id: 'radaytu',
    title: 'Satisfaction with Allah',
    arabic: 'اللَّهُمَّ إِنِّي رَضِيتُ بِاللهِ تَعَالَى رَبّاً، وَبِالْإِسْلَامِ دِيناً، وَبِالْقُرْآنِ كِتَاباً، وَبِمُحَمَّدٍ ﷺ نَبِيّاً وَرَسُولاً',
    transliteration: "Allāhumma innī raḍītu billāhi ta'ālā rabban, wa bil-islāmi dīnan, wa bil-qur'āni kitāban, wa bi-Muḥammadin ṣallallāhu 'alayhi wa sallama nabiyyan wa rasūlā.",
    translation: "O Allah, I am pleased with Allah the Exalted as my Lord, with Islam as my religion, with the Quran as my book, and with Muhammad (SAW) as my Prophet and Messenger.",
    targetCount: 3,
    reference: "Page 53 (Booklet)"
  },
  {
    id: 'anxiety',
    title: 'Anxiety Relief & Loving the Quran',
    arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ، أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي وَغَمِّي',
    translation: "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your decree over me is ever executed, and Your judgment over me is entirely just. I ask You by every name belonging to You which You have named Yourself, or revealed in Your Book, or taught to any of Your creation, or preserved in the knowledge of the Unseen with You, that You make the Magnificent Quran the spring of my heart, the light of my chest, the banisher of my sadness, and the reliever of my anxiety.",
    targetCount: 1,
    reference: "Page 54 (Booklet)"
  },
  {
    id: 'subhan_3x',
    title: 'Praise & Power',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ',
    translation: "Glory be to Allah and His praise, Glory be to Allah the Magnificent, and there is no power nor strength except through Allah, the Most High, the Supreme.",
    targetCount: 3,
    reference: "Page 55 (Booklet)"
  },
  {
    id: 'cure_shield',
    title: 'Quran as Cure & Preservation',
    arabic: 'اللَّهُمَّ لَا تُشْمِتْ أَعْدَائِي بِدَائِي، وَاجْعَلِ الْقُرْآنَ الْعَظِيمَ شِفَائِي وَدَوَائِي، فَأَنَا الْعَلِيلُ وَأَنْتَ الْمُدَاوِي، أَنْتَ ثِقَتِي وَرَجَائِي، وَاجْعَلْ حُسْنِ ظَنِّي بِكَ شِفَائِي، اللَّهُمَّ احْفَظْ عَلَيَّ عَقْلِي وَدِينِي، وَبِكَ يَا رَبِّ ثَبِّتْ يَقِينِي، وَارْزُقْنِي رِزْقاً حَلَالاً يَكْفِينِي، وَأَبْعِدْ عَنِّي شَرَّ مَنْ يُؤْذِينِي، وَلَا تُحْوِجْنِي إِلَى طَبِيبٍ يُدَاوِينِي، اللَّهُمَّ اسْتُرْنِي فَوْقَ الْأَرْضِ، اللَّهُمَّ ارحَمْنِي فِي بَطْنِ الْأَرْضِ، اللَّهُمَّ اغْفِرْ لِي يَوْمَ الْعَرْضِ',
    translation: "O Allah, do not let my enemies rejoice over my illness, and make the magnificent Quran my cure and medicine, for I am the sick and You are the Healer, You are my trust and hope. Make my good opinion of You my healing. O Allah, preserve my intellect and religion, and through You, O Lord, strengthen my certainty, provide me with lawful sustenance that suffices me, keep me away from the evil of those who harm me, and do not make me in need of a doctor to treat me. O Allah, cover me above the earth, O Allah, have mercy on me inside the earth, O Allah, forgive me on the Day of presentation before You.",
    targetCount: 1,
    reference: "Page 55 (Booklet)"
  },
  {
    id: 'path_protection',
    title: 'Path Protection',
    arabic: 'بِسْمِ اللهِ طَرِيقِي، وَالرَّحْمَنُ رَفِيقِي، وَالرَّحِيمُ يَحْرُسُنِي مِنْ كُلِّ شَيْءٍ يَلْمِسُنِي، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    translation: "In the name of Allah is my path, the Most Merciful is my companion, and the Compassionate guards me from everything that touches me, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    targetCount: 1,
    reference: "Page 55 (Booklet)"
  },
  {
    id: 'fire',
    title: 'Protection from Fire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    translation: "O Allah, protect me from the Fire.",
    targetCount: 7,
    reference: "Page 55 (Booklet)"
  }
];

const AzkarSection: React.FC = () => {
  const { t, language, showDuaTransliteration, showDuaTranslation } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>('daily');
  const [timeMode, setTimeMode] = useState<TimeMode>('morning');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [azkarCurrentTime, setAzkarCurrentTime] = useState<number>(0);
  const [azkarDuration, setAzkarDuration] = useState<number>(0);
  const [azkarVolume, setAzkarVolume] = useState<number>(0.85);
  const [azkarIsMuted, setAzkarIsMuted] = useState<boolean>(false);
  const [azkarSpeed, setAzkarSpeed] = useState<number>(1);
  const [isAzkarLoading, setIsAzkarLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({
    waking: 0,
    declaration: 0,
    radaytu: 0,
    anxiety: 0,
    subhan_3x: 0,
    cure_shield: 0,
    path_protection: 0,
    fire: 0,
  });

  const getTranslatedDhikrs = () => {
    return morningDhikrs.map(dhikr => {
      let title = dhikr.title;
      let translation = dhikr.translation;
      let reference = dhikr.reference;

      if (language === 'ar') {
        if (dhikr.id === 'waking') { title = 'الحمد عند الاستيقاظ'; translation = 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.'; }
        else if (dhikr.id === 'declaration') { title = 'أصبحنا وأصبح الملك لله'; translation = 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.'; }
        else if (dhikr.id === 'radaytu') { title = 'الرضا بالله رباً وبالإسلام ديناً'; translation = 'رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً.'; }
        else if (dhikr.id === 'anxiety') { title = 'دعاء الكرب وتفريج الهم'; translation = 'اللهم إني عبدك ابن عبدك ابن أمتك ناصيتي بيدك ماض في حكمك عدل في قضاؤك.'; }
        else if (dhikr.id === 'subhan_3x') { title = 'التسبيح والتحميد'; translation = 'سبحان الله وبحمده، سبحان الله العظيم، ولا حول ولا قوة إلا بالله العلي العظيم.'; }
        else if (dhikr.id === 'cure_shield') { title = 'القرآن شفاء وحفظ'; translation = 'اللهم لا تشمت أعدائي بدائي، واجعل القرآن العظيم شفائي ودوائي.'; }
        else if (dhikr.id === 'path_protection') { title = 'حفظ الطريق'; translation = 'بسم الله طريقي، والرحمن رفيقي، والرحيم يحرسني من كل شيء يلمسني.'; }
        else if (dhikr.id === 'fire') { title = 'الاستجارة من النار'; translation = 'اللهم أجرني من النار.'; }
        reference = 'صفحة ٥٣ (كتيب)';
      } else if (language === 'am') {
        if (dhikr.id === 'waking') { title = 'ከእንቅልፍ ሲነቁ የሚደረግ ምስጋና'; translation = 'ለሞት ካደረሰን በኋላ ሕያው ላደረገን አላህ ምስጋና ይገባው፣ መመለሻም ወደ እርሱ ብቻ ነው።'; }
        else if (dhikr.id === 'declaration') { title = 'የማለዳ ቃል ኪዳንና ሉዓላዊነት'; translation = 'አነጋን፣ ንግስናም ሁሉ ለአላህ ሆነ፤ ታላቅነትና ስልጣንም ለአላህ የዓለማት ጌታ ነው። በእስልምና ተፈጥሮ፣ በቅን እምነት ቃል፣ በነቢያችን ሙሐመድ (ሰ.ዐ.ወ) ሃይማኖት እና በአባታችን ኢብራሂም መንገድ ላይ ሆነን አነጋን።'; }
        else if (dhikr.id === 'radaytu') { title = 'በአላህ ጌትነት መውደድ'; translation = 'በአላህ ጌትነት፣ በኢስላም ሃይማኖትነት፣ በቁርአን መጽሐፍነት፣ በሙሐመድ (ሰ.ዐ.ወ) ነቢይነትና መልዕክተኛነት ተስማምቻለሁ (ወድጃለሁ)።'; }
        else if (dhikr.id === 'anxiety') { title = 'ጭንቀትን ማስወገጃና ቁርአንን መውደጃ'; translation = 'አላህ ሆይ! እኔ ባሪያህ ነኝ፣ የባሪያህ ልጅ፣ የሴት ባሪያህም ልጅ። አናት ማህጸኔ በእጅህ ነው፣ ፍርድህ በኔ ላይ ተፈጻሚ ነው، ውሳኔህም ሙሉ በፍትህ የተሞላ ነው። ቁርአንን የልቤ ማረፊያ፣ የደረቴ ብርሃን፣ የሀዘኔ መክፈቻና የጭንቀቴ ማስወገጃ እንድታደርገው በሁሉም ስሞችህ እለምንሃለሁ።'; }
        else if (dhikr.id === 'subhan_3x') { title = 'ውዳሴና ሃይል'; translation = 'ለአላህ ምስጋናና ጥራት ይገባው، ታላቁ አላህም ጥራት ይገባው፤ ከአላህ በስተቀር ምንም ሃይልም ሆነ ጥንካሬ የለም።'; }
        else if (dhikr.id === 'cure_shield') { title = 'ቁርአን ፈውስና ጥበቃ'; translation = 'አላህ ሆይ! ጠላቶቼ በበሽታዬ እንዲደሰቱ አታድርግ، ቁርአንንም ፈውሴና መድኃኒቴ أድርገው። እኔ ታካሚ ነኝ አንተ ግን ፈዋሽ ነህ። አእምሮዬንና እምነቴን ጠብቅልኝ።'; }
        else if (dhikr.id === 'path_protection') { title = 'የመንገድ ጥበቃ'; translation = 'በአላህ ስም መንገዴ ነው፣ አረሕማን አብሮኝ ነው، አረሒም ከሚነካኝ ነገር ሁሉ ይጠብቀኛል።'; }
        else if (dhikr.id === 'fire') { title = 'ከእሳት ጥበቃ መለመን'; translation = 'አላህ ሆይ! ከእሳት ጠብቀኝ (አድነኝ)።'; }
        reference = 'ገጽ 53 (የእጅ መጽሐፍ)';
      } else if (language === 'har') {
        if (dhikr.id === 'waking') { title = 'ከእንቅልፍ መነሳት ምስጋና'; translation = 'ለሞት ካደረሰን በኋላ ሕያው ላደረገን አላህ ምስጋና ይገባው፣ መመለሻም ወደ እርሱ ብቻ ነው።'; }
        else if (dhikr.id === 'declaration') { title = 'የማለዳ ሉዓላዊነት ቃል'; translation = 'አነጋን፣ ንግስናም ሁሉ ለአላህ ሆነ፤ ታላቅነትና ስልጣንም ለአላህ የዓለማት ጌታ ነው። በእስልምና ተፈጥሮ، በቅን እምነት ቃል، በነቢያችን ሙሐመድ (ሰ.ዐ.ወ) ሃይማኖት ላይ ሆነን አነጋን።'; }
        else if (dhikr.id === 'radaytu') { title = 'በአላህ ጌትነት መውደድ'; translation = 'በአላህ ጌትነት፣ በኢስላም ሃይማኖትነት، በቁርአን መጽሐፍነት፣ በሙሐመድ (ሰ.ዐ.ወ) ነቢይነትና መልዕክተኛነት ተስማምቻለሁ (ወድጃለሁ)።'; }
        else if (dhikr.id === 'anxiety') { title = 'ሀዘንና ጭንቀት ማስወገጃ'; translation = 'አላህ ሆይ! እኔ ባሪያህ ነኝ፣ የባሪያህ ልጅ፣ የሴት ባሪያህም ልጅ። አናት ማህጸኔ በእጅህ ነው، ፍርድህ በኔ ላይ ተፈጻሚ ነው፣ ውሳኔህም ሙሉ በፍትህ የተሞላ ነው። ቁርአንን የልቤ ማረፊያ፣ የደረቴ ብርሃን፣ የሀዘኔ መክፈቻና የጭንቀቴ ማስወገጃ እንድታደርገው በሁሉም ስሞችህ እለምንሃለሁ。'; }
        else if (dhikr.id === 'subhan_3x') { title = 'ውዳሴና ሃይል'; translation = 'ለአላህ ምስጋናና ጥራት ይገባው، ታላቁ አላህም ጥራት ይገባው፤ ከአላህ በስተቀር ምንም ሃይልም ሆነ ጥንካሬ የለም።'; }
        else if (dhikr.id === 'cure_shield') { title = 'ቁርአን ፈውስና ጋሻ'; translation = 'አላህ ሆይ! ጠላቶቼ በበሽታዬ እንዲደሰቱ አታድርግ، ቁርአንንም ፈውሴና መድኃኒቴ አድርገው።'; }
        else if (dhikr.id === 'path_protection') { title = 'የመንገድ ጥበቃ'; translation = 'በአላህ ስም መንገዴ ነው፣ አረሕማን አብሮኝ ነው፣ አረሒም ከሚነካኝ ነገር ሁሉ ይጠብቀኛል።'; }
        else if (dhikr.id === 'fire') { title = 'ከጅሃነም እሳት መጠበቅ'; translation = 'አላህ ሆይ! ከእሳት ጠبቀኝ።'; }
        reference = 'ገጽ 53 (መጽሐፍ)';
      }

      return {
        ...dhikr,
        title,
        translation,
        reference
      };
    });
  };

  const incrementDhikr = (id: string, max: number) => {
    setDhikrCounts(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, max)
    }));
  };

  const resetDhikrs = () => {
    setDhikrCounts({
      waking: 0,
      declaration: 0,
      radaytu: 0,
      anxiety: 0,
      subhan_3x: 0,
      cure_shield: 0,
      path_protection: 0,
      fire: 0,
    });
  };

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeMode(hour >= 4 && hour < 16 ? 'morning' : 'evening');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = (id: string, url?: string) => {
    if (!url) return;

    if (activeAudioId === id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        setIsAzkarLoading(true);
        audioRef.current?.play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("Audio playback failed:", e);
            setIsAzkarLoading(false);
          });
      }
    } else {
      // Pause any other recitation if active
      window.dispatchEvent(new Event('pause-recitation'));

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.volume = azkarIsMuted ? 0 : azkarVolume;
      audio.playbackRate = azkarSpeed;
      
      audio.addEventListener('timeupdate', () => {
        setAzkarCurrentTime(audio.currentTime);
      });
      audio.addEventListener('durationchange', () => {
        setAzkarDuration(audio.duration || 0);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setActiveAudioId(null);
        setAzkarCurrentTime(0);
      });
      audio.addEventListener('waiting', () => {
        setIsAzkarLoading(true);
      });
      audio.addEventListener('playing', () => {
        setIsAzkarLoading(false);
      });
      audio.addEventListener('canplay', () => {
        setIsAzkarLoading(false);
      });
      
      setIsAzkarLoading(true);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setActiveAudioId(id);
        })
        .catch(e => {
          console.error("Audio playback failed:", e);
          setIsAzkarLoading(false);
        });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = azkarIsMuted ? 0 : azkarVolume;
    }
  }, [azkarVolume, azkarIsMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = azkarSpeed;
    }
  }, [azkarSpeed]);

  useEffect(() => {
    const handlePauseEvent = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };

    window.addEventListener('pause-recitation', handlePauseEvent);
    return () => {
      window.removeEventListener('pause-recitation', handlePauseEvent);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const getCategoryData = (): DhikrItem[] => {
    switch (activeCategory) {
      case 'daily': return dailyAdhkar;
      case 'supplications': return generalSupplications;
      case 'wird': return specificWird;
      case 'istighfar': return istighfarCollection;
      case 'hizb': return hizbs;
      case 'names': return asmaUlHusna;
      default: return dailyAdhkar;
    }
  };

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const categories: { id: Category; label: string; description: string; icon: React.ElementType }[] = [
    { id: 'daily', label: t('azkar.cat.daily'), description: t('azkar.cat.dailyDesc'), icon: Sun },
    { id: 'supplications', label: t('azkar.cat.supplications'), description: t('azkar.cat.supplicationsDesc'), icon: Heart },
    { id: 'wird', label: t('azkar.cat.wird'), description: t('azkar.cat.wirdDesc'), icon: Hash },
    { id: 'istighfar', label: t('azkar.cat.istighfar'), description: t('azkar.cat.istighfarDesc'), icon: Sparkles },
    { id: 'hizb', label: t('azkar.cat.hizb'), description: t('azkar.cat.hizbDesc'), icon: Shield },
    { id: 'names', label: t('azkar.cat.names'), description: t('azkar.cat.namesDesc'), icon: List },
  ];

  return (
    <div id="azkar-section" className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header Card */}
      <div id="azkar-header-banner" className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-[0.02] transform translate-x-12 -translate-y-12">
          <BookOpen size={320} className="text-primary-900" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={12} />
              {t('azkar.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-800">
              {t('azkar.title')}
            </h2>
            <p className="text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {t('azkar.desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Category Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Reset playing audio on category change
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                  setActiveAudioId(null);
                }
              }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all duration-200 select-none cursor-pointer h-32
                ${isActive 
                  ? 'bg-gradient-to-br from-primary-800 to-primary-700 border-primary-800 text-white shadow-md' 
                  : 'bg-white border-secondary-100 text-slate-700 hover:border-secondary-300 hover:bg-slate-50/50'}`}
            >
              <div className={`p-2 rounded-lg mb-2.5 transition-colors ${isActive ? 'bg-primary-900 text-secondary-400' : 'bg-primary-50 text-primary-600'}`}>
                <Icon size={22} />
              </div>
              <div>
                <span className="block text-xs font-bold leading-tight tracking-wide">{cat.label}</span>
                <span className={`block text-[10px] mt-0.5 leading-none ${isActive ? 'text-primary-200' : 'text-slate-400'}`}>
                  {cat.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Time mode select for Daily Adhkar */}
      {activeCategory === 'daily' && (
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full border border-secondary-200 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setTimeMode('morning')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer
                ${timeMode === 'morning' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Sun size={16} />
              {t('azkar.morning')}
            </button>
            <button
              onClick={() => setTimeMode('evening')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer
                ${timeMode === 'evening' 
                  ? 'bg-slate-800 text-blue-100 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Moon size={16} />
              {t('azkar.evening')}
            </button>
          </div>
        </div>
      )}

      {/* Main Litanies Content */}
      {activeCategory === 'names' ? (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
          {/* Introductory Header Banner */}
          <div className="bg-gradient-to-br from-[#fdfbf7] to-[#f8f5eb] border border-amber-200/60 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div dir="rtl" className="space-y-4">
              <p className="font-arabic text-2xl sm:text-3xl font-bold text-amber-800 tracking-wide">
                بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p className="font-arabic text-3xl sm:text-4xl leading-relaxed text-slate-850 font-bold border-y border-dashed border-amber-200/60 py-3 max-w-xl mx-auto">
                وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا
              </p>
              <p className="font-arabic text-2xl sm:text-3xl text-primary-800 font-semibold mt-2">
                هُوَ اللهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ
              </p>
            </div>
            <div className="max-w-xl mx-auto border-t border-amber-100/60 pt-4 text-[11px] sm:text-xs text-slate-500 space-y-1.5 italic font-serif leading-relaxed">
              <p>"In the Name of Allah, the Entirely Merciful, the Especially Merciful."</p>
              <p>"And to Allah belong the best names, so invoke Him by them..." (Quran 7:180)</p>
              <p>"He is Allah, other than whom there is no deity..." (Quran 59:22)</p>
            </div>
          </div>

          {/* Grid of 99 Names */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
            dir="rtl"
          >
            {getCategoryData().map((item) => {
              const englishName = item.title.split('(')[0].trim();
              return (
                <div 
                  key={item.id} 
                  dir="ltr" 
                  className="bg-white border border-secondary-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden"
                >
                  <span className="text-[10px] font-mono font-bold text-secondary-400 mb-2 border border-secondary-100 px-2 py-0.5 rounded-full bg-secondary-50">
                    {item.id}
                  </span>
                  <p className="font-arabic text-3xl mb-2.5 text-primary-700 group-hover:scale-105 transition-transform duration-300">
                    <HighlightableText text={item.arabic} lang="ar" />
                  </p>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{englishName}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <HighlightableText text={item.translation} lang="en" />
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <TTSButton text={item.arabic} lang="ar" className="h-6 w-6 p-1 rounded-lg" />
                    <TTSButton text={item.translation} lang="en" className="h-6 w-6 p-1 rounded-lg" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Supplication of Asma-ul-Husna (Dua for Anxiety/Sorrow) */}
          <div className="bg-gradient-to-br from-[#fdfbf7] to-[#f8f5eb] border border-amber-200/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm mt-8 animate-in fade-in duration-500 relative">
            <div className="text-center relative pb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-850 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <BookOpen size={13} className="text-amber-700" />
                {t('azkar.asmaTitle')}
              </span>
              <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                {t('azkar.asmaDesc')}
              </p>
              <div className="absolute right-0 top-0 flex items-center gap-1.5 mt-1">
                <TTSButton text="اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدُكَ وَابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِي حُكْمُكَ عَدْلٌ فِي قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجَلَاءَ حُزْنِي وَذَهَابَ هَمِّي" lang="ar" className="bg-white/80 border-amber-200" />
                <TTSButton text="O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your decree over me is past, Your judgment over me is just. I ask You by every name that belongs to You, which You have named Yourself, or revealed in Your Book, or taught to any of Your creation, or preserved in the knowledge of the Unseen with You, that You make the Quran the spring of my heart, the light of my chest, the banisher of my sadness, and the reliever of my anxiety." lang="en" className="bg-white/80 border-amber-200" />
              </div>
            </div>
            
            <p dir="rtl" className="font-arabic text-2xl sm:text-3xl leading-[2.5] sm:leading-[3] text-slate-800 text-center font-bold max-w-4xl mx-auto py-6 my-6 border-y border-dashed border-amber-200/60 block select-all">
              «<HighlightableText text="اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدُكَ وَابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِي حُكْمُكَ عَدْلٌ فِي قَضَاؤُكَ أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجَلَاءَ حُزْنِي وَذَهَابَ هَمِّي" lang="ar" />».
            </p>

            <div className="pt-4 space-y-6 text-slate-700 max-w-3xl mx-auto">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">{t('azkar.transliteration')}</p>
                <p className="text-xs sm:text-sm italic text-slate-600 leading-relaxed font-serif">
                  "Allāhumma innī 'abduka wa-bnu 'abdika wa-bnu amatika nāṣiyatī bi-yadika māḍin fiyya ḥukmuka 'adlun fiyya qaḍā'uka as'aluka bi-kulli ismin huwa laka sammayta bihī nafsaka aw anzaltahū fī kitābika aw 'allamtahū aḥadan min khalqika awista'tharta bihī fī 'ilmi-l-ghaybi 'indaka an taj'ala-l-Qur'āna rabī'a qalbī wa-nūra ṣadrī wa-jalā'a ḥuznī wa-dhahāba hammī."
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-200/40 pt-4">
                <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">{t('azkar.translation')}</p>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  "<HighlightableText text="O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your decree over me is past, Your judgment over me is just. I ask You by every name that belongs to You, which You have named Yourself, or revealed in Your Book, or taught to any of Your creation, or preserved in the knowledge of the Unseen with You, that You make the Quran the spring of my heart, the light of my chest, the banisher of my sadness, and the reliever of my anxiety." lang="en" />"
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
          {getCategoryData().map((item) => {
            const isCompleted = completed.has(item.id);
            const arabicText = (activeCategory === 'daily' && timeMode === 'evening' && item.arabicEvening) 
              ? item.arabicEvening 
              : item.arabic;
            const translationText = (activeCategory === 'daily' && timeMode === 'evening' && item.translationEvening)
              ? item.translationEvening
              : item.translation;

            return (
              <div 
                key={item.id} 
                dir="rtl"
                className={`bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm p-5 sm:p-6
                  ${isCompleted ? 'border-primary-200 bg-primary-50/20' : 'border-secondary-100 hover:border-secondary-300'}`}
              >
                <div className="flex items-center justify-between gap-4 mb-4 border-b border-dashed border-secondary-100 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base text-right">{item.title}</h4>
                    <div className="flex items-center gap-1" dir="ltr">
                      <TTSButton text={arabicText} lang="ar" />
                      <TTSButton text={translationText} lang="en" />
                    </div>
                    {item.audio && (
                      <button
                        onClick={() => toggleAudio(item.id, item.audio)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer
                          ${activeAudioId === item.id && isPlaying 
                            ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-200 ring-offset-1' 
                            : 'bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100'}`}
                      >
                        {activeAudioId === item.id && isPlaying ? (
                          <>
                            <Pause size={12} className="fill-current" />
                            <span>{language === 'ar' ? 'إيقاف' : (language === 'am' ? 'ማቆም' : (language === 'har' ? 'ማቆም' : 'Pause'))}</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} className="fill-current" />
                            <span>{language === 'ar' ? 'تشغيل' : (language === 'am' ? 'ድምፅ' : (language === 'har' ? 'ድምፅ' : 'Play Audio'))}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {item.count && (
                      <span className="text-xs font-bold font-mono bg-secondary-100 text-secondary-700 px-2.5 py-1 rounded-md border border-secondary-200/50">
                        {item.count}x
                      </span>
                    )}
                    {item.reference && (
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                        {item.reference}
                      </span>
                    )}
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={`flex items-center justify-center w-7 h-7 rounded-full border transition-all cursor-pointer
                        ${isCompleted 
                          ? 'bg-primary-600 border-primary-600 text-white shadow-sm' 
                          : 'border-slate-300 text-slate-300 hover:border-primary-400 hover:text-primary-400 bg-white'}`}
                      aria-label="Mark as read"
                    >
                      <span className="font-bold text-xs">✓</span>
                    </button>
                  </div>
                </div>

                {/* AZKAR CARD PREMIUM AUDIO CONTROLLER */}
                {activeAudioId === item.id && (
                  <div className="mb-5 p-3 rounded-xl border border-primary-100 bg-primary-50/15 dark:bg-slate-900/40 space-y-3 animate-in fade-in zoom-in-95 duration-200" dir="ltr">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                      {/* Seek Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                            }
                          }}
                          title="Rewind 5s"
                          className="p-1.5 rounded-lg border border-primary-200/60 hover:bg-primary-50 text-primary-700 dark:text-primary-400 cursor-pointer select-none transition-colors"
                        >
                          <RotateCcw size={12} />
                        </button>
                        <button
                          onClick={() => toggleAudio(item.id, item.audio)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xs cursor-pointer select-none"
                        >
                          {isAzkarLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : isPlaying ? (
                            <Pause size={13} className="fill-current" />
                          ) : (
                            <Play size={13} className="fill-current ml-0.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (audioRef.current && azkarDuration) {
                              audioRef.current.currentTime = Math.min(azkarDuration, audioRef.current.currentTime + 5);
                            }
                          }}
                          title="Forward 5s"
                          className="p-1.5 rounded-lg border border-primary-200/60 hover:bg-primary-50 text-primary-700 dark:text-primary-400 cursor-pointer select-none transition-colors"
                        >
                          <RotateCcw size={12} className="scale-x-[-1]" />
                        </button>
                      </div>

                      {/* Seek Slider */}
                      <div className="flex-1 w-full flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono w-8 text-right text-primary-900 dark:text-primary-400">
                          {Math.floor(azkarCurrentTime / 60)}:{(Math.floor(azkarCurrentTime % 60) < 10 ? '0' : '')}{Math.floor(azkarCurrentTime % 60)}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={azkarDuration || 100}
                          value={azkarCurrentTime}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (audioRef.current) {
                              audioRef.current.currentTime = val;
                              setAzkarCurrentTime(val);
                            }
                          }}
                          className="flex-1 h-1 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <span className="text-[10px] font-bold font-mono w-8 text-primary-900 dark:text-primary-400">
                          {Math.floor(azkarDuration / 60)}:{(Math.floor(azkarDuration % 60) < 10 ? '0' : '')}{Math.floor(azkarDuration % 60)}
                        </span>
                      </div>
                    </div>

                    {/* Speed & Volume Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-primary-100/50">
                      {/* Volume Slider */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAzkarIsMuted(!azkarIsMuted)}
                          className="p-1 text-primary-800 dark:text-primary-400 hover:text-primary-950 transition-colors cursor-pointer select-none"
                        >
                          {azkarIsMuted || azkarVolume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={azkarIsMuted ? 0 : azkarVolume}
                          onChange={(e) => {
                            setAzkarVolume(parseFloat(e.target.value));
                            setAzkarIsMuted(false);
                          }}
                          className="w-16 h-0.5 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                      </div>

                      {/* Playback speed multiplier */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-primary-850 dark:text-primary-400 uppercase tracking-wider mr-1">Speed:</span>
                        {[0.75, 1, 1.25, 1.5].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setAzkarSpeed(rate)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border transition-all cursor-pointer select-none
                              ${azkarSpeed === rate 
                                ? 'bg-primary-600 text-white border-primary-600 shadow-xs' 
                                : 'bg-white dark:bg-slate-900 hover:bg-primary-50 text-primary-900 dark:text-primary-400 border-primary-200/60'
                              }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {item.sections && item.sections.length > 0 ? (
                  <div className="space-y-6">
                    {item.sections.map((sec, sIdx) => {
                      return (
                        <div key={sec.id || sIdx} className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs space-y-4">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <span className="text-xs sm:text-sm font-bold text-slate-800 font-sans tracking-tight">
                              {sec.title || `Part ${sIdx + 1}`}
                            </span>
                            {sec.count && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                {sec.count}
                              </span>
                            )}
                          </div>

                          {/* Arabic Text */}
                          <div dir="rtl">
                            <HighlightableText 
                              text={sec.arabic} 
                              lang="ar" 
                              className="block font-arabic text-2xl sm:text-3xl !leading-[2.8] text-slate-900 text-right whitespace-pre-line" 
                            />
                          </div>

                          {/* Transliteration & Translation */}
                          {(showDuaTransliteration || showDuaTranslation) && (
                            <div className="space-y-2 border-t border-slate-100/80 pt-3 text-left" dir="ltr">
                              {showDuaTransliteration && sec.transliteration && (
                                <p className="text-sm text-slate-600 italic font-serif leading-relaxed text-left" dir="ltr">
                                  {sec.transliteration}
                                </p>
                              )}
                              {showDuaTranslation && sec.translation && (
                                <p className="text-slate-800 text-sm sm:text-base leading-relaxed text-left" dir="ltr">
                                  <HighlightableText text={sec.translation} lang="en" />
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {/* Centered/Right-aligned Arabic paragraphs */}
                    <div className="mb-6" dir="rtl">
                      <HighlightableText 
                        text={arabicText} 
                        lang="ar" 
                        className="block font-arabic text-2xl sm:text-3xl !leading-[2.5] text-slate-900 text-right whitespace-pre-line" 
                      />
                    </div>

                    {/* Translation & Transliteration */}
                    {(showDuaTransliteration || showDuaTranslation) && (
                      <div className="space-y-2 border-t border-slate-100/80 pt-4 text-right" dir="rtl">
                        {showDuaTransliteration && item.transliteration && (
                          <p className="text-sm text-slate-500 italic font-medium text-right" dir="ltr">{item.transliteration}</p>
                        )}
                        {showDuaTranslation && translationText && (
                          <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-right">
                            <HighlightableText text={translationText} lang="en" />
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Scholar/Benefit Note */}
                {item.note && (
                  <div className="mt-4 p-3.5 bg-amber-50/50 border border-amber-100/70 rounded-xl text-xs text-amber-900 leading-relaxed text-right" dir="rtl">
                    <strong>{t('azkar.benefitReward')}</strong> {item.note}
                  </div>
                )}
              </div>
            );
          })}
          
          {activeCategory === 'daily' && timeMode === 'morning' && (
            <div className="mt-12 pt-10 border-t border-slate-200/80 max-w-3xl mx-auto space-y-6" dir="rtl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" dir="rtl">
                <div className="text-right">
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-800 flex items-center gap-2 justify-start">
                    <Sun className="text-amber-500 w-6 h-6 shrink-0" />
                    {t('dua.morningTitle')}
                  </h3>
                  <p className="text-slate-600 mt-1.5 text-sm leading-relaxed text-right">
                    {t('dua.morningDesc')}
                  </p>
                </div>
                <button 
                  onClick={resetDhikrs}
                  className="self-start sm:self-center px-4 py-2 border border-secondary-300 hover:border-primary-500 rounded-lg text-xs font-semibold text-slate-600 hover:text-primary-700 transition-colors bg-white shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {t('dua.resetCounters')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto" dir="rtl">
                {getTranslatedDhikrs().map(dhikr => {
                  const current = dhikrCounts[dhikr.id] || 0;
                  const isDone = current >= dhikr.targetCount;
                  return (
                    <div 
                      key={dhikr.id} 
                      dir="rtl"
                      className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between ${isDone ? 'border-primary-500 ring-1 ring-primary-100 bg-primary-50/10' : 'border-secondary-200'}`}
                    >
                      {isDone && (
                        <div className="absolute top-0 left-0 w-16 h-16 bg-primary-100/30 rounded-br-full pointer-events-none" />
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-[10px] bg-secondary-100 text-secondary-800 px-2.5 py-0.5 rounded-full font-serif font-medium">{dhikr.reference}</span>
                          <span className="text-xs text-slate-400 font-medium font-mono">{t('dua.goal')} {dhikr.targetCount}x</span>
                        </div>
                        
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-bold text-slate-800 font-serif text-base sm:text-lg text-right">{dhikr.title}</h4>
                          <div className="flex items-center gap-1 flex-shrink-0" dir="ltr">
                            <TTSButton text={dhikr.arabic} lang="ar" />
                            <TTSButton text={dhikr.translation} lang="en" />
                          </div>
                        </div>
                        
                        <p className="font-arabic text-2xl sm:text-3xl !leading-[3.2] text-slate-900 text-right mb-6 select-all font-medium" dir="rtl">
                          <HighlightableText text={dhikr.arabic} lang="ar" />
                        </p>
                        
                        {showDuaTransliteration && dhikr.transliteration && (
                           <p className="text-xs font-serif text-slate-500 italic mb-3 leading-relaxed text-right" dir="ltr">{dhikr.transliteration}</p>
                        )}
                        {showDuaTranslation && (
                          <p className="text-slate-600 text-sm leading-relaxed mb-6 text-right">
                            <HighlightableText text={dhikr.translation} lang="en" />
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {isDone ? (
                            <span className="text-primary-600 font-semibold flex items-center gap-1">
                              {t('dua.completed')} <Sparkles size={12} className="text-amber-500" />
                            </span>
                          ) : (
                            t('dua.tapToCount')
                          )}
                        </span>
                        
                        <button
                          onClick={() => incrementDhikr(dhikr.id, dhikr.targetCount)}
                          disabled={isDone}
                          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 select-none active:scale-95 cursor-pointer
                            ${isDone 
                              ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-200' 
                              : 'bg-gradient-to-br from-[#fbf8f2] to-[#eadbc0] hover:from-[#f5efe0] hover:to-[#deb993] text-slate-800 shadow-inner'}`}
                        >
                          {isDone ? (
                            <span className="font-bold text-sm">✓</span>
                          ) : (
                            <>
                              <span className="text-[9px] text-slate-400 font-medium font-mono uppercase tracking-widest">Dhikr</span>
                              <span className="font-bold text-sm font-mono">{current}/{dhikr.targetCount}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decorative End Note */}
      <div className="flex justify-center pt-8 pb-4">
        <p className="text-slate-400 text-sm italic font-serif">{t('azkar.endNote')}</p>
      </div>
    </div>
  );
};

export default AzkarSection;
