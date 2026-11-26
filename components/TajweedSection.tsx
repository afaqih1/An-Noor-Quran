import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Volume2, CheckCircle2, XCircle, ArrowRight, BookMarked, Award, HelpCircle, ChevronLeft, ChevronRight, RotateCw, Shuffle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { TTSButton } from './TTSButton';

interface TajweedRuleExample {
  arabic: string;
  transliteration: string;
  translation: string;
  highlightWords: string; // The specific part applying the rule
  note: string;
}

interface TajweedRule {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  letters: string[];
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  examples: TajweedRuleExample[];
}

interface Category {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  rules: TajweedRule[];
}

const TajweedSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('noon-sakinah');
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  
  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showQuizExplanation, setShowQuizExplanation] = useState<boolean>(false);

  // Definition of tajweed rule categories
  const categories: Category[] = [
    {
      id: 'noon-sakinah',
      title: 'Noon Sakinah & Tanween',
      arabicTitle: 'أحكام النون الساكنة والتنوين',
      description: 'Rules governing the static Noon (نْ) or the double vowel sounds (Tanween ً ٍ ٌ) when followed by specific Arabic letters.',
      rules: [
        {
          id: 'izhar',
          name: 'Izhar (Clarity)',
          arabicName: 'الإظهار الحلقي',
          description: 'Pronouncing the Noon sound clearly from its point of articulation without any nasalization (Ghunnah) when followed by one of the six throat letters.',
          letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
          colorClass: 'text-emerald-600 dark:text-emerald-400',
          bgLightClass: 'bg-emerald-500/10 border-emerald-500/20',
          borderClass: 'border-emerald-500',
          examples: [
            {
              arabic: 'عَذَابٌ أَلِيمٌ',
              transliteration: '‘Adhābun ’alīm',
              translation: 'A painful punishment',
              highlightWords: 'عَذَابٌ أَلِيمٌ (Tanween followed by Hamzah / ء)',
              note: 'The "un" Tanween sound at the end of Adhabun is pronounced clearly.'
            },
            {
              arabic: 'مِنْ هَادٍ',
              transliteration: 'Min hādin',
              translation: 'From any guide',
              highlightWords: 'مِنْ هَادٍ (Noon Sakinah followed by Haa / هـ)',
              note: 'The Noon is pronounced clearly before the letter Haa from the throat.'
            },
            {
              arabic: 'أَنْعَمْتَ عَلَيْهِمْ',
              transliteration: 'An‘amta ‘alayhim',
              translation: 'You have bestowed favor upon them',
              highlightWords: 'أَنْعَمْتَ (Noon Sakinah followed by ‘Ayn / ع)',
              note: 'Pronounce the Noon clearly inside the word An‘amta.'
            },
            {
              arabic: 'عَلِيمٌ حَكِيمٌ',
              transliteration: '‘Alīmun ḥakīm',
              translation: 'All-Knowing, All-Wise',
              highlightWords: 'عَلِيمٌ حَكِيمٌ (Tanween followed by Haa / ح)',
              note: 'The "un" sound of the Tanween is pronounced clearly before the Haa.'
            },
            {
              arabic: 'مِنْ غِلٍّ',
              transliteration: 'Min ghillin',
              translation: 'From resentment',
              highlightWords: 'مِنْ غِلٍّ (Noon Sakinah followed by Ghayn / غ)',
              note: 'Pronounce the Noon clearly before the Ghayn without any nasal hold.'
            },
            {
              arabic: 'مِنْ خَوْفٍ',
              transliteration: 'Min khawf',
              translation: 'From fear',
              highlightWords: 'مِنْ خَوْفٍ (Noon Sakinah followed by Khaa / خ)',
              note: 'Pronounce the Noon clearly before the heavy throat letter Khaa.'
            }
          ]
        },
        {
          id: 'idgham',
          name: 'Idgham (Merging)',
          arabicName: 'الإدغام',
          description: 'Merging the static Noon or Tanween into the following letter so they become one doubled letter. Divided into Idgham with Ghunnah (nasal sound, 2 counts) and without Ghunnah.',
          letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
          colorClass: 'text-rose-500 dark:text-rose-400',
          bgLightClass: 'bg-rose-500/10 border-rose-500/20',
          borderClass: 'border-rose-500',
          examples: [
            {
              arabic: 'مَن يَقُولُ',
              transliteration: 'May-yaqūl',
              translation: 'Those who say...',
              highlightWords: 'مَن يَقُولُ (With Ghunnah - Noon merged into Ya / ي)',
              note: 'The Noon is skipped, and you merge into a doubled Ya sound with a 2-count nasal hold.'
            },
            {
              arabic: 'مِّن رَّبِّهِمْ',
              transliteration: 'Mir-rabbihim',
              translation: 'From their Lord',
              highlightWords: 'مِّن رَّبِّهِمْ (Without Ghunnah - Noon merged into Ra / ر)',
              note: 'The Noon is completely merged into the Ra without any nasal sound.'
            },
            {
              arabic: 'مِن مَّاءٍ',
              transliteration: 'Mim-mā’',
              translation: 'From water',
              highlightWords: 'مِن مَّاءٍ (With Ghunnah - Noon merged into Meem / م)',
              note: 'The Noon merges into the Meem with a 2-count nasal sound.'
            },
            {
              arabic: 'أَن لَّمْ يَرَهُ',
              transliteration: 'Al-lam yarahū',
              translation: 'That no one has seen him',
              highlightWords: 'أَن لَّمْ (Without Ghunnah - Noon merged into Lam / ل)',
              note: 'The Noon merges completely into the Lam without any nasal sound.'
            },
            {
              arabic: 'مِن وَالٍ',
              transliteration: 'Miw-wāl',
              translation: 'From any defender',
              highlightWords: 'مِن وَالٍ (With Ghunnah - Noon merged into Waw / و)',
              note: 'The Noon merges into the Waw with a 2-count nasal sound.'
            },
            {
              arabic: 'مِّن نِّعْمَةٍ',
              transliteration: 'Min-ni‘mah',
              translation: 'From favor / blessing',
              highlightWords: 'مِّن نِّعْمَةٍ (With Ghunnah - Noon merged into Noon / ن)',
              note: 'The two Noons merge into one doubled Noon with a 2-count nasal sound.'
            }
          ]
        },
        {
          id: 'iqlab',
          name: 'Iqlab (Conversion)',
          arabicName: 'الإقلاب',
          description: 'Converting the static Noon or Tanween into a light Meem sound (م) when followed immediately by the letter Ba (ب), accompanied by a Ghunnah (nasal sound, 2 counts).',
          letters: ['ب'],
          colorClass: 'text-amber-500 dark:text-amber-400',
          bgLightClass: 'bg-amber-500/10 border-amber-500/20',
          borderClass: 'border-amber-500',
          examples: [
            {
              arabic: 'مِن بَعْدِ',
              transliteration: 'Mim-ba‘di',
              translation: 'After...',
              highlightWords: 'مِن بَعْدِ (Noon converted to Meem before Ba / ب)',
              note: 'Pronounce the Noon as a Meem with light lip contact and a 2-count nasal sound.'
            },
            {
              arabic: 'سَمِيعٌ بَصِيرٌ',
              transliteration: 'Samī‘um-baṣīr',
              translation: 'All-Hearing, All-Seeing',
              highlightWords: 'سَمِيعٌ بَصِيرٌ (Tanween converted to Meem before Ba / ب)',
              note: 'The double dammah Tanween blends into a Meem sound.'
            }
          ]
        },
        {
          id: 'ikhfa',
          name: 'Ikhfa (Hiding)',
          arabicName: 'الإخفاء الحقيقي',
          description: 'Concealing the Noon or Tanween sound between Izhar and Idgham, holding a 2-count Ghunnah while preparing the tongue for the next letter. Applies to the remaining 15 letters.',
          letters: ['ص', 'ذ', 'ث', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ', 'ك'],
          colorClass: 'text-indigo-500 dark:text-indigo-400',
          bgLightClass: 'bg-indigo-500/10 border-indigo-500/20',
          borderClass: 'border-indigo-500',
          examples: [
            {
              arabic: 'عَن صَلَاتِهِمْ',
              transliteration: '‘An ṣalātihim',
              translation: 'Of their prayer',
              highlightWords: 'عَن صَلَاتِهِمْ (Noon hidden before Saad / ص)',
              note: 'Hide the Noon with a heavy Ghunnah (nasal sound) to prepare for the heavy Saad.'
            },
            {
              arabic: 'مِن ذَهَبٍ',
              transliteration: 'Min dhahabin',
              translation: 'Of gold',
              highlightWords: 'مِن ذَهَبٍ (Noon hidden before Thal / ذ)',
              note: 'Hide the Noon with a light Ghunnah, holding for 2 counts.'
            },
            {
              arabic: 'مَاءً ثَجَّاجًا',
              transliteration: 'Mā’an thajjājā',
              translation: 'Abundant water',
              highlightWords: 'مَاءً ثَجَّاجًا (Tanween hidden before Thaa / ث)',
              note: 'Hide the Tanween sound with a light Ghunnah.'
            },
            {
              arabic: 'خَلْقٍ جَدِيدٍ',
              transliteration: 'Khalqin jadīd',
              translation: 'A new creation',
              highlightWords: 'خَلْقٍ جَدِيدٍ (Tanween hidden before Jeem / ج)',
              note: 'Hide the Tanween sound with a 2-count nasal hold.'
            },
            {
              arabic: 'مِن شَرِّ',
              transliteration: 'Min sharri',
              translation: 'From the evil',
              highlightWords: 'مِن شَرِّ (Noon hidden before Sheen / ش)',
              note: 'Hide the Noon sound before Sheen with a light nasal sound.'
            },
            {
              arabic: 'شَيْءٍ قَدِيرٌ',
              transliteration: 'Shay’in-qadīr',
              translation: 'Powerful over everything',
              highlightWords: 'شَيْءٍ قَدِيرٌ (Tanween hidden before Qaf / ق)',
              note: 'Since Qaf is heavy, the Ghunnah is pronounced with a thick, heavy tone.'
            },
            {
              arabic: 'إِنسَانٌ',
              transliteration: 'Insān',
              translation: 'Human being',
              highlightWords: 'إِنسَانٌ (Noon hidden before Seen / س)',
              note: 'Hide the Noon sound with a light Ghunnah inside the word.'
            },
            {
              arabic: 'مِن دُونِ',
              transliteration: 'Min dūni',
              translation: 'Besides...',
              highlightWords: 'مِن دُونِ (Noon hidden before Dal / د)',
              note: 'Hide the Noon with a light Ghunnah.'
            },
            {
              arabic: 'مِن طِينٍ',
              transliteration: 'Min ṭīn',
              translation: 'From clay',
              highlightWords: 'مِن طِينٍ (Noon hidden before Taa / ط)',
              note: 'Pronounce the Ghunnah with a heavy tone because Taa is a heavy letter.'
            },
            {
              arabic: 'أَنزَلْنَا',
              transliteration: 'Anzalnā',
              translation: 'We sent down',
              highlightWords: 'أَنزَلْنَا (Noon hidden before Zay / ز)',
              note: 'Hide the Noon sound inside the word before Zay.'
            },
            {
              arabic: 'أَنفُسَكُمْ',
              transliteration: 'Anfusakum',
              translation: 'Yourselves',
              highlightWords: 'أَنفُسَكُمْ (Noon hidden before Fa / ف)',
              note: 'Hide the Noon with a light Ghunnah while placing the upper teeth near the bottom lip.'
            },
            {
              arabic: 'جَنَّاتٌ تَجْرِي',
              transliteration: 'Jannātun tajrī',
              translation: 'Gardens flowing',
              highlightWords: 'جَنَّاتٌ تَجْرِي (Tanween hidden before Taa / ت)',
              note: 'Hide the Tanween sound with a light, pleasant 2-count Ghunnah.'
            },
            {
              arabic: 'قَوْمًا ضَالِّينَ',
              transliteration: 'Qawman ḍāllīn',
              translation: 'A people astray',
              highlightWords: 'قَوْمًا ضَالِّينَ (Tanween hidden before Daad / ض)',
              note: 'Hide the Tanween with a very heavy nasal tone because Daad is a heavy letter.'
            },
            {
              arabic: 'مَن ظَلَمَ',
              transliteration: 'Man ẓalama',
              translation: 'Whoever did wrong',
              highlightWords: 'مَن ظَلَمَ (Noon hidden before Zhaa / ظ)',
              note: 'Use a heavy Ghunnah nasal sound since Zhaa is a thick, heavy letter.'
            },
            {
              arabic: 'مِن كُلِّ',
              transliteration: 'Min kulli',
              translation: 'From every / of all',
              highlightWords: 'مِن كُلِّ (Noon hidden before Kaf / ك)',
              note: 'Hide the Noon with a light Ghunnah before the light letter Kaf.'
            }
          ]
        }
      ]
    },
    {
      id: 'meem-sakinah',
      title: 'Meem Sakinah',
      arabicTitle: 'أحكام الميم الساكنة',
      description: 'Rules governing the static Meem (مْ) when followed by other Arabic letters.',
      rules: [
        {
          id: 'ikhfa-shafawi',
          name: 'Ikhfa Shafawi (Oral Hiding)',
          arabicName: 'الإخفاء الشفوي',
          description: 'Hiding the static Meem by pronouncing it with a nasal sound (Ghunnah) when followed immediately by the letter Ba (ب).',
          letters: ['ب'],
          colorClass: 'text-teal-500 dark:text-teal-400',
          bgLightClass: 'bg-teal-500/10 border-teal-500/20',
          borderClass: 'border-teal-500',
          examples: [
            {
              arabic: 'تَرْمِيهِم بِحِجَارَةٍ',
              transliteration: 'Tarmīhim-bi-ḥijārah',
              translation: 'Striking them with stones...',
              highlightWords: 'تَرْمِيهِم بِحِجَارَةٍ (Meem followed by Ba / ب)',
              note: 'Hold the Meem with a nasal sound for 2 counts while lightly touching the lips together.'
            }
          ]
        },
        {
          id: 'idgham-shafawi',
          name: 'Idgham Shafawi (Oral Merging)',
          arabicName: 'الإدغام الشفوي',
          description: 'Merging the static Meem into a following vocalized Meem (م) with a full Ghunnah of 2 counts.',
          letters: ['م'],
          colorClass: 'text-violet-500 dark:text-violet-400',
          bgLightClass: 'bg-violet-500/10 border-violet-500/20',
          borderClass: 'border-violet-500',
          examples: [
            {
              arabic: 'فِي قُلُوبِهِم مَّرَضٌ',
              transliteration: 'Fī qulūbihim-maraḍ',
              translation: 'In their hearts is a disease...',
              highlightWords: 'قُلُوبِهِم مَّرَضٌ (Meem merged into Meem / م)',
              note: 'Merge the two Meems into a single doubled Meem with a clear 2-count nasal hold.'
            }
          ]
        },
        {
          id: 'izhar-shafawi',
          name: 'Izhar Shafawi (Oral Clarity)',
          arabicName: 'الإظهار الشفوي',
          description: 'Pronouncing the static Meem clearly without any extra nasalization when followed by any of the remaining 26 letters.',
          letters: ['All except ب, م'],
          colorClass: 'text-sky-500 dark:text-sky-400',
          bgLightClass: 'bg-sky-500/10 border-sky-500/20',
          borderClass: 'border-sky-500',
          examples: [
            {
              arabic: 'أَلَمْ تَرَ',
              transliteration: 'Alam tara',
              translation: 'Have you not seen...',
              highlightWords: 'أَلَمْ تَرَ (Meem followed by Ta / ت)',
              note: 'The Meem is pronounced clearly and sharply without any extra holding.'
            },
            {
              arabic: 'عَلَيْهِمْ وَلَا',
              transliteration: '‘Alayhim walā',
              translation: 'Upon them, nor...',
              highlightWords: 'عَلَيْهِمْ وَلَا (Meem followed by Waw / و)',
              note: 'Be extra careful to pronounce the Meem clearly here without hiding it, as both Meem and Waw share the lips.'
            },
            {
              arabic: 'هُمْ فِيهَا',
              transliteration: 'Hum fīhā',
              translation: 'They are therein...',
              highlightWords: 'هُمْ فِيهَا (Meem followed by Fa / ف)',
              note: 'Pronounce Meem clearly; be careful not to let it hide into the Fa.'
            }
          ]
        }
      ]
    },
    {
      id: 'qalqalah',
      title: 'Qalqalah (Echoing)',
      arabicTitle: 'أحكام القلقلة',
      description: 'Creating an echoing, bouncing, or vibrating consonant sound when pronouncing one of the five Qalqalah letters when they carry a Sukoon (نْ) or when stopping on them.',
      rules: [
        {
          id: 'qalqalah-letters',
          name: 'Qalqalah (Qutb Jadin)',
          arabicName: 'حروف القلقلة',
          description: 'Divided into Qalqalah Sughra (Minor - inside a word) and Qalqalah Kubra (Major - at the end of a verse/stop).',
          letters: ['ق', 'ط', 'ب', 'ج', 'د'],
          colorClass: 'text-cyan-500 dark:text-cyan-400',
          bgLightClass: 'bg-cyan-500/10 border-cyan-500/20',
          borderClass: 'border-cyan-500',
          examples: [
            {
              arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
              transliteration: 'Bi-rabbi-l-falaq',
              translation: 'Say, "I seek refuge in the Lord of the daybreak..."',
              highlightWords: 'الْفَلَقِ (Major Qalqalah when stopping on Qaf / ق)',
              note: 'Since we stop on Al-Falaqi, the Qaf receives an active sukoon and is recited with a strong bouncing echo.'
            },
            {
              arabic: 'مِن نُّطْفَةٍ',
              transliteration: 'Min nuṭfah',
              translation: 'From a drop of fluid',
              highlightWords: 'نُّطْفَةٍ (Minor Qalqalah on Taa / ط)',
              note: 'A quick, clean bouncing sound on Taa with Sukoon in the middle of a word.'
            },
            {
              arabic: 'لَقَدْ كَتَبْنَا',
              transliteration: 'Laqad katabnā',
              translation: 'We have written',
              highlightWords: 'كَتَبْنَا (Minor Qalqalah on Ba / ب)',
              note: 'Quick bouncing echo on the Ba since it has a Sukoon in the middle of the word.'
            },
            {
              arabic: 'يَجْعَلُونَ أَصَابِعَهُمْ',
              transliteration: 'Yaj‘alūna aṣābi‘ahum',
              translation: 'They put their fingers...',
              highlightWords: 'يَجْعَلُونَ (Minor Qalqalah on Jeem / ج)',
              note: 'The Jeem is in the middle of the word with a sukoon, so it receives a quick, light bouncing sound.'
            },
            {
              arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
              transliteration: 'Qul huwa-llāhu ’aḥad',
              translation: 'Say, "He is Allah, [who is] One"',
              highlightWords: 'أَحَدٌ (Major Qalqalah on Dal / د when stopping)',
              note: 'Pronounced with a strong bouncing echo "Ahad(d)".'
            }
          ]
        }
      ]
    },
    {
      id: 'mudood',
      title: 'Al-Mudood (Prolongation)',
      arabicTitle: 'أحكام المدود',
      description: 'Prolongation of the vowel sounds using the three Madd letters (Alif preceded by Fathah, Waw preceded by Dammah, Ya preceded by Kasrah).',
      rules: [
        {
          id: 'madd-tabee',
          name: 'Madd Al-Tabe’ee (Natural)',
          arabicName: 'المد الطبيعي',
          description: 'The standard, original prolongation of 2 counts that occurs whenever a Madd letter appears without a Hamzah or Sukoon following it.',
          letters: ['ا', 'و', 'ي'],
          colorClass: 'text-amber-600 dark:text-amber-400',
          bgLightClass: 'bg-amber-500/5 border-amber-500/20',
          borderClass: 'border-amber-400',
          examples: [
            {
              arabic: 'قَالَ',
              transliteration: 'Qāla',
              translation: 'He said',
              highlightWords: 'قَالَ (Natural Alif / ا preceded by Fathah)',
              note: 'Prolong the Alif naturally for exactly 2 counts.'
            },
            {
              arabic: 'يَقُولُ',
              transliteration: 'Yaqūlu',
              translation: 'He says',
              highlightWords: 'يَقُولُ (Natural Waw / و preceded by Dammah)',
              note: 'Prolong the Waw sound naturally for exactly 2 counts.'
            },
            {
              arabic: 'قِيلَ',
              transliteration: 'Qīla',
              translation: 'It was said',
              highlightWords: 'قِيلَ (Natural Ya / ي preceded by Kasrah)',
              note: 'Prolong the Ya sound naturally for exactly 2 counts.'
            }
          ]
        },
        {
          id: 'madd-muttasil',
          name: 'Madd Al-Muttasil (Mandatory)',
          arabicName: 'المد المتصل',
          description: 'When a Madd letter is followed by a Hamzah (ء) in the SAME word. It is mandatory to prolong this vowel for 4 or 5 counts.',
          letters: ['Madd + Hamzah (same word)'],
          colorClass: 'text-fuchsia-600 dark:text-fuchsia-400',
          bgLightClass: 'bg-fuchsia-500/10 border-fuchsia-500/20',
          borderClass: 'border-fuchsia-500',
          examples: [
            {
              arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ',
              transliteration: 'Idhā jā’a naṣru-llāh',
              translation: 'When the victory of Allah has come...',
              highlightWords: 'جَاءَ (Alif followed by Hamzah in the same word)',
              note: 'Hold the "jaa" sound for 4 to 5 full counts, making it distinctly longer than normal.'
            }
          ]
        },
        {
          id: 'madd-munfasil',
          name: 'Madd Al-Munfasil (Permissible)',
          arabicName: 'المد المنفصل',
          description: 'When a Madd letter is at the end of a word, and the next word starts with a Hamzah. It can be prolonged for 2, 4, or 5 counts.',
          letters: ['Madd + Hamzah (separate words)'],
          colorClass: 'text-purple-500 dark:text-purple-400',
          bgLightClass: 'bg-purple-500/10 border-purple-500/20',
          borderClass: 'border-purple-500',
          examples: [
            {
              arabic: 'إِنَّا أَعْطَيْنَاكَ',
              transliteration: 'Innā ’a‘ṭaynāk',
              translation: 'Indeed, We have granted you...',
              highlightWords: 'إِنَّا أَعْطَيْنَاكَ (Madd at end, Hamzah at start)',
              note: 'The "naa" vowel ends the first word, and "a\'tayna" starts with Hamzah. Typically held for 4 counts.'
            }
          ]
        }
      ]
    }
  ];

  // Interactive Quiz questions to test rules!
  const quizQuestions = [
    {
      phrase: 'مِن بَعْدِ',
      transliteration: 'Mim-ba‘di',
      options: [
        { label: 'Izhar (Clarity)', isCorrect: false },
        { label: 'Idgham (Merging)', isCorrect: false },
        { label: 'Iqlab (Conversion)', isCorrect: true },
        { label: 'Ikhfa (Hiding)', isCorrect: false }
      ],
      explanation: 'This is Iqlab because the Noon Sakinah (نْ) is followed immediately by the letter Ba (ب). The Noon converts into a Meem sound with Ghunnah.'
    },
    {
      phrase: 'مَنْ عَمِلَ',
      transliteration: 'Man ‘amila',
      options: [
        { label: 'Izhar (Clarity)', isCorrect: true },
        { label: 'Idgham (Merging)', isCorrect: false },
        { label: 'Iqlab (Conversion)', isCorrect: false },
        { label: 'Ikhfa (Hiding)', isCorrect: false }
      ],
      explanation: 'This is Izhar because the Noon Sakinah (نْ) is followed immediately by ‘Ayn (ع), which is one of the six throat letters.'
    },
    {
      phrase: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      transliteration: 'Al-Falaq',
      options: [
        { label: 'Iqlab', isCorrect: false },
        { label: 'Qalqalah (Echoing)', isCorrect: true },
        { label: 'Izhar Shafawi', isCorrect: false },
        { label: 'Madd Muttasil', isCorrect: false }
      ],
      explanation: 'This is Qalqalah Kubra (Major Echoing) because we stop on the letter Qaf (ق), which is one of the letters of Qutb Jadin (ق ط ب ج د).'
    },
    {
      phrase: 'مَن يَقُولُ',
      transliteration: 'May-yaqūl',
      options: [
        { label: 'Izhar Halyi', isCorrect: false },
        { label: 'Idgham with Ghunnah', isCorrect: true },
        { label: 'Iqlab', isCorrect: false },
        { label: 'Ikhfa Shafawi', isCorrect: false }
      ],
      explanation: 'This is Idgham with Ghunnah because the Noon Sakinah is followed by Ya (ي), one of the letters of Yarmaloon (ي ن م و).'
    },
    {
      phrase: 'إِذَا جَاءَ نَصْرُ اللَّهِ',
      transliteration: 'Idhā jā’a',
      options: [
        { label: 'Madd Al-Tabe’ee', isCorrect: false },
        { label: 'Madd Al-Munfasil', isCorrect: false },
        { label: 'Madd Al-Muttasil (Mandatory)', isCorrect: true },
        { label: 'Izhar Shafawi', isCorrect: false }
      ],
      explanation: 'This is Madd Al-Muttasil (Mandatory Prolongation) because the Madd letter Alif (ا) and the Hamzah (ء) occur within the same word (جَاءَ).'
    }
  ];

  const handleAnswerSelect = (optionLabel: string, isCorrect: boolean) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers
    setSelectedAnswer(optionLabel);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setShowQuizExplanation(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowQuizExplanation(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowQuizExplanation(false);
  };

  // Flashcards state
  const [studyMode, setStudyMode] = useState<'guide' | 'flashcards'>('guide');
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Initialize and update flashcards list
  useEffect(() => {
    const flatRules = categories.flatMap(cat => 
      cat.rules.map(rule => ({
        ...rule,
        categoryTitle: language === 'ar' ? cat.arabicTitle : cat.title,
        categoryDesc: cat.description
      }))
    );
    setFlashcards(flatRules);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setIsShuffled(false);
  }, [language]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx(prev => (prev + 1) % flatRulesLength);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx(prev => (prev - 1 + flatRulesLength) % flatRulesLength);
    }, 150);
  };

  const flatRulesLength = categories.flatMap(cat => cat.rules).length || 11;

  const handleShuffle = () => {
    if (isShuffled) {
      const flatRules = categories.flatMap(cat => 
        cat.rules.map(rule => ({
          ...rule,
          categoryTitle: language === 'ar' ? cat.arabicTitle : cat.title,
          categoryDesc: cat.description
        }))
      );
      setFlashcards(flatRules);
      setIsShuffled(false);
    } else {
      setFlashcards(prev => [...prev].sort(() => Math.random() - 0.5));
      setIsShuffled(true);
    }
    setCurrentCardIdx(0);
    setIsFlipped(false);
  };

  // Keyboard navigation for flashcards
  useEffect(() => {
    if (studyMode !== 'flashcards' || flashcards.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIdx(prev => (prev + 1) % flashcards.length);
        }, 150);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIdx(prev => (prev - 1 + flashcards.length) % flashcards.length);
        }, 150);
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studyMode, flashcards.length, currentCardIdx]);

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  // Helper to color code certain letters in Arabic examples
  const highlightExampleArabic = (arabic: string, ruleId: string) => {
    // Basic formatting for visualization
    if (ruleId === 'iqlab') {
      return (
        <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">
          {arabic.replace('ن', 'نْ').replace('ً', 'ً م').split(' ').map((word, idx) => {
            if (word.includes('ب')) {
              return <span key={idx} className="text-amber-500 font-bold">{word} </span>;
            }
            return word + ' ';
          })}
        </span>
      );
    }
    if (ruleId === 'izhar') {
      return (
        <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">
          <span className="text-emerald-500 font-bold">{arabic}</span>
        </span>
      );
    }
    if (ruleId === 'idgham') {
      return (
        <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">
          <span className="text-rose-500 font-bold">{arabic}</span>
        </span>
      );
    }
    if (ruleId === 'ikhfa' || ruleId === 'ikhfa-shafawi') {
      return (
        <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">
          <span className="text-indigo-500 font-bold">{arabic}</span>
        </span>
      );
    }
    if (ruleId === 'qalqalah-letters') {
      return (
        <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">
          <span className="text-cyan-500 font-bold">{arabic}</span>
        </span>
      );
    }
    return <span className="font-arabic tracking-wide select-all text-slate-800 dark:text-white">{arabic}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Description */}
      <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white p-6 sm:p-8 rounded-2xl border border-secondary-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookMarked size={120} className="text-secondary-400" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary-500/20 border border-secondary-400/30 rounded-full w-fit">
          <Sparkles size={14} className="text-secondary-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-secondary-200">Tajweed Science</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-secondary-50 mt-4">
          {language === 'ar' ? 'أحكام التجويد التفاعلية' : 'Interactive Tajweed Rules'}
        </h2>
        <p className="text-primary-100 mt-2 max-w-2xl leading-relaxed text-sm sm:text-base">
          {language === 'ar' 
            ? 'دليل مرجعي ميسر لتعلم نطق الكلمات القرآنية بالشكل الصحيح والسليم، مجهزاً بأمثلة ملونة تفاعلية واختبارات قياس سرعة الفهم.' 
            : 'Explore this easy-to-use reference companion to perfect your Quranic recitation. Features clear breakdowns, color-coded examples, and interactive knowledge checks.'}
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setStudyMode('guide')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap px-4 cursor-pointer select-none ${
            studyMode === 'guide'
              ? 'border-primary-600 text-primary-700 dark:border-secondary-500 dark:text-secondary-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={16} />
          <span>{language === 'ar' ? 'دليل الأحكام والاختبار' : 'Rules Guide & Quiz'}</span>
        </button>
        <button
          onClick={() => setStudyMode('flashcards')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap px-4 cursor-pointer select-none ${
            studyMode === 'flashcards'
              ? 'border-primary-600 text-primary-700 dark:border-secondary-500 dark:text-secondary-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles size={16} />
          <span>{language === 'ar' ? 'البطاقات التعليمية التفاعلية' : 'Interactive Flashcards'}</span>
        </button>
      </div>

      {studyMode === 'guide' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Category selector and Rule lists */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-secondary-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <BookOpen size={12} className="text-primary-500" />
                <span>{language === 'ar' ? 'أقسام الأحكام' : 'Rule Categories'}</span>
              </h3>
              
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedRuleId(null);
                    }}
                    className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all text-left cursor-pointer select-none
                      ${activeCategory === cat.id
                        ? 'bg-primary-900 text-white ring-1 ring-secondary-400/30 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                      {language === 'ar' ? cat.arabicTitle : cat.title}
                    </span>
                    <span className="text-[11px] leading-snug opacity-90 mt-0.5 line-clamp-1">
                      {cat.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Rules Highlight Helper Box */}
            <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-secondary-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'دليل الألوان القياسي' : 'Recitation Color Codes'}
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-[10px] font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Izhar (Clarity)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500" />
                  <span className="text-slate-600 dark:text-slate-400">Idgham (Merging)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400">Iqlab (Conversion)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500" />
                  <span className="text-slate-600 dark:text-slate-400">Ikhfa (Hiding)</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <span className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-500" />
                  <span className="text-slate-600 dark:text-slate-400">Qalqalah (Echo Sound)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle/Right Column: Display rules inside chosen category and examples */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-secondary-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white">
                  {language === 'ar' ? currentCategoryObj.arabicTitle : currentCategoryObj.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {currentCategoryObj.description}
                </p>
              </div>

              {/* Individual Rule breakdowns inside the category */}
              <div className="space-y-4">
                {currentCategoryObj.rules.map((rule) => {
                  const isSelected = selectedRuleId === rule.id;
                  return (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${rule.bgLightClass} ${isSelected ? rule.borderClass + ' ring-1 ' + rule.borderClass : 'border-slate-150 dark:border-slate-800/60'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className={`text-base font-bold ${rule.colorClass}`}>
                              {rule.name}
                            </h4>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-medium">
                              {rule.arabicName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                            {rule.description}
                          </p>
                          
                          {/* Letters list */}
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Applies to:</span>
                            {rule.letters.map((letter, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-0.5 rounded-lg font-bold border ${isSelected ? 'bg-white dark:bg-slate-900 border-current font-extrabold' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'} ${rule.colorClass}`}
                              >
                                {letter}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedRuleId(isSelected ? null : rule.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                            ${isSelected 
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
                              : 'bg-primary-900 text-white hover:bg-primary-800'}`}
                        >
                          {isSelected ? (language === 'ar' ? 'إخفاء الأمثلة' : 'Hide Examples') : (language === 'ar' ? 'عرض الأمثلة' : 'Show Examples')}
                        </button>
                      </div>

                      {/* Expandable interactive examples with color coding */}
                      {isSelected && (
                        <div className="mt-5 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800/60 space-y-4 animate-in slide-in-from-top-3 duration-300">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {language === 'ar' ? 'أمثلة توضيحية ونطق' : 'Visual Pronunciation Examples'}
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rule.examples.map((ex, idx) => (
                              <div
                                key={idx}
                                className="bg-white/90 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-100 dark:border-slate-900 flex flex-col justify-between"
                              >
                                <div className="flex items-center justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <TTSButton text={ex.arabic} lang="ar" className="h-6 w-6 p-1 rounded-lg" />
                                    <TTSButton text={ex.translation} lang="en" className="h-6 w-6 p-1 rounded-lg" />
                                  </div>
                                  <div className="text-right">
                                    {highlightExampleArabic(ex.arabic, rule.id)}
                                  </div>
                                </div>
                                
                                <div className="space-y-1 text-left">
                                  <p className="text-[11px] text-slate-400 font-mono italic">
                                    {ex.transliteration}
                                  </p>
                                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    "{ex.translation}"
                                  </p>
                                  <p className="text-[10px] text-primary-600 dark:text-secondary-400 font-bold bg-primary-50 dark:bg-slate-900 px-2 py-0.5 rounded w-fit mt-1.5">
                                    {ex.highlightWords}
                                  </p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1">
                                    {ex.note}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Learning and Quiz Section */}
            <div className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white p-6 rounded-2xl border border-primary-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <HelpCircle size={150} />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-secondary-500/20 border border-secondary-400/30 rounded-lg text-secondary-400">
                  <Award size={16} />
                </div>
                <h3 className="text-lg font-bold font-serif text-secondary-200">
                  {language === 'ar' ? 'اختبر معلوماتك في التجويد' : 'Quick Tajweed Quiz'}
                </h3>
              </div>

              {!quizCompleted ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span className="font-semibold tracking-wider uppercase">
                      Question {quizIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="font-bold bg-secondary-500/20 text-secondary-300 px-2.5 py-0.5 rounded-full">
                      Score: {quizScore} / {quizQuestions.length}
                    </span>
                  </div>

                  <div className="bg-slate-950/45 border border-primary-800/60 p-5 rounded-xl text-center space-y-2 relative">
                    <div className="absolute top-2.5 right-2.5">
                      <TTSButton text={quizQuestions[quizIndex].phrase} lang="ar" className="bg-slate-900 border-slate-800 text-slate-300 h-7 w-7" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-serif text-white font-bold tracking-wider py-1 select-all font-arabic">
                      {quizQuestions[quizIndex].phrase}
                    </p>
                    <p className="text-xs text-slate-400 font-mono italic">
                      {quizQuestions[quizIndex].transliteration}
                    </p>
                    <p className="text-xs text-secondary-400 font-semibold uppercase mt-2">
                      What Tajweed rule is applied in the phrase above?
                    </p>
                  </div>

                  {/* Multiple choice options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizQuestions[quizIndex].options.map((option, idx) => {
                      const isSelected = selectedAnswer === option.label;
                      const showsAnswer = selectedAnswer !== null;
                      const isCorrect = option.isCorrect;

                      let btnStyle = 'bg-primary-900/30 border-primary-800/80 text-slate-100 hover:bg-primary-800/50 hover:border-primary-600';
                      if (isSelected) {
                        btnStyle = isCorrect 
                          ? 'bg-emerald-500 border-emerald-500 text-white font-bold ring-2 ring-emerald-400/40' 
                          : 'bg-rose-500 border-rose-500 text-white font-bold ring-2 ring-rose-400/40';
                      } else if (showsAnswer && isCorrect) {
                        btnStyle = 'bg-emerald-500/30 border-emerald-500 text-emerald-300 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={showsAnswer}
                          onClick={() => handleAnswerSelect(option.label, option.isCorrect)}
                          className={`w-full p-3.5 text-xs sm:text-sm text-left rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${btnStyle}`}
                        >
                          <span>{option.label}</span>
                          {showsAnswer && isCorrect && (
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle size={16} className="text-white flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Question explanation after answering */}
                  {showQuizExplanation && (
                    <div className="p-4 bg-primary-950/80 border border-primary-800 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                      <p className="text-xs font-bold uppercase tracking-wider text-secondary-400">
                        Rule Explanation:
                      </p>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {quizQuestions[quizIndex].explanation}
                      </p>
                      
                      <button
                        onClick={handleNextQuiz}
                        className="mt-2 group flex items-center gap-1.5 px-3 py-1.5 bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-[11px] font-bold rounded-lg transition-colors cursor-pointer select-none"
                      >
                        <span>
                          {quizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </span>
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex p-3 bg-secondary-500/20 rounded-full border border-secondary-400 animate-bounce">
                    <Award size={36} className="text-secondary-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-bold text-white">Quiz Completed!</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      You scored <span className="font-bold text-secondary-300 text-sm">{quizScore}</span> out of <span className="font-bold text-white text-sm">{quizQuestions.length}</span> questions.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                      {quizScore === quizQuestions.length 
                        ? 'Mashallah! You have a perfect understanding of these basic Tajweed rules. Keep practicing your beautiful recitations!'
                        : 'Alhamdulillah! A wonderful effort. Review the rules and examples above, then try again to get a perfect score.'}
                    </p>
                  </div>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-secondary-500 hover:bg-secondary-400 text-primary-950 text-xs font-bold rounded-xl transition-all cursor-pointer select-none"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Flashcards Study Deck View */
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-sm space-y-8 max-w-4xl mx-auto">
          {/* Header row: Status, instructions, and Shuffle button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles size={20} className="text-secondary-500 animate-pulse" />
                <span>{language === 'ar' ? 'بطاقات أحكام التجويد التفاعلية' : 'Tajweed Rule Flashcards'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'ar'
                  ? 'اضغط على البطاقة لقلبها واكتشاف تفاصيل الحكم وتطبيقاته العملية بالصوت.'
                  : 'Tap the card to flip and reveal the rule definition, applies-to letters, and vocalized examples.'}
              </p>
            </div>
            
            <button
              onClick={handleShuffle}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none
                ${isShuffled 
                  ? 'bg-secondary-500/10 border-secondary-500/30 text-secondary-600 dark:text-secondary-400' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Shuffle size={14} className={isShuffled ? 'animate-spin' : ''} />
              <span>{isShuffled ? (language === 'ar' ? 'إلغاء الترتيب العشوائي' : 'Reset Order') : (language === 'ar' ? 'ترتيب عشوائي' : 'Shuffle Deck')}</span>
            </button>
          </div>

          {/* Progress bar */}
          {flashcards.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
                <span>Progress</span>
                <span>{currentCardIdx + 1} of {flashcards.length} Rules Studied</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 dark:bg-secondary-500 transition-all duration-305"
                  style={{ width: `${((currentCardIdx + 1) / flashcards.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Flashcard Component */}
          {flashcards.length > 0 && flashcards[currentCardIdx] && (
            <div className="flex flex-col items-center space-y-6">
              {/* Keyboard shortcuts tip */}
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
                {language === 'ar'
                  ? 'تلميح: استخدم الأسهم (يسار / يمين) للتنقل، والمساحة (Space) لقلب البطاقة.'
                  : 'Tip: Use Left / Right arrow keys to navigate, Space to flip.'}
              </p>

              {/* Card container with perspective */}
              <div className="w-full max-w-lg h-[430px] [perspective:1000px] cursor-pointer relative group">
                {/* 3D Flip Card */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  {/* FRONT of the card */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 border border-secondary-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between select-none">
                    {/* Top Row: Category and standard icon */}
                    <div className="flex justify-between items-start gap-4">
                      <span className="px-3 py-1 bg-primary-50 dark:bg-slate-850 text-[10px] font-bold text-primary-700 dark:text-secondary-400 rounded-full border border-primary-100/30">
                        {flashcards[currentCardIdx].categoryTitle}
                      </span>
                      <BookMarked size={18} className="text-slate-300 dark:text-slate-700" />
                    </div>

                    {/* Middle: Title in English & Arabic */}
                    <div className="text-center space-y-4 py-4">
                      <h4 className={`text-2xl sm:text-3xl font-extrabold font-sans tracking-tight ${flashcards[currentCardIdx].colorClass}`}>
                        {flashcards[currentCardIdx].name}
                      </h4>
                      <div className="flex justify-center">
                        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                          <p className="font-arabic text-3xl sm:text-4xl text-slate-800 dark:text-white leading-normal font-bold">
                            {flashcards[currentCardIdx].arabicName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Applies to and interactive prompt */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap justify-center items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Letters:</span>
                        {flashcards[currentCardIdx].letters.map((letter: string, idx: number) => (
                          <span 
                            key={idx}
                            className={`text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 font-extrabold ${flashcards[currentCardIdx].colorClass}`}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-center items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 animate-pulse font-medium border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <RotateCw size={12} />
                        <span>{language === 'ar' ? 'انقر على البطاقة لمعرفة التعريف والتفاصيل' : 'Click to flip & reveal rule definition'}</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK of the card */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-950 text-white border border-primary-800 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between overflow-y-auto select-none">
                    {/* Top Row: Context header */}
                    <div className="flex justify-between items-center gap-4 border-b border-primary-900/60 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {flashcards[currentCardIdx].name}
                      </span>
                      <span className="text-[10px] font-bold text-secondary-400">
                        {flashcards[currentCardIdx].categoryTitle}
                      </span>
                    </div>

                    {/* Body: Definition, letters, and Examples list */}
                    <div className="space-y-5 py-4 flex-1 text-left">
                      {/* Description */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-secondary-500">Definition</span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                          {flashcards[currentCardIdx].description}
                        </p>
                      </div>

                      {/* Letters rule applies to */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-extrabold tracking-widest text-secondary-500">Applies to Letters</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {flashcards[currentCardIdx].letters.map((letter: string, idx: number) => (
                            <span 
                              key={idx}
                              className={`text-xs px-2.5 py-1 rounded bg-primary-950 border border-primary-800 font-bold ${flashcards[currentCardIdx].colorClass}`}
                            >
                              {letter}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Examples */}
                      {flashcards[currentCardIdx].examples && flashcards[currentCardIdx].examples.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-secondary-500 block">Example Demonstration</span>
                          {flashcards[currentCardIdx].examples.slice(0, 1).map((ex: any, idx: number) => (
                            <div key={idx} className="bg-primary-900/40 border border-primary-800/50 p-3.5 rounded-xl space-y-2 relative" onClick={(e) => e.stopPropagation()}>
                              <div className="absolute top-3.5 right-3.5">
                                <TTSButton text={ex.arabic} lang="ar" className="bg-primary-950 border-primary-800 text-slate-300 h-7 w-7" />
                              </div>
                              <div className="pr-12">
                                {highlightExampleArabic(ex.arabic, flashcards[currentCardIdx].id)}
                              </div>
                              <div className="space-y-0.5 text-left border-t border-primary-900/50 pt-2 mt-2">
                                <p className="text-[10px] text-slate-400 font-mono italic">{ex.transliteration}</p>
                                <p className="text-xs font-semibold text-slate-200">"{ex.translation}"</p>
                                <p className="text-[10px] text-secondary-400 font-bold mt-1">{ex.highlightWords}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom: flip back hint */}
                    <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-500 font-semibold border-t border-primary-900/60 pt-3">
                      <RotateCw size={10} />
                      <span>{language === 'ar' ? 'انقر لقلب البطاقة مجدداً' : 'Click to flip back'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Next / Prev / Flip */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevCard}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700 cursor-pointer select-none"
                  title="Previous Card"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer select-none animate-pulse"
                >
                  <RotateCw size={14} />
                  <span>{language === 'ar' ? 'اقلب البطاقة' : 'Flip Card'}</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700 cursor-pointer select-none"
                  title="Next Card"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Jump List Buttons (Small indicators to click and jump directly) */}
              <div className="flex flex-wrap justify-center items-center gap-2 max-w-xl">
                {flashcards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      setIsFlipped(false);
                      setTimeout(() => {
                        setCurrentCardIdx(idx);
                      }, 150);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer select-none
                      ${currentCardIdx === idx 
                        ? 'bg-primary-900 text-white ring-1 ring-secondary-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TajweedSection;
