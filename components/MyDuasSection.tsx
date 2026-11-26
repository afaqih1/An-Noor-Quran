import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Tag, Trash2, Plus, Search, Sparkles, Filter, 
  BookOpen, FolderHeart, PlusCircle, Volume2, Check, AlertCircle, X, Info,
  Mic, MicOff, Waves, Download, Play, Pause, RotateCcw, Radio
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DuaAudioPlayer } from './DuaAudioPlayer';
import { VoiceDuaRecorderModal } from './VoiceDuaRecorderModal';

export interface SavedDua {
  id: string;
  category: 'general' | 'deceased' | 'azkar' | 'custom';
  title: string;
  arabicText: string;
  transliterationText?: string;
  translationText: string;
  reference?: string;
  tags: string[];
  timestamp: number;
  voiceRecordingUrl?: string;
  isVoiceNote?: boolean;
  audioDuration?: number;
}

const libraryDuas: Omit<SavedDua, 'timestamp'>[] = [
  {
    id: 'general_salawat',
    category: 'general',
    title: 'Salawat on Prophet Muhammad (ﷺ)',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliterationText: "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad",
    translationText: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad.',
    reference: 'Sahih al-Bukhari',
    tags: ['Salawat', 'Friday', 'Prophet']
  },
  {
    id: 'general_rabbana',
    category: 'general',
    title: 'Rabbana (Best of Dunya & Akhirah)',
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliterationText: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar",
    translationText: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.',
    reference: 'Surah Al-Baqarah [2:201]',
    tags: ['Quranic', 'General', 'Success']
  },
  {
    id: 'khatmul_quran_main',
    category: 'general',
    title: 'Dua for Khatmul Quran (Completion of Holy Quran)',
    arabicText: 'اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.',
    transliterationText: "Allahumma-rhamni bil-Qur'ani waj'alhu li imaman wa nuran wa hudan wa rahmah. Allahumma dhakkirni minhu ma nasitu wa 'allimni minhu ma jahiltu warzuqni tilawatahu ana'al-layli wa atrafan-nahar waj'alhu li hujjatan ya Rabbal-'alamin.",
    translationText: "O Allah, have mercy on me with the Quran, and make it for me a guide, a light, a direction, and a mercy. O Allah, remind me of whatever I have forgotten of it, teach me of what I am ignorant of, grant me its recitation during the hours of night and the ends of the day, and make it a proof for me, O Lord of the Worlds.",
    reference: 'Traditional Khatm Supplication',
    tags: ['Khatm', 'Quranic', 'Completion', 'Mercy']
  },
  {
    id: 'general_family',
    category: 'general',
    title: 'Dua for Spouses & Children',
    arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا. رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliterationText: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama. Rabbi-j'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a.",
    translationText: 'O our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous. O Lord, make me and my descendants establishers of prayer.',
    reference: 'Surah Al-Furqan [25:74] & Surah Ibrahim [14:40]',
    tags: ['Quranic', 'Family', 'Children']
  },
  {
    id: 'prophetic_mercy',
    category: 'deceased',
    title: 'Prophetic Supplication for Vast Forgiveness',
    arabicText: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالتَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلاً خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ النَّارِ.',
    transliterationText: "Allaahum-maghfir lahu warhamhu, wa 'aafihi wa'fu 'anhu, wa akrim nuzulahu, wa wassi' mudkhalahu, waghsilhu bil-ma'i wath-thalji wal-barad, wa naqqihi minal-khataaya kama naqqaytath-thawbal-abyada minad-danas...",
    translationText: "O Allah, forgive him and have mercy on him, keep him safe and sound and pardon him, honor his reception, widen his entry, wash him with water, snow, and hail, and cleanse him of sin as a white garment is cleansed of dirt...",
    reference: 'Sahih Muslim',
    tags: ['Forgiveness', 'Mercy', 'Deceased']
  },
  {
    id: 'quranic_parents',
    category: 'deceased',
    title: 'Quranic Prayer for Parents & Believers',
    arabicText: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliterationText: "Rabbanagh-fir lee wa li-waalidayya wa lil-mu'mineena yawma yaqoomul-hisaab.",
    translationText: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
    reference: 'Surah Ibrahim [14:41]',
    tags: ['Quranic', 'Parents', 'Forgiveness']
  },
  {
    id: 'azkar_radaytu',
    category: 'azkar',
    title: 'Satisfaction with Allah & Faith',
    arabicText: 'اللَّهُمَّ إِنِّي رَضِيتُ بِاللهِ تَعَالَى رَبّاً، وَبِالْإِسْلَامِ دِيناً، وَبِالْقُرْآنِ كِتَاباً، وَبِمُحَمَّدٍ ﷺ نَبِيّاً وَرَسُولاً',
    transliterationText: "Allāhumma innī raḍītu billāhi ta'ālā rabban, wa bil-islāmi dīnan, wa bil-qur'āni kitāban, wa bi-Muḥammadin ṣallallāhu 'alayhi wa sallama nabiyyan wa rasūlā.",
    translationText: 'O Allah, I am pleased with Allah the Exalted as my Lord, with Islam as my religion, with the Quran as my book, and with Muhammad (SAW) as my Prophet and Messenger.',
    reference: 'Sahih Muslim (Morning Adhkar)',
    tags: ['Morning', 'Satisfaction', 'Faith']
  },
  {
    id: 'azkar_anxiety',
    category: 'azkar',
    title: 'Anxiety Relief & Loving the Quran',
    arabicText: 'اللَّهُمَّ إِنِّي عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ، أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي وَغَمِّي',
    transliterationText: "Allaahumma innee 'abduk, wabnu 'abdik, wabnu amatik, nasiyatee biyadikh...",
    translationText: 'O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your decree over me is ever executed, and Your judgment over me is entirely just. I ask You... to make the Magnificent Quran the spring of my heart, the light of my chest, the banisher of my sadness...',
    reference: 'Ahmad (Morning Adhkar)',
    tags: ['Morning', 'Anxiety', 'Quran']
  }
];

