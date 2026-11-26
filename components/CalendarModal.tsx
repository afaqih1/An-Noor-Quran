import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Moon, Sun, Info } from 'lucide-react';
import { useLanguage, Language } from './LanguageContext';
import { toEthiopian, toGregorian } from 'ethiopian-date';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'gregorian' | 'hijri' | 'ethiopian';
}

export interface HijriParts {
  day: number;
  monthIndex: number; // 0-based
  year: number;
}

const weekdays: Record<Language, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  am: ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"],
  har: ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"]
};

const weekdaysShort: Record<Language, string[]> = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  ar: ["أحد", "إثن", "ثلا", "ارب", "خمي", "جمع", "سبت"],
  am: ["እ", "ሰ", "ማ", "ረ", "ሐ", "አ", "ቅ"],
  har: ["እ", "ሰ", "ማ", "ረ", "ሐ", "አ", "ቅ"]
};

const gregMonthNames: Record<Language, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  ar: [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ],
  am: [
    "ጃንዋሪ", "ፌብሩዋሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን",
    "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር"
  ],
  har: [
    "ጃንዋሪ", "ፌብሩዋሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን",
    "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር"
  ]
};

const hijriMonths: Record<Language, string[]> = {
  en: [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"
  ],
  ar: [
    "محرم", "صفر", "ربيع الأول", "ربيع الآخر",
    "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
    "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ],
  am: [
    "ሙሀረም", "ሶፈር", "ረቢዕ አል-አወል", "ረቢዕ አ-ሣኒ",
    "ጁማደል አወል", "ጁማደል አኺር", "ረጀብ", "ሻዕባን",
    "ረመዳን", "ሸዋል", "ዙልቂዕዳህ", "ዙልሂጃህ"
  ],
  har: [
    "ሙሀረም", "ሶፈር", "ረቢዕ አል-አወል", "ረቢዕ አ-ሣኒ",
    "ጁማደል አወል", "ጁማደል አኺር", "ረጀብ", "ሻዕባን",
    "ረመዳን", "ሸዋል", "ዙልቂዕዳህ", "ዙልሂጃህ"
  ]
};

const suffixAH: Record<Language, string> = {
  en: "AH",
  ar: "هـ",
  am: "ሂ.አ",
  har: "ሂ.አ"
};

const suffixEC: Record<Language, string> = {
  en: "E.C.",
  ar: "ب.إ",
  am: "ዓ.ም.",
  har: "ዓ.ም."
};

const ethiopianMonths: Record<Language, string[]> = {
  en: [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
    "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
  ],
  ar: [
    "مسكيرم", "تكيمت", "هدار", "تاهساس", "تير", "ياكاتيت",
    "ميغابيت", "ميازيا", "غينبوت", "سيني", "هملي", "نيهاسي", "باغومي"
  ],
  am: [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ],
  har: [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ]
};

const uiTexts = {
  title: {
    en: "Islamic Hijri & Gregorian Calendar",
    ar: "التقويم الهجري والميلادي المشترك",
    am: "የሂጅሪ እና ጎርጎርዮስ የጋራ አቆጣጠር",
    har: "የሂጅሪ እና ጎርጎርዮስ የጋራ አቆጣጠር"
  },
  gregView: {
    en: "Gregorian Centric",
    ar: "تقويم ميلادي",
    am: "ጎርጎርዮስ መካከለኛ",
    har: "ጎርጎርዮስ መካከለኛ"
  },
  hijriView: {
    en: "Hijri Centric",
    ar: "تقويم هجري",
    am: "ሂጅሪ መካከለኛ",
    har: "ሂጅሪ መካከለኛ"
  },
  today: {
    en: "Today",
    ar: "اليوم",
    am: "ዛሬ",
    har: "ዛሬ"
  },
  occasions: {
    en: "Islamic Key Occasions",
    ar: "المناسبات الإسلامية الهامة",
    am: "ዋና ዋና የእስልምና በዓላት",
    har: "ዋና ዋና የእስልምና በዓላት"
  },
  details: {
    en: "Selected Date Details",
    ar: "تفاصيل التاريخ المحدد",
    am: "የተመረጠው ቀን ዝርዝር",
    har: "የተመረጠው ቀን ዝርዝር"
  },
  virtues: {
    en: "Significance & Recommended Deeds",
    ar: "الأهمية والأعمال المستحبة",
    am: "የቀኑ ፋይዳ እና የሚመከሩ ተግባራት",
    har: "የቀኑ ፋይዳ እና የሚመከሩ ተግባራት"
  },
  whiteDays: {
    en: "Ayyam al-Bid (White Days) - Sunnah to fast on the 13th, 14th, and 15th of Hijri months.",
    ar: "الأيام البيض (١٣، ١٤، ١٥ من الشهر الهجري) - يسن صيامها كما أوصى نبينا ﷺ.",
    am: "አያሙል ቢድ (ነጭ ቀናት - 13ኛ፣ 14ኛ እና 15ኛ ቀናት) - መጾም ሱና ነው ።",
    har: "አያሙል ቢድ (ነጭ ቀናት - 13ኛ፣ 14ኛ እና 15ኛ ቀናት) - መጾም ሱና ነው ።"
  },
  mondayFast: {
    en: "Monday Fasting - Sunnah to fast as deeds are presented to Allah.",
    ar: "صيام يوم الاثنين - يسن صيامه حيث تعرض الأعمال فيه على الله ويحب ﷺ أن يعرض عمله وهو صائم.",
    am: "የሰኞ ጾም - መጾም ሱና ነው፤ ተግባራት ወደ አላህ የሚቀርቡበት ቀን ስለሆነ።",
    har: "የሰኞ ጾም - መጾም ሱና ነው፤ ተግባራት ወደ አላህ የሚቀርቡበት ቀን ስለሆነ።"
  },
  thursdayFast: {
    en: "Thursday Fasting - Sunnah to fast as deeds are presented to Allah.",
    ar: "صيام يوم الخميس - يسن صيامه حيث تعرض الأعمال فيه على الله ويحب ﷺ أن يعرض عمله وهو صائم.",
    am: "የሐሙስ ጾም - መጾም ሱና ነው፤ ተግባራት ወደ አላህ የሚቀርቡበት ቀን ስለሆነ።",
    har: "የሐሙስ ጾም - መጾም ሱና ነው፤ ተግባራት ወደ አላህ የሚቀርቡበት ቀን ስለሆነ።"
  },
  fridayRecommendation: {
    en: "Friday (Jumu'ah) - The best day of the week. Read Surah Al-Kahf, increase Salawat on the Prophet ﷺ, and seek the hour of acceptance (Saa'at al-Ijabah).",
    ar: "يوم الجمعة العظيم - خير يوم طلعت عليه الشمس. يسن قراءة سورة الكهف، الإكثار من الصلاة على النبي ﷺ، والدعاء في ساعة الاستجابة.",
    am: "የዓርብ (ጁምዓ) በረከት - ከቀናት ሁሉ በላጩ ቀን። ሱረቱል ካህፍን መቅራት፣ በነቢዩ ﷺ ላይ ሰለዋት ማብዛትና ዱዓ ማድረግ ይመከራል።",
    har: "የዓርብ (ጁምዓ) በረከት - ከቀናት ሁሉ በላጩ ቀን። ሱረቱል ካህፍን መቅራት፣ በነቢዩ ﷺ ላይ ሰለዋት ማብዛትና ዱዓ ማድረግ ይመከራል።"
  },
  standardDay: {
    en: "A blessed day to increase in remembrance, read Quran, and maintain family ties.",
    ar: "يوم مبارك كباقي الأيام يُستحب فيه كثرة الذكر والصلة وتلاوة القرآن.",
    am: "መልካም ቀን፤ ዚክር ለማብዛትና ቁርአን ለመቅራት ምቹ የሆነ።",
    har: "መልካም ቀን፤ ዚክር ለማብዛትና ቁርአን ለመቅራት ምቹ የሆነ።"
  }
};

interface IslamicOccasion {
  month: number; // 0-based
  day: number;
  name: Record<Language, string>;
  description?: Record<Language, string>;
}

const islamicOccasions: IslamicOccasion[] = [
  { 
    month: 0, 
    day: 1, 
    name: { 
      en: "Hijri New Year", 
      ar: "رأس السنة الهجرية", 
      am: "የሂጅራ አዲስ ዓመት", 
      har: "የሂጅራ አዲስ ዓመት" 
    },
    description: {
      en: "First day of Muharram, marking the migration of Prophet Muhammad ﷺ to Madinah.",
      ar: "بداية العام الهجري الجديد ذكرى هجرة النبي ﷺ والصحابة الكرام من مكة إلى المدينة.",
      am: "የሙሀረም አንደኛ ቀን፤ የነቢዩ ሙሐመድ ﷺ የስደት ጉዞን (ሂጅራ) መጀመሪያ የሚያመለክት።",
      har: "የሙሀረም አንደኛ ቀን፤ የነቢዩ ሙሐመድ ﷺ የስደት ጉዞን (ሂጅራ) መጀመሪያ የሚያመለክት።"
    }
  },
  { 
    month: 0, 
    day: 10, 
    name: { 
      en: "Day of Ashura", 
      ar: "يوم عاشوراء", 
      am: "የዓሹራዕ ቀን", 
      har: "የዓሹራዕ ቀን" 
    },
    description: {
      en: "Fasting on this day expiates the sins of the past year. Marks the salvation of Prophet Musa (AS).",
      ar: "يوم عظيم نجى الله فيه موسى وقومه. صيام هذا اليوم يكفر ذنوب السنة الماضية كسنّة مأثورة.",
      am: "ታላቅ ቀን፤ አላህ ነቢዩ ሙሳን እና ህዝቦቻቸውን ያዳነበት። በዚህ ቀን መጾም ያለፈውን ዓመት ወንጀል ያስምራል።",
      har: "ታላቅ ቀን፤ አላህ ነቢዩ ሙሳን እና ህዝቦቻቸውን ያዳነበት። በዚህ ቀን መጾም ያለፈውን ዓመት ወንጀል ያስምራል።"
    }
  },
  { 
    month: 2, 
    day: 12, 
    name: { 
      en: "Mawlid an-Nabi", 
      ar: "المولد النبوي الشريف", 
      am: "የመውሊድ በዓል", 
      har: "የመውሊድ በዓል" 
    },
    description: {
      en: "Commemorating the birth of the Prophet Muhammad ﷺ, the mercy to the worlds.",
      ar: "ذكرى مولد سيد البشر والرحمة المهداة نبينا محمد ﷺ صلوات ربي وسلامه عليه.",
      am: "የዓለማቱ እዝነት የሆኑትን የነቢዩ ሙሐመድ ﷺ የልደት መታሰቢያ።",
      har: "የዓለማቱ እዝነት የሆኑትን የነቢዩ ሙሐመድ ﷺ የልደት መታሰቢያ።"
    }
  },
  { 
    month: 6, 
    day: 27, 
    name: { 
      en: "Isra' and Mi'raj", 
      ar: "ليلة الإسراء والمعراج", 
      am: "የኢስራዕና ሚዕራጅ", 
      har: "የኢስራዕና ሚዕራጅ" 
    },
    description: {
      en: "Commemorates the miraculous night journey of Prophet Muhammad ﷺ from Makkah to Jerusalem and ascension to heaven.",
      ar: "رحلة النبي ﷺ الليلية المعجزة من المسجد الحرام إلى المسجد الأقصى وعروجه إلى السماوات العلى فرضية الصلوات الخمس.",
      am: "የነቢዩ ሙሐመድ ﷺ ተአምራዊ የምሽት ጉዞ ከመካ ወደ ኢየሩሳሌም እና ወደ ሰማይ ዕርገት።",
      har: "የነቢዩ ሙሐመድ ﷺ ተአምራዊ የምሽት ጉዞ ከመካ ወደ ኢየሩሳሌም እና ወደ ሰማይ ዕርገት።"
    }
  },
  { 
    month: 7, 
    day: 15, 
    name: { 
      en: "Mid-Sha'ban", 
      ar: "ليلة النصف من شعبان", 
      am: "የሻዕባን እኩሌታ", 
      har: "የሻዕባን እኩሌታ" 
    },
    description: {
      en: "A night of forgiveness and prayers, preceding the blessed month of Ramadan.",
      ar: "ليلة مباركة يغفر الله فيها لخلقه إلا لمشرك أو مشاحن، تسبق شهر رمضان المبارك.",
      am: "የይቅርታ እና የዱዓ ምሽት፤ ከተከበረው የረመዳን ወር በፊት የሚመጣ።",
      har: "የይቅርታ እና የዱዓ ምሽት፤ ከተከበረው የረመዳን ወር በፊት የሚመጣ።"
    }
  },
  { 
    month: 8, 
    day: 1, 
    name: { 
      en: "First Day of Ramadan", 
      ar: "أول أيام رمضان مبارك", 
      am: "የረመዳን መጀመሪያ", 
      har: "የረመዳን መጀመሪያ" 
    },
    description: {
      en: "The beginning of the holy month of fasting, self-reflection, and reading the Holy Quran.",
      ar: "بداية شهر الصيام والقيام وتلاوة القرآن وتزكية النفوس.",
      am: "የተቀደሰው የረመዳን ወር መጀመሪያ፤ የጾም፣ የአምልኮ እና የቁርአን ንባብ።",
      har: "የተቀደሰው የረመዳን ወር መጀመሪያ፤ የጾም፣ የአምልኮ እና የቁርአን ንባብ።"
    }
  },
  { 
    month: 8, 
    day: 21, 
    name: { 
      en: "Laylat al-Qadr Nights", 
      ar: "ليالي العشر الأواخر والقدر", 
      am: "የለይለቱል ቀድር ምሽቶች", 
      har: "የለይለቱል ቀድር ምሽቶች" 
    },
    description: {
      en: "Seek the Night of Decree in the odd nights of Ramadan's last 10 days. Better than a thousand months.",
      ar: "التحري لليلة القدر المباركة في الليالي الوترية من العشر الأواخر من رمضان، وهي خير من ألف شهر.",
      am: "የለይለቱል ቀድርን ታላቅ ምሽት በረመዳን የመጨረሻ አስር ቀናት ውስጥ መፈለግ፤ ከአንድ ሺህ ወራት የምትበልጥ ምሽት።",
      har: "የለይለቱል ቀድርን ታላቅ ምሽት በረመዳን የመጨረሻ አስር ቀናት ውስጥ መፈለግ፤ ከአንድ ሺህ ወራት የምትበልጥ ምሽት።"
    }
  },
  { 
    month: 9, 
    day: 1, 
    name: { 
      en: "Eid al-Fitr", 
      ar: "عيد الفطر المبارك", 
      am: "ኢድ አል-ፈጥር", 
      har: "ኢድ አል-ፈጥር" 
    },
    description: {
      en: "Celebration marking the conclusion of the holy month of fasting.",
      ar: "جائزة الصائمين وفرحتهم بإتمام فريضة الصيام والعبادات في شهر رمضان.",
      am: "በረመዳን ጾም መጠናቀቅ ምክንያት የሚደረግ ታላቅ የደስታ በዓል።",
      har: "በረመዳን ጾም መጠናቀቅ ምክንያት የሚደረግ ታላቅ የደስታ በዓል።"
    }
  },
  { 
    month: 11, 
    day: 8, 
    name: { 
      en: "Start of Hajj Pilgrimage", 
      ar: "بدء مناسك الحج (يوم التروية)", 
      am: "የሐጅ መጀመሪያ", 
      har: "የሐጅ መጀመሪያ" 
    },
    description: {
      en: "Pilgrims put on Ihram and head to Mina to start their Hajj pilgrimage rites.",
      ar: "يوم التروية حيث يحرم الحجاج وينطلقون إلى مشعر منى مكبرين مهللين.",
      am: "ሐጃጆች ኢህራም ለብሰው ወደ ሚና የሚጓዙበት የሐጅ ጉዞ መጀመሪያ ቀን።",
      har: "ሐጃጆች ኢህራም ለብሰው ወደ ሚና የሚጓዙበት የሐጅ ጉዞ መጀመሪያ ቀን።"
    }
  },
  { 
    month: 11, 
    day: 9, 
    name: { 
      en: "Day of Arafah", 
      ar: "يوم عرفة العظيم", 
      am: "የዓረፋ ቀን", 
      har: "የዓረፋ ቀን" 
    },
    description: {
      en: "The peak of Hajj. Fasting for non-pilgrims expiates the sins of the preceding and coming year.",
      ar: "أعظم أيام الدنيا وركن الحج الأكبر. صيامه لغير الحاج يكفر سنتين من الذنوب.",
      am: "ታላቁ የዓረፋ ቀን፤ የሐጅ ዋነኛው ምሰሶ። ሐጅ ላይ ላልሆኑ ሰዎች መጾም ያለፈውን እና የሚመጣውን ዓመት ወንጀል ያስምራል።",
      har: "ታላቁ የዓረፋ ቀን፤ የሐጅ ዋነኛው ምሰሶ። ሐጅ ላይ ላልሆኑ ሰዎች መጾም ያለፈውን እና የሚመጣውን ዓመት ወንጀል ያስምራል።"
    }
  },
  { 
    month: 11, 
    day: 10, 
    name: { 
      en: "Eid al-Adha", 
      ar: "عيد الأضحى المبارك", 
      am: "ኢድ አል-አድሐ", 
      har: "ኢድ አል-አድሐ" 
    },
    description: {
      en: "Festival of Sacrifice, commemorating Prophet Ibrahim's obedience to Allah.",
      ar: "عيد النحر الأكبر تقرباً لله عز وجل وإحياء لسنّة أبينا إبراهيم عليه الصلاة والسلام.",
      am: "የመስዋዕት በዓል፤ የነቢዩ ኢብራሂምን ለአላህ ያለውን ታዛዥነት መታሰቢያ።",
      har: "የመስዋዕት በዓል፤ የነቢዩ ኢብራሂምን ለአላህ ያለውን ታዛዥነት መታሰቢያ።"
    }
  }
];

// Extracted conversion logics
export const getHijriFromGregorian = (date: Date): HijriParts => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let day = date.getDate();
    let monthIndex = 0;
    let year = date.getFullYear();

    parts.forEach(part => {
      if (part.type === 'day') {
        day = parseInt(part.value, 10);
      } else if (part.type === 'month') {
        monthIndex = parseInt(part.value, 10) - 1;
      } else if (part.type === 'year') {
        year = parseInt(part.value, 10);
      }
    });

    if (monthIndex < 0 || monthIndex > 11) monthIndex = 0;
    return { day, monthIndex, year };
  } catch (e) {
    // simple fallback
    const diffMs = date.getTime() - new Date(2023, 6, 19).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hijriTotalDays = diffDays + 1445 * 354.367;
    const computedYear = Math.floor(hijriTotalDays / 354.367);
    const yearRem = hijriTotalDays % 354.367;
    const computedMonth = Math.floor(yearRem / 29.5) % 12;
    const computedDay = Math.floor(yearRem % 29.5) + 1;
    return {
      day: isNaN(computedDay) ? 1 : Math.max(1, Math.min(30, computedDay)),
      monthIndex: isNaN(computedMonth) ? 0 : Math.max(0, Math.min(11, computedMonth)),
      year: isNaN(computedYear) ? 1448 : computedYear
    };
  }
};

export const getGregorianFromHijri = (hijriYear: number, hijriMonthIndex: number, hijriDay: number): Date => {
  const refGregorian = new Date(2023, 6, 19); // July 19, 2023
  const refHijriYear = 1445;
  
  const yearDiff = hijriYear - refHijriYear;
  const monthDiff = hijriMonthIndex;
  const dayDiff = hijriDay - 1;
  
  const approxDays = Math.round(yearDiff * 354.367 + monthDiff * 29.53 + dayDiff);
  const estDate = new Date(refGregorian.getTime() + approxDays * 24 * 60 * 60 * 1000);
  
  let bestDate = estDate;
  let iterations = 0;
  
  while (iterations < 10) {
    const computed = getHijriFromGregorian(bestDate);
    const targetVal = hijriYear * 12 + hijriMonthIndex;
    const computedVal = computed.year * 12 + computed.monthIndex;
    
    if (targetVal === computedVal && computed.day === hijriDay) {
      return bestDate;
    }
    
    const targetDays = targetVal * 29.53 + hijriDay;
    const computedDays = computedVal * 29.53 + computed.day;
    const diff = Math.round(targetDays - computedDays);
    
    if (diff === 0) {
      const step = targetDays > computedDays ? 1 : -1;
      bestDate = new Date(bestDate.getTime() + step * 24 * 60 * 60 * 1000);
    } else {
      bestDate = new Date(bestDate.getTime() + diff * 24 * 60 * 60 * 1000);
    }
    iterations++;
  }
  
  return estDate;
};

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'gregorian' | 'hijri' | 'ethiopian'>('hijri');
  
  // Date states for navigation
  const [gYear, setGYear] = useState<number>(() => new Date().getFullYear());
  const [gMonth, setGMonth] = useState<number>(() => new Date().getMonth());
  
  const [hYear, setHYear] = useState<number>(() => getHijriFromGregorian(new Date()).year);
  const [hMonth, setHMonth] = useState<number>(() => getHijriFromGregorian(new Date()).monthIndex);

  const [eyear, setEyear] = useState<number>(() => {
    const today = new Date();
    const [ey, em, ed] = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return ey;
  });
  const [emonth, setEmonth] = useState<number>(() => {
    const today = new Date();
    const [ey, em, ed] = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return em - 1;
  });
  
  const [selectedDay, setSelectedDay] = useState<{ type: 'g' | 'h' | 'e'; date: Date; hijri: HijriParts } | null>(null);

  // Sync selected day to today on mount/open
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setSelectedDay({
        type: initialTab === 'ethiopian' ? 'e' : (initialTab === 'gregorian' ? 'g' : 'h'),
        date: today,
        hijri: getHijriFromGregorian(today)
      });
      // Set month/year selectors to today
      setGYear(today.getFullYear());
      setGMonth(today.getMonth());
      const hToday = getHijriFromGregorian(today);
      setHYear(hToday.year);
      setHMonth(hToday.monthIndex);

      const [ey, em, ed] = toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
      setEyear(ey);
      setEmonth(em - 1);

      if (initialTab) {
        setViewMode(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Localized Numbers helper
  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num.toString().split('').map(digit => {
        const d = parseInt(digit, 10);
        return isNaN(d) ? digit : arabicDigits[d];
      }).join('');
    }
    return num.toString();
  };

  // 1. GREGORIAN GRID COMPUTATION
  const getGregorianGrid = () => {
    const totalDays = new Date(gYear, gMonth + 1, 0).getDate();
    const firstDayIdx = new Date(gYear, gMonth, 1).getDay(); // Sunday=0, etc.
    
    const cells = [];
    
    // Previous Month padding
    const prevMonthTotalDays = new Date(gYear, gMonth, 0).getDate();
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const date = new Date(gYear, gMonth - 1, dayNum);
      cells.push({
        dayNum,
        date,
        hijri: getHijriFromGregorian(date),
        isCurrentMonth: false
      });
    }
    
    // Current Month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(gYear, gMonth, d);
      cells.push({
        dayNum: d,
        date,
        hijri: getHijriFromGregorian(date),
        isCurrentMonth: true
      });
    }
    
    // Next Month padding to complete full rows (usually 35 or 42 cells)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(gYear, gMonth + 1, d);
      cells.push({
        dayNum: d,
        date,
        hijri: getHijriFromGregorian(date),
        isCurrentMonth: false
      });
    }
    
    return cells;
  };

  // 2. HIJRI GRID COMPUTATION
  const getHijriGrid = () => {
    // First day of current Hijri month in Gregorian
    const startGDate = getGregorianFromHijri(hYear, hMonth, 1);
    
    // First day of next Hijri month in Gregorian
    let nextY = hYear;
    let nextM = hMonth + 1;
    if (nextM > 11) {
      nextM = 0;
      nextY++;
    }
    const endGDate = getGregorianFromHijri(nextY, nextM, 1);
    
    // Number of days in the lunar month index
    const totalHijriDays = Math.round((endGDate.getTime() - startGDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const firstDayIdx = startGDate.getDay();
    
    const cells = [];
    
    // Previous Hijri month padding
    let prevY = hYear;
    let prevM = hMonth - 1;
    if (prevM < 0) {
      prevM = 11;
      prevY--;
    }
    const prevStartGDate = getGregorianFromHijri(prevY, prevM, 1);
    const prevTotalDays = Math.round((startGDate.getTime() - prevStartGDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      const hdNum = prevTotalDays - i;
      const gDate = new Date(startGDate.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
      cells.push({
        hijriDayNum: hdNum,
        date: gDate,
        hijri: { day: hdNum, monthIndex: prevM, year: prevY },
        isCurrentMonth: false
      });
    }
    
    // Current Hijri Month Days
    for (let hd = 1; hd <= totalHijriDays; hd++) {
      const gDate = new Date(startGDate.getTime() + (hd - 1) * 24 * 60 * 60 * 1000);
      cells.push({
        hijriDayNum: hd,
        date: gDate,
        hijri: { day: hd, monthIndex: hMonth, year: hYear },
        isCurrentMonth: true
      });
    }
    
    // Next Hijri Month padding
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let hd = 1; hd <= remaining; hd++) {
      const gDate = new Date(endGDate.getTime() + (hd - 1) * 24 * 60 * 60 * 1000);
      cells.push({
        hijriDayNum: hd,
        date: gDate,
        hijri: { day: hd, monthIndex: nextM, year: nextY },
        isCurrentMonth: false
      });
    }
    
    return cells;
  };

  // Ethiopian helper functions
  const isEthiopianLeapYear = (year: number): boolean => {
    return year % 4 === 3;
  };

  const getGregorianFromEthiopian = (year: number, monthIndex: number, day: number): Date => {
    const [gYear, gMonth, gDay] = toGregorian(year, monthIndex + 1, day);
    return new Date(gYear, gMonth - 1, gDay);
  };

  // 3. ETHIOPIAN GRID COMPUTATION
  const getEthiopianGrid = () => {
    // First day of current Ethiopian month in Gregorian
    const startGDate = getGregorianFromEthiopian(eyear, emonth, 1);
    
    // Number of days in the Ethiopian month
    const totalEthiopianDays = emonth === 12 // Pagume
      ? (isEthiopianLeapYear(eyear) ? 6 : 5)
      : 30;
      
    const firstDayIdx = startGDate.getDay(); // Day of week (0 = Sunday, etc.)
    
    const cells = [];
    
    // Previous Ethiopian month padding
    let prevY = eyear;
    let prevM = emonth - 1;
    if (prevM < 0) {
      prevM = 12; // Pagume
      prevY--;
    }
    const prevTotalDays = prevM === 12 ? (isEthiopianLeapYear(prevY) ? 6 : 5) : 30;
    
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      const edNum = prevTotalDays - i;
      const gDate = new Date(startGDate.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
      cells.push({
        ethiopianDayNum: edNum,
        date: gDate,
        hijri: getHijriFromGregorian(gDate),
        isCurrentMonth: false
      });
    }
    
    // Current Ethiopian Month Days
    for (let ed = 1; ed <= totalEthiopianDays; ed++) {
      const gDate = new Date(startGDate.getTime() + (ed - 1) * 24 * 60 * 60 * 1000);
      cells.push({
        ethiopianDayNum: ed,
        date: gDate,
        hijri: getHijriFromGregorian(gDate),
        isCurrentMonth: true
      });
    }
    
    // Next Ethiopian Month padding to complete grid
    const remaining = (7 - (cells.length % 7)) % 7;
    let nextY = eyear;
    let nextM = emonth + 1;
    if (nextM > 12) {
      nextM = 0;
      nextY++;
    }
    const endGDate = getGregorianFromEthiopian(nextY, nextM, 1);
    for (let ed = 1; ed <= remaining; ed++) {
      const gDate = new Date(endGDate.getTime() + (ed - 1) * 24 * 60 * 60 * 1000);
      cells.push({
        ethiopianDayNum: ed,
        date: gDate,
        hijri: getHijriFromGregorian(gDate),
        isCurrentMonth: false
      });
    }
    
    return cells;
  };

  const gregGridCells = getGregorianGrid();
  const hijriGridCells = getHijriGrid();
  const ethiopianGridCells = getEthiopianGrid();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMode === 'gregorian') {
      if (gMonth === 0) {
        setGMonth(11);
        setGYear(gYear - 1);
      } else {
        setGMonth(gMonth - 1);
      }
    } else if (viewMode === 'hijri') {
      if (hMonth === 0) {
        setHMonth(11);
        setHYear(hYear - 1);
      } else {
        setHMonth(hMonth - 1);
      }
    } else {
      if (emonth === 0) {
        setEmonth(12);
        setEyear(eyear - 1);
      } else {
        setEmonth(emonth - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'gregorian') {
      if (gMonth === 11) {
        setGMonth(0);
        setGYear(gYear + 1);
      } else {
        setGMonth(gMonth + 1);
      }
    } else if (viewMode === 'hijri') {
      if (hMonth === 11) {
        setHMonth(0);
        setHYear(hYear + 1);
      } else {
        setHMonth(hMonth + 1);
      }
    } else {
      if (emonth === 12) {
        setEmonth(0);
        setEyear(eyear + 1);
      } else {
        setEmonth(emonth + 1);
      }
    }
  };

  // Jump to specific Occasion
  const handleOccasionClick = (occ: IslamicOccasion) => {
    setViewMode('hijri');
    setHMonth(occ.month);
    // If Ramadan / Dhu al-Hijjah is near, make sure year is reasonable
    const currentH = getHijriFromGregorian(new Date());
    setHYear(currentH.year);
    
    const targetGDate = getGregorianFromHijri(currentH.year, occ.month, occ.day);
    setSelectedDay({
      type: 'h',
      date: targetGDate,
      hijri: { day: occ.day, monthIndex: occ.month, year: currentH.year }
    });
  };

  // Get current cell details
  const getDayOccasions = (hMIndex: number, hDay: number) => {
    return islamicOccasions.find(o => o.month === hMIndex && o.day === hDay);
  };

  // Spiritual recommendation based on selected day
  const getSelectedDaySpiritualGuidance = () => {
    if (!selectedDay) return '';
    const dayOfWeek = selectedDay.date.getDay(); // 0-6
    const hijriDayNum = selectedDay.hijri.day;
    const occasion = getDayOccasions(selectedDay.hijri.monthIndex, hijriDayNum);
    
    if (occasion) {
      return occasion.description?.[language] || occasion.name[language];
    }
    
    if (dayOfWeek === 5) { // Friday
      return uiTexts.fridayRecommendation[language];
    }
    if (hijriDayNum === 13 || hijriDayNum === 14 || hijriDayNum === 15) { // White Days
      return uiTexts.whiteDays[language];
    }
    if (dayOfWeek === 1) { // Monday
      return uiTexts.mondayFast[language];
    }
    if (dayOfWeek === 4) { // Thursday
      return uiTexts.thursdayFast[language];
    }
    return uiTexts.standardDay[language];
  };

  // Check if a cell date is Today
  const isToday = (cellDate: Date) => {
    const today = new Date();
    return cellDate.getDate() === today.getDate() &&
           cellDate.getMonth() === today.getMonth() &&
           cellDate.getFullYear() === today.getFullYear();
  };

  // Check if a cell is selected
  const isSelected = (cellDate: Date) => {
    if (!selectedDay) return false;
    return cellDate.getDate() === selectedDay.date.getDate() &&
           cellDate.getMonth() === selectedDay.date.getMonth() &&
           cellDate.getFullYear() === selectedDay.date.getFullYear();
  };

  const activeOccasionsInMonth = islamicOccasions.filter(o => {
    const currentHMonth = viewMode === 'gregorian' 
      ? (selectedDay ? selectedDay.hijri.monthIndex : -1) 
      : hMonth;
    return o.month === currentHMonth;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-300">
      {/* Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close calendar"
        >
          <X size={18} />
        </button>

        {/* 1. MAIN CALENDAR PANEL (Left) */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60">
          
          {/* Header & Mode Selector */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-secondary-400 rounded-xl border border-primary-200/40 dark:border-primary-800/30">
                <CalendarIcon size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-serif">
                  {uiTexts.title[language]}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                  Interactive Hijri-Gregorian Unified Hub
                </p>
              </div>
            </div>

            {/* View Mode Switcher tabs */}
            <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-6">
              <button
                onClick={() => setViewMode('gregorian')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2
                  ${viewMode === 'gregorian'
                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <Sun size={13} className={viewMode === 'gregorian' ? 'text-amber-500' : ''} />
                <span>{uiTexts.gregView[language]}</span>
              </button>
              <button
                onClick={() => setViewMode('hijri')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2
                  ${viewMode === 'hijri'
                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <Moon size={13} className={viewMode === 'hijri' ? 'text-blue-400' : ''} />
                <span>{uiTexts.hijriView[language]}</span>
              </button>
              <button
                onClick={() => setViewMode('ethiopian')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2
                  ${viewMode === 'ethiopian'
                    ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-secondary-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <Sparkles size={13} className={viewMode === 'ethiopian' ? 'text-amber-500 animate-pulse' : ''} />
                <span>{language === 'am' || language === 'har' ? 'የኢትዮጵያ' : (language === 'ar' ? 'الإثيوبي' : 'Ethiopian')}</span>
              </button>
            </div>

            {/* Calendar Grid Controller (Month/Year display and arrows) */}
            <div className="flex items-center justify-between mb-5 bg-slate-50/50 dark:bg-slate-850/40 p-3 rounded-2xl border border-slate-150 dark:border-slate-800/50">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="text-center">
                <span className="block text-sm font-extrabold text-slate-800 dark:text-white tracking-wide">
                  {viewMode === 'gregorian' 
                    ? `${gregMonthNames[language][gMonth]} ${formatNumber(gYear)}`
                    : viewMode === 'hijri'
                      ? `${hijriMonths[language][hMonth]} ${formatNumber(hYear)} ${suffixAH[language]}`
                      : `${ethiopianMonths[language][emonth]} ${formatNumber(eyear)} ${suffixEC[language]}`
                  }
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                  {viewMode === 'gregorian'
                    ? `≈ ${hijriMonths[language][getHijriFromGregorian(new Date(gYear, gMonth, 15)).monthIndex]} ${getHijriFromGregorian(new Date(gYear, gMonth, 15)).year} ${suffixAH[language]}`
                    : viewMode === 'hijri'
                      ? `≈ ${gregMonthNames[language][getGregorianFromHijri(hYear, hMonth, 15).getMonth()]} ${getGregorianFromHijri(hYear, hMonth, 15).getFullYear()}`
                      : `≈ ${gregMonthNames[language][getGregorianFromEthiopian(eyear, emonth, 15).getMonth()]} ${getGregorianFromEthiopian(eyear, emonth, 15).getFullYear()}`
                  }
                </span>
              </div>

              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekdays Header Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2.5">
              {weekdaysShort[language].map((dayName, idx) => (
                <div key={idx} className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest py-1.5">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {(viewMode === 'gregorian' ? gregGridCells : (viewMode === 'hijri' ? hijriGridCells : ethiopianGridCells)).map((cell, idx) => {
                const cellIsToday = isToday(cell.date);
                const cellIsSelected = isSelected(cell.date);
                const isFridayNum = cell.date.getDay() === 5;
                const isWhiteDayNum = cell.hijri.day === 13 || cell.hijri.day === 14 || cell.hijri.day === 15;
                
                // Occasion checking
                const occasion = getDayOccasions(cell.hijri.monthIndex, cell.hijri.day);

                // Grid cell item rendering
                const isCurrent = cell.isCurrentMonth;
                const displayMain = viewMode === 'gregorian' 
                  ? cell.dayNum 
                  : viewMode === 'hijri' 
                    ? cell.hijriDayNum 
                    : (cell as any).ethiopianDayNum;
                const displaySub = viewMode === 'gregorian' 
                  ? cell.hijri.day 
                  : cell.date.getDate();

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay({
                      type: viewMode === 'gregorian' ? 'g' : (viewMode === 'hijri' ? 'h' : 'e'),
                      date: cell.date,
                      hijri: cell.hijri
                    })}
                    className={`aspect-square p-1 rounded-2xl flex flex-col justify-between items-center relative transition-all cursor-pointer border group select-none
                      ${!isCurrent 
                        ? 'opacity-25 dark:opacity-20 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20' 
                        : 'border-slate-100/50 dark:border-slate-800/30'}
                      ${cellIsSelected 
                        ? 'bg-primary-600 dark:bg-secondary-500 border-primary-600 dark:border-secondary-500 shadow-md text-white scale-[1.03]' 
                        : cellIsToday
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-extrabold shadow-sm'
                          : 'bg-slate-50/40 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'}
                      ${isFridayNum && !cellIsSelected && !cellIsToday ? 'border-primary-600/30 dark:border-secondary-500/20 hover:border-primary-600/50' : ''}
                      ${isWhiteDayNum && !cellIsSelected && !cellIsToday ? 'ring-1 ring-primary-500/10' : ''}
                    `}
                  >
                    {/* Occasion indicator badge */}
                    {occasion && isCurrent && (
                      <span className={`absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full 
                        ${cellIsSelected ? 'bg-white' : 'bg-amber-500 animate-pulse'}`} 
                        title={occasion.name[language]}
                      />
                    )}

                    {/* Jumu'ah indicator */}
                    {isFridayNum && isCurrent && (
                      <span className={`absolute top-1 right-1.5 text-[8px] font-bold tracking-tighter uppercase
                        ${cellIsSelected ? 'text-primary-100' : 'text-emerald-600 dark:text-secondary-400/90'}`}
                      >
                        {language === 'ar' ? 'ج' : 'Fr'}
                      </span>
                    )}

                    {/* Main Big Number */}
                    <span className="text-[13px] font-extrabold mt-1.5 leading-none">
                      {formatNumber(displayMain)}
                    </span>

                    {/* Sub conversion small label */}
                    <span className={`text-[9px] font-bold mb-1 leading-none tracking-tight
                      ${cellIsSelected 
                        ? 'text-primary-100 dark:text-slate-900/80' 
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}
                    >
                      {formatNumber(displaySub)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick instructions / legend */}
          <div className="mt-5 pt-3.5 border-t border-slate-150 dark:border-slate-800/50 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold justify-center md:justify-start">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800" />
              <span>{uiTexts.today[language]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-primary-600/30" />
              <span>{language === 'ar' ? 'الجمعة (مستحب)' : 'Friday (Jumu\'ah)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{language === 'ar' ? 'مناسبة إسلامية' : 'Islamic Occasion'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md ring-1 ring-primary-500/20" />
              <span>{language === 'ar' ? 'الأيام البيض' : 'White Days'}</span>
            </div>
          </div>

        </div>

        {/* 2. SIDEBAR INFORMATION PANEL (Right) */}
        <div className="w-full md:w-80 bg-slate-50/70 dark:bg-slate-950/40 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[600px] md:max-h-none">
          
          {/* Top Panel: Day details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3">
                {uiTexts.details[language]}
              </h4>
              
              {selectedDay ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Detailed Box of conversion */}
                  <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <Sparkles size={30} className="absolute -right-2 -bottom-2 text-amber-500/5 opacity-10 pointer-events-none group-hover:scale-110 transition-transform" />
                    
                    {/* Weekday name */}
                    <span className="text-[11px] font-extrabold text-primary-600 dark:text-secondary-400 tracking-wider uppercase block mb-1">
                      {weekdays[language][selectedDay.date.getDay()]}
                    </span>
                    
                    {/* Hijri date full display */}
                    <span className="text-base font-bold font-serif text-slate-800 dark:text-white block leading-snug">
                      {formatNumber(selectedDay.hijri.day)} {hijriMonths[language][selectedDay.hijri.monthIndex]} {formatNumber(selectedDay.hijri.year)} {suffixAH[language]}
                    </span>

                    {/* Divider */}
                    <div className="h-px bg-slate-150 dark:bg-slate-800 my-2" />

                    {/* Ethiopian date display */}
                    {(() => {
                      const [ey, em, ed] = toEthiopian(selectedDay.date.getFullYear(), selectedDay.date.getMonth() + 1, selectedDay.date.getDate());
                      return (
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 block leading-snug">
                          {formatNumber(ed)} {ethiopianMonths[language][em - 1]} {formatNumber(ey)} {suffixEC[language]}
                        </span>
                      );
                    })()}

                    {/* Divider */}
                    <div className="h-px bg-slate-150 dark:bg-slate-800 my-2" />
                    
                    {/* Gregorian date display */}
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      {formatNumber(selectedDay.date.getDate())} {gregMonthNames[language][selectedDay.date.getMonth()]} {formatNumber(selectedDay.date.getFullYear())}
                    </span>
                  </div>

                  {/* Spiritual Significance Card */}
                  <div className="p-4 bg-primary-50/40 dark:bg-slate-900/40 border border-primary-200/30 dark:border-slate-800 rounded-2xl relative overflow-hidden shadow-inner">
                    <div className="flex items-center gap-2 mb-2 text-primary-700 dark:text-secondary-300">
                      <Info size={14} className="flex-shrink-0" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        {uiTexts.virtues[language]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {getSelectedDaySpiritualGuidance()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-xs font-medium">
                  Click any date cell to show detailed conversions & virtues.
                </div>
              )}
            </div>

            {/* Islamic occasions scrollable preview list */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3 flex items-center justify-between">
                <span>{uiTexts.occasions[language]}</span>
                <span className="text-[9px] text-amber-500 animate-pulse font-extrabold uppercase">{suffixAH[language]}</span>
              </h4>
              
              <div className="space-y-2 max-h-48 md:max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {islamicOccasions.map((occ, oIdx) => {
                  const isOccActiveInMonth = selectedDay && selectedDay.hijri.monthIndex === occ.month;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOccasionClick(occ)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border flex flex-col gap-1
                        ${isOccActiveInMonth
                          ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30 dark:border-amber-500/20'
                          : 'bg-white hover:bg-slate-100/50 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 border-slate-150 dark:border-slate-800/40'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] font-extrabold text-slate-800 dark:text-white truncate max-w-[160px]">
                          {occ.name[language]}
                        </span>
                        <span className="text-[9px] font-extrabold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                          {formatNumber(occ.day)} {hijriMonths[language][occ.month].substring(0, 7)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer of the sidebar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-normal">
            <span>Friday Surah Guide Hub</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CalendarModal;