export interface GoogleDriveDua {
  title: string;
  url: string;
  type: string;
  suggestedTranslation: string;
  suggestedArabic?: string;
}

export const googleDriveDuas: GoogleDriveDua[] = [
  {
    title: "Dua Khatmil Quran in Arabic (PDF)",
    url: "https://drive.google.com/file/d/0B0H8qiLsZPgid1Y0eVR0eGtyNXM/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "Supplication upon completion of the Noble Quran. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ"
  },
  {
    title: "Dua for the dead in the Funeral prayer (PDF)",
    url: "https://drive.google.com/file/d/0B0H8qiLsZPgiMF9CVER6Q3ZWQnc/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "Supplications recited during the Janazah (funeral) prayer for the deceased. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ وَاغْسِلْهُ بِالْمَاءِ وَالتَّلْجِ وَالْبَرَدِ وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الأَبْيَضَ مِنَ الدَّنَسِ"
  },
  {
    title: "DUA FOR TRAVELING - DUA al SAFAR (MP3)",
    url: "https://drive.google.com/file/d/0B9CMtoXE-jH5cGcyLXRaQzBzQ00/view?usp=sharing",
    type: "MP3 Audio",
    suggestedTranslation: "The beautiful recitation of the travel supplication (Dua al-Safar) for safe journeys. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ"
  },
  {
    title: "Dua For Stress and Sickness (PDF)",
    url: "https://drive.google.com/file/d/0B6HVipR9Mo-BMkduMWpxMHNqaEk/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "Supplications for relief from stress, anxiety, sickness, and hardships. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ"
  },
  {
    title: "25 Dua Quran (PDF)",
    url: "https://drive.google.com/file/d/0B6HVipR9Mo-Bb3BKVWdZcjJULVk/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "A compilation of 25 powerful Quranic supplications beginning with 'Rabbana' or 'Rabbi'. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"
  },
  {
    title: "Hisnul-Muslim - English (PDF)",
    url: "https://drive.google.com/file/d/0B6HVipR9Mo-BbVBGa3gwMnhEWDg/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "The complete English translation of Hisnul Muslim (Fortress of the Muslim) - a collection of authentic daily supplications. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Hisn al-Muslim - Arabic (PDF)",
    url: "https://drive.google.com/file/d/0B6HVipR9Mo-BYl9KSlVkSEhZM3M/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "The complete Arabic text of Hisnul Muslim (Fortress of the Muslim) containing authentic daily remembrances. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "The Duaa of Qunoot with Explanation (PDF)",
    url: "https://drive.google.com/file/d/0B8VQnqhorb2iWlAyNVMzVlUyQ1k/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "The beautiful supplication of Qunoot recited in Witr prayers, complete with a detailed explanation. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ"
  },
  {
    title: "Mashari Rashid - Dua Qunoot (PDF)",
    url: "https://drive.google.com/file/d/0B8VQnqhorb2ieGpoY1hZSU02Rms/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "The transcribed Dua of Qunoot as recited by Sheikh Mishary Rashid Alafasy in Ramadan. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Transliteration of Selected Duas & Surahs (PDF)",
    url: "https://drive.google.com/file/d/0B8VQnqhorb2iUWxqTE50QVNrbDg/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "Roman transliterations and pronunciations of selected chapters and daily supplications. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Interactive Prophetic Duas and Remembrances (PDF)",
    url: "https://drive.google.com/file/d/1NPlQqeWVpHvUum6pPqeQECMyg44BYbYq/view?usp=sharing",
    type: "PDF",
    suggestedTranslation: "Interactive digital guide featuring authenticated prophetic supplications and daily azkar. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Azkar - Collection (Folder)",
    url: "https://drive.google.com/file/d/12IJnD9DW0_Sbf4QkJ9YipJX6Z3s7zglC/view?usp=sharing",
    type: "Folder Link",
    suggestedTranslation: "A rich collection of daily Azkar (morning, evening, sleeping, and waking) from authentic sources. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Dua for Travelling (Document)",
    url: "https://drive.google.com/file/d/1sEmblsYDDnrkhvtwFyleFvfXOUbYz2rHeNJ0mwZPoPQ/view?usp=sharing",
    type: "Document",
    suggestedTranslation: "Document compiling prophetic travel supplications, etiquettes, and benefits. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Duaas for the Graves and Funerals (Document)",
    url: "https://drive.google.com/file/d/1CRmta1582PTeovge1uRmpHDFfiuu3VRheAfUHGWRCFE/view?usp=sharing",
    type: "Document",
    suggestedTranslation: "A guide detailing standard invocations for burials, funerals, and grave visitations. Reference/Source: Google Drive Dua Directory."
  },
  {
    title: "Invocation for visiting the graves (Document)",
    url: "https://drive.google.com/file/d/1DlLy4L4pTOIacTF9K7mw7Weo29x5WFTTBlCDRF4-QFE/view?usp=sharing",
    type: "Document",
    suggestedTranslation: "The specific prophetic prayer recited when entering a cemetery or visiting graves. Reference/Source: Google Drive Dua Directory.",
    suggestedArabic: "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ"
  },
  {
    title: "General Dua (Document)",
    url: "https://drive.google.com/file/d/102iRaTKsCvv0O5RuvtbET0RHi-AS8J3Zm14A3YsZQR4/view?usp=sharing",
    type: "Document",
    suggestedTranslation: "A comprehensive document detailing guidelines, times of acceptance, and general supplications. Reference/Source: Google Drive Dua Directory."
  }
];

export const sourceOptions = [
  { value: 'drive', label: 'Google Drive Dua Directory' },
  { value: 'quran', label: 'Holy Quran' },
  { value: 'hisnul_muslim', label: 'Hisnul Muslim (Fortress of the Muslim)' },
  { value: 'bukhari', label: 'Sahih al-Bukhari' },
  { value: 'muslim', label: 'Sahih Muslim' },
  { value: 'tirmidhi', label: 'Sunan At-Tirmidhi' },
  { value: 'sunnah', label: 'Prophetic Sunnah' },
  { value: 'personal', label: 'Personal Supplication' },
  { value: 'custom', label: 'Other / Custom Reference' }
];

export const PersonalVoiceAudioPlayer: React.FC<{
  audioUrl: string;
  duration?: number;
  title: string;
}> = ({ audioUrl, duration = 0, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-4 flex flex-col gap-2.5 my-3 shadow-xs">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer flex-shrink-0"
            title={isPlaying ? "Pause voice supplication" : "Play voice supplication"}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Mic size={13} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Personal Voice Recording
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
              {format(currentTime)} / {format(totalDuration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={audioUrl}
            download={`${title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_')}_voice.webm`}
            className="px-2.5 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800"
            title="Download personal voice recording"
          >
            <Download size={12} />
            <span>Audio</span>
          </a>
        </div>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={0}
          max={totalDuration || 1}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-emerald-200/80 dark:bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>
    </div>
  );
};

export const MyDuasSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [savedDuas, setSavedDuas] = useState<SavedDua[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const [activeTagFormId, setActiveTagFormId] = useState<string | null>(null);

  // Voice-to-Text Supplication Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // In-field Speech Dictation State for Custom Form
  const [dictatingField, setDictatingField] = useState<'title' | 'arabic' | 'translation' | null>(null);
  const inlineSpeechRef = useRef<any>(null);

  // New Custom Dua Form State
  const [selectedDuaIndex, setSelectedDuaIndex] = useState<string>('');
  const [selectedSourceOption, setSelectedSourceOption] = useState<string>('drive');
  const [customTitleText, setCustomTitleText] = useState<string>('');
  const [customReferenceText, setCustomReferenceText] = useState<string>('');
  
  const [customArabic, setCustomArabic] = useState<string>('');
  const [customTransliteration, setCustomTransliteration] = useState<string>('');
  const [customTranslation, setCustomTranslation] = useState<string>('');
  const [customTags, setCustomTags] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Clean up inline speech recognition on unmount
  useEffect(() => {
    return () => {
      if (inlineSpeechRef.current) {
        try {
          inlineSpeechRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Toggle inline speech-to-text dictation into specific inputs
  const toggleInlineDictation = (field: 'title' | 'arabic' | 'translation', lang: 'ar-SA' | 'en-US') => {
    if (dictatingField === field) {
      if (inlineSpeechRef.current) {
        try {
          inlineSpeechRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setDictatingField(null);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFormError('Speech recognition is not supported in this browser. Please use the Voice-to-Text Dua Studio or type manually.');
      return;
    }

    try {
      if (inlineSpeechRef.current) {
        try {
          inlineSpeechRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      inlineSpeechRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }

        if (field === 'title') {
          setCustomTitleText(prev => text.trim());
        } else if (field === 'arabic') {
          setCustomArabic(prev => text.trim());
        } else if (field === 'translation') {
          setCustomTranslation(prev => text.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Inline speech error:', event.error);
        setDictatingField(null);
      };

      recognition.onend = () => {
        setDictatingField(null);
      };

      recognition.start();
      setDictatingField(field);
    } catch (err: any) {
      console.error('Error starting inline speech recognition:', err);
      setDictatingField(null);
    }
  };

  // Selector Handlers
  const handleDuaSelect = (val: string) => {
    setSelectedDuaIndex(val);
    if (val === 'custom') {
      setCustomTitleText('');
      setSelectedSourceOption('personal');
      setCustomReferenceText('Personal Supplication');
    } else if (val !== '') {
      const selected = googleDriveDuas[Number(val)];
      setCustomTitleText(selected.title);
      setSelectedSourceOption('drive');
      setCustomReferenceText(selected.url);
      setCustomTranslation(selected.suggestedTranslation);
      if (selected.suggestedArabic) {
        setCustomArabic(selected.suggestedArabic);
      } else {
        setCustomArabic('');
      }
      setCustomTags(`Google Drive, ${selected.type}`);
    } else {
      setCustomTitleText('');
      setCustomArabic('');
      setCustomTranslation('');
      setCustomTags('');
      setSelectedSourceOption('drive');
      setCustomReferenceText('');
    }
  };

  const handleSourceSelect = (val: string) => {
    setSelectedSourceOption(val);
    if (val !== 'custom') {
      if (val === 'drive') {
        if (selectedDuaIndex !== 'custom' && selectedDuaIndex !== '') {
          setCustomReferenceText(googleDriveDuas[Number(selectedDuaIndex)]?.url || 'Google Drive Dua Directory');
        } else {
          setCustomReferenceText('Google Drive Dua Directory');
        }
      } else {
        const matched = sourceOptions.find(o => o.value === val);
        setCustomReferenceText(matched ? matched.label : 'My Personal Supplication');
      }
    } else {
      setCustomReferenceText('');
    }
  };


  // Load saved duas
  useEffect(() => {
    const loadSaved = () => {
      try {
        const stored = localStorage.getItem('my-favorite-duas');
        if (stored) {
          setSavedDuas(JSON.parse(stored));
        } else {
          // Prepopulate empty with nothing but keep a state to show suggestions
          setSavedDuas([]);
        }
      } catch (e) {
        console.error("Failed to load favorite duas:", e);
      }
    };
    loadSaved();

    const handleSync = () => loadSaved();
    window.addEventListener('my-duas-updated', handleSync);
    return () => {
      window.removeEventListener('my-duas-updated', handleSync);
    };
  }, []);

  const saveToStorage = (updatedList: SavedDua[]) => {
    setSavedDuas(updatedList);
    try {
      localStorage.setItem('my-favorite-duas', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('my-duas-updated'));
    } catch (e) {
      console.error("Failed to save to storage:", e);
    }
  };

  // Toggle favorite helper
  const handleToggleFavorite = (item: Omit<SavedDua, 'timestamp' | 'tags'>) => {
    const isSaved = savedDuas.some(d => d.id === item.id);
    if (isSaved) {
      const updated = savedDuas.filter(d => d.id !== item.id);
      saveToStorage(updated);
    } else {
      // Find matching tags in library if exists
      const libraryMatch = libraryDuas.find(ld => ld.id === item.id);
      const defaultTags = libraryMatch ? libraryMatch.tags : ['Favorite'];
      const newItem: SavedDua = {
        ...item,
        tags: defaultTags,
        timestamp: Date.now()
      };
      saveToStorage([...savedDuas, newItem]);
    }
  };

  // Delete a saved Dua
  const handleDeleteDua = (id: string) => {
    const updated = savedDuas.filter(d => d.id !== id);
    saveToStorage(updated);
  };

  // Add custom tag inline
  const handleAddTag = (id: string, newTag: string) => {
    const cleanTag = newTag.trim();
    if (!cleanTag) return;
    
    const updated = savedDuas.map(d => {
      if (d.id === id) {
        if (d.tags.some(t => t.toLowerCase() === cleanTag.toLowerCase())) {
          return d; // already exists
        }
        return {
          ...d,
          tags: [...d.tags, cleanTag]
        };
      }
      return d;
    });
    saveToStorage(updated);
    setTagInputs(prev => ({ ...prev, [id]: '' }));
    setActiveTagFormId(null);
  };

  // Remove tag
  const handleRemoveTag = (id: string, tagToRemove: string) => {
    const updated = savedDuas.map(d => {
      if (d.id === id) {
        return {
          ...d,
          tags: d.tags.filter(t => t !== tagToRemove)
        };
      }
      return d;
    });
    saveToStorage(updated);
  };

  // Create custom user-authored Dua
  const handleCreateCustomDua = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!customTitleText.trim()) {
      setFormError('Please select or enter a title.');
      return;
    }
    if (!customTranslation.trim()) {
      setFormError('Please enter a translation.');
      return;
    }

    const tagArray = customTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Default tag for custom entries
    if (!tagArray.includes('Custom')) {
      tagArray.push('Custom');
    }

    const newCustomDua: SavedDua = {
      id: `custom_${Date.now()}`,
      category: 'custom',
      title: customTitleText.trim(),
      arabicText: customArabic.trim(),
      transliterationText: customTransliteration.trim() || undefined,
      translationText: customTranslation.trim(),
      reference: customReferenceText.trim() || 'My Personal Supplication',
      tags: tagArray,
      timestamp: Date.now()
    };

    saveToStorage([...savedDuas, newCustomDua]);
    
    // Reset Form
    setSelectedDuaIndex('');
    setSelectedSourceOption('drive');
    setCustomTitleText('');
    setCustomReferenceText('');
    setCustomArabic('');
    setCustomTransliteration('');
    setCustomTranslation('');
    setCustomTags('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsAddingCustom(false);
    }, 2000);
  };

  // Get all unique tags from currently saved duas
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    savedDuas.forEach(d => {
      d.tags.forEach(t => tagsSet.add(t));
    });
    return ['All', ...Array.from(tagsSet)];
  }, [savedDuas]);

  // Filter and search
  const filteredSavedDuas = savedDuas.filter(dua => {
    const matchesTag = selectedTag === 'All' || dua.tags.includes(selectedTag);
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      dua.title.toLowerCase().includes(query) ||
      dua.arabicText.includes(query) ||
      (dua.translationText && dua.translationText.toLowerCase().includes(query)) ||
      (dua.transliterationText && dua.transliterationText.toLowerCase().includes(query)) ||
      (dua.reference && dua.reference.toLowerCase().includes(query)) ||
      dua.tags.some(t => t.toLowerCase().includes(query));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search and Filters panel */}
      <div className="bg-white/95 dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FolderHeart className="text-rose-500 fill-rose-500/20" />
              <span>{language === 'ar' ? 'حصن أدعيتي الخاص' : 'My Saved Supplications'}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs sm:text-sm">
              {language === 'ar' 
                ? 'مجموعتك الشخصية من الأدعية المأثورة المنسقة والمصنفة بالوسوم المخصصة.' 
                : 'Organize, play, and read your favorite supplications using customized categories.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer select-none border border-emerald-600/60"
              title="Record and transcribe supplication using microphone"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              <span>{language === 'ar' ? 'تسجيل دعاء صوتي' : 'Voice-to-Text Dua'}</span>
            </button>

            <button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-primary-800 to-primary-700 hover:from-primary-700 hover:to-primary-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer select-none border border-primary-800"
            >
              {isAddingCustom ? <X size={14} /> : <PlusCircle size={14} />}
              <span>{isAddingCustom ? (language === 'ar' ? 'إلغاء' : 'Cancel') : (language === 'ar' ? 'إضافة دعاء يدوي' : 'Create Custom Dua')}</span>
            </button>
          </div>
        </div>

        {/* Custom Supplication Builder Expandable Form */}
        {isAddingCustom && (
          <form 
            onSubmit={handleCreateCustomDua}
            className="bg-slate-50 dark:bg-slate-950 border border-secondary-100 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center gap-2 border-b border-secondary-200 dark:border-slate-800 pb-3 mb-2">
              <Sparkles className="text-accent-500 w-5 h-5 animate-pulse" />
              <h4 className="font-serif font-bold text-slate-800 dark:text-slate-100 text-lg">
                {language === 'ar' ? 'إضافة دعاء مخصص جديد' : 'New Custom Supplication'}
              </h4>
            </div>

            {/* Quick Switch to Voice-to-Text Studio */}
            <div className="bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    {language === 'ar' ? 'هل تفضل التحدث بدعائك بصوتك؟' : 'Prefer to record your supplication by voice?'}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    {language === 'ar' ? 'استخدم استوديو التسجيل الصوتي لتحويل صوتك فوراً إلى نص وحفظ التسجيل الصوتي.' : 'Record your microphone with live speech-to-text transcription and audio playback.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCustom(false);
                  setIsVoiceModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex-shrink-0 shadow-xs"
              >
                <Mic size={13} />
                <span>{language === 'ar' ? 'استوديو الصوت إلى نص' : 'Voice-to-Text Studio'}</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                <Check size={14} />
                <span>Successfully added to your Saved Duas!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'ar' ? 'عنوان الدعاء *' : 'Dua Title *'}
                  </label>
                  {selectedDuaIndex === 'custom' && (
                    <button
                      type="button"
                      onClick={() => toggleInlineDictation('title', language === 'ar' ? 'ar-SA' : 'en-US')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        dictatingField === 'title' 
                          ? 'bg-rose-500 text-white animate-pulse' 
                          : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                      }`}
                      title="Dictate title by voice"
                    >
                      <Mic size={11} className={dictatingField === 'title' ? 'animate-bounce' : ''} />
                      <span>{dictatingField === 'title' ? (language === 'ar' ? 'جار الاستماع...' : 'Listening...') : (language === 'ar' ? 'إملاء' : 'Dictate')}</span>
                    </button>
                  )}
                </div>
                <select
                  required
                  value={selectedDuaIndex}
                  onChange={e => handleDuaSelect(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="">-- Choose a Title / File from Google Drive --</option>
                  {googleDriveDuas.map((dua, idx) => (
                    <option key={idx} value={String(idx)}>
                      {dua.title} ({dua.type})
                    </option>
                  ))}
                  <option value="custom">-- Write Custom Title --</option>
                </select>

                {selectedDuaIndex === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom title"
                    value={customTitleText}
                    onChange={e => setCustomTitleText(e.target.value)}
                    className="w-full mt-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Reference / Source *</label>
                <select
                  required
                  value={selectedSourceOption}
                  onChange={e => handleSourceSelect(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
                >
                  {sourceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {selectedSourceOption === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom source / reference"
                    value={customReferenceText}
                    onChange={e => setCustomReferenceText(e.target.value)}
                    className="w-full mt-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
                  />
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'ar' ? 'النص العربي (اختياري)' : 'Arabic Script (Optional)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleInlineDictation('arabic', 'ar-SA')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      dictatingField === 'arabic'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    <Mic size={12} className={dictatingField === 'arabic' ? 'animate-bounce' : ''} />
                    <span>
                      {dictatingField === 'arabic' 
                        ? (language === 'ar' ? 'جار الاستماع (انقر للإيقاف)' : 'Listening... (Click to stop)') 
                        : (language === 'ar' ? 'إملاء صوتي عربي' : 'Dictate Arabic')}
                    </span>
                  </button>
                </div>
                <textarea
                  placeholder="اللَّهُمَّ..."
                  value={customArabic}
                  onChange={e => setCustomArabic(e.target.value)}
                  dir="rtl"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 font-arabic text-xl text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transliteration (Optional)</label>
                <textarea
                  placeholder="e.g. Allahumma inni as'aluka..."
                  value={customTransliteration}
                  onChange={e => setCustomTransliteration(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 italic text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'ar' ? 'الترجمة / الدعاء الشخصي *' : 'Translation / Supplication *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleInlineDictation('translation', language === 'ar' ? 'ar-SA' : 'en-US')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      dictatingField === 'translation'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    <Mic size={12} className={dictatingField === 'translation' ? 'animate-bounce' : ''} />
                    <span>
                      {dictatingField === 'translation' 
                        ? (language === 'ar' ? 'جار الاستماع (انقر للإيقاف)' : 'Listening... (Click to stop)') 
                        : (language === 'ar' ? 'إملاء صوتي' : 'Dictate Voice')}
                    </span>
                  </button>
                </div>
                <textarea
                  required
                  placeholder="e.g. O Allah, I ask You for beneficial knowledge, peaceful heart..."
                  value={customTranslation}
                  onChange={e => setCustomTranslation(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Custom Tags (comma-separated)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Tag size={13} />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Travel, Morning, Protection, Peace"
                    value={customTags}
                    onChange={e => setCustomTags(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-transparent rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary-800 text-white font-bold text-xs hover:bg-primary-700 transition-all cursor-pointer shadow-sm"
              >
                Save Supplication
              </button>
            </div>
          </form>
        )}

        {/* Search Input and active filters */}
        <div className="pt-2 flex flex-col gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث في أدعيتي المحفوظة...' : 'Search your saved duas...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
            />
          </div>

          {/* Tags cloud filtering */}
          {allTags.length > 1 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                <Filter size={11} />
                Filter by Custom Tag
              </span>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border
                        ${isActive
                          ? 'bg-primary-800 border-primary-800 text-white shadow-sm font-semibold'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'}`}
                    >
                      {tag}
                      {tag !== 'All' && (
                        <span className="ml-1.5 text-[9px] bg-slate-100 dark:bg-slate-800 dark:text-slate-400 text-slate-500 px-1.5 py-0.5 rounded-full">
                          {savedDuas.filter(d => d.tags.includes(tag)).length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid display of saved favorites */}
      {filteredSavedDuas.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredSavedDuas.map((dua) => {
            const isTagFormActive = activeTagFormId === dua.id;
            const currentTagInput = tagInputs[dua.id] || '';
            
            return (
              <div
                key={dua.id}
                className="bg-white dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-primary-50/40 dark:bg-primary-950/10 rounded-bl-full pointer-events-none" />

                <div className="space-y-5">
                  {/* Top Bar inside the Card */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 relative z-10">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-block bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider border border-primary-100/50 dark:border-primary-900/40">
                          {dua.category === 'custom' ? 'Custom Author' : `${dua.category} Library`}
                        </span>
                        {dua.voiceRecordingUrl && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <Mic size={10} className="animate-pulse" />
                            Voice Recording
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-bold font-serif text-slate-800 dark:text-slate-100 pr-8">
                        {dua.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 relative z-20">
                      {/* Unfavorite Heart Button */}
                      <button
                        onClick={() => handleDeleteDua(dua.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all cursor-pointer border border-rose-100/40"
                        title="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-current text-rose-500 animate-pulse" />
                      </button>
                    </div>
                  </div>

                  {/* Personal Recorded Audio Voice Player if present */}
                  {dua.voiceRecordingUrl && (
                    <PersonalVoiceAudioPlayer
                      audioUrl={dua.voiceRecordingUrl}
                      duration={dua.audioDuration}
                      title={dua.title}
                    />
                  )}

                  {/* Dual-Audio Player */}
                  <DuaAudioPlayer
                    arabicText={dua.arabicText}
                    transliterationText={dua.transliterationText}
                    translationText={dua.translationText}
                    title={dua.title}
                  />

                  {/* Tags list & Tagging tools */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag size={13} className="text-slate-400" />
                      
                      {dua.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full border border-slate-150"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(dua.id, tag)}
                            className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                            title={`Remove tag: ${tag}`}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Inline Form Toggle */}
                      {!isTagFormActive ? (
                        <button
                          onClick={() => setActiveTagFormId(dua.id)}
                          className="inline-flex items-center gap-1 bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-full transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          <span>Add Tag</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 animate-in slide-in-from-left-2 duration-200">
                          <input
                            type="text"
                            placeholder="New tag..."
                            value={currentTagInput}
                            onChange={e => setTagInputs(prev => ({ ...prev, [dua.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleAddTag(dua.id, currentTagInput);
                              }
                            }}
                            className="text-xs focus:outline-none w-20 px-1 py-0.5"
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddTag(dua.id, currentTagInput)}
                            className="p-0.5 text-primary-600 hover:text-primary-800"
                          >
                            <Check size={11} />
                          </button>
                          <button
                            onClick={() => setActiveTagFormId(null)}
                            className="p-0.5 text-slate-400 hover:text-slate-600"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}
                    </div>

                    {dua.reference && (
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Source: {dua.reference}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/95 dark:bg-slate-900 border border-secondary-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-rose-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-rose-500 border border-rose-100/30">
            <FolderHeart size={32} className="stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-bold font-serif text-slate-800 dark:text-slate-100">
              {searchQuery || selectedTag !== 'All' ? 'No Matching Saved Duas' : 'Your Supplications Vault is Empty'}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              {searchQuery || selectedTag !== 'All'
                ? 'Try clearing your filters or search query to find other saved supplications.'
                : 'Save your favorite supplications from the existing library or create custom ones with personalized tag tags for quick and easy access.'}
            </p>
          </div>

          {!searchQuery && selectedTag === 'All' && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60">
              <h5 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-center gap-1">
                <Sparkles size={12} className="text-accent-500 animate-spin-slow" />
                Popular Library Duas to Quick Save
              </h5>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {libraryDuas.slice(0, 4).map((item) => {
                  const isSaved = savedDuas.some(d => d.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="border border-slate-150 dark:border-slate-800/80 rounded-xl p-3 text-left hover:border-primary-300 dark:hover:border-primary-800 hover:bg-slate-50/20 transition-colors flex justify-between items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate italic" dir="rtl">{item.arabicText}</p>
                      </div>

                      <button
                        onClick={() => handleToggleFavorite(item)}
                        className={`p-1.5 rounded-lg border flex-shrink-0 transition-all cursor-pointer
                          ${isSaved
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
                        title="Toggle Favorite"
                      >
                        <Heart size={12} className={isSaved ? 'fill-current' : ''} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice-to-Text Recording Studio Modal */}
      <VoiceDuaRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSaveDua={(newDua) => {
          saveToStorage([newDua, ...savedDuas]);
        }}
        initialLanguage={language === 'ar' ? 'ar-SA' : 'en-US'}
      />
    </div>
  );
};
