import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, ArrowRight, Sparkles, BookOpen, 
  Search, Shield, Compass, Book, Award, FileText, ChevronRight, CheckCircle2,
  Sliders, ArrowUpRight, Info, Video, Upload, Film, ExternalLink, FileVideo, Download,
  Folder, FolderOpen, HardDrive, Cloud, Copy, Check, Type, Clock, Sun
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { nooniyahVerses } from './nooniyahData';
import { ibtihalLaylVerses } from './ibtihalLaylData';
import { fajrSecretsVerses, fajrSecretsChapters } from './fajrSecretsData';
import { useTTS } from './TTSContext';

interface LocalizedText {
  en: string;
  ar: string;
  am: string;
  har: string;
}

interface Verse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
}

interface Poem {
  id: string;
  title: LocalizedText;
  author: LocalizedText;
  reciter: LocalizedText;
  audioUrl: string;
  description: LocalizedText;
  verses: Verse[];
}

const poemsData: Poem[] = [
  {
    id: 'burda',
    title: {
      en: 'Qasida Al-Burda (The Poem of the Mantle)',
      ar: 'قصيدة البردة للإمام البوصيري',
      am: 'ቃሲዳ አል-ቡርዳ (የአንቀጹ ውዳሴ)',
      har: 'ቃሲዳ አል-ቡርዳ'
    },
    author: {
      en: 'Imam Al-Busiri',
      ar: 'الإمام شرف الدين البوصيري',
      am: 'ኢማም አል-ቡሲሪ',
      har: 'ኢማም አል-ቡሲሪ'
    },
    reciter: {
      en: 'Traditional Group Recitation',
      ar: 'إنشاد جماعي تقليدي عذب',
      am: 'ባህላዊ የጋራ ንባብ',
      har: 'ባህላዊ የጋራ ንባብ'
    },
    audioUrl: 'https://archive.org/download/QasidaBurdaMawlay/Qasida_Burda_Mawlay.mp3',
    description: {
      en: 'Composed in the 13th century by Imam al-Busiri, this legendary panegyric ode in praise of the Prophet Muhammad ﷺ is celebrated globally for its spiritual depth, artistic excellence, and miraculous history.',
      ar: 'من أشهر قصائد المديح النبوي في التاريخ الإسلامي، كتبها الإمام شرف الدين البوصيري في القرن السابع الهجري، وتتميز برصانة ألفاظها، وجمال معانيها، وعميق روحانيتها.',
      am: 'በእስልምና እምነት، ስነ-ምግባር እና መንፈሳዊ እራስን መመርመር ዙሪያ የተፃፈው ይህ አስደናቂ የአንዳሉሺያ ድንቅ ስራ። ባለ 690 የአረብኛ ግጥሞች በሼክ ፋሪስ አባድ ልብ በሚነካ ድምፅ ይቀርባል።',
      har: 'በእስልምና እምነት፣ ስነ-ምግባር እና መንፈሳዊ እራስን መመርመር ዙሪያ የተፃፈው ይህ አስደናቂ የአንዳሉሺያ ድንቅ ስራ። ባለ 690 የአረብኛ ግጥሞች በሼክ ፋሪስ አባድ ልብ በሚነካ ድምፅ ይቀርባል።'
    },
    verses: [
      {
        number: 1,
        arabic: "أَمِنْ تَذَكُّرِ جِيرَانٍ بِذِي سَلَمِ ... مَزَجْتَ دَمْعاً جَرَى مِنْ مُقْلَةٍ بِدَمِ",
        transliteration: "Amin tadhakkuri jīrānin bi-Dhī Salami ... Mazajta dam'an jarā min muqlatin bi-dami",
        translation: {
          en: "Is it from the memory of neighbors at Dhu Salam that you mix tears flowing from your eyes with blood?",
          ar: "أمن تذكر جيران بذي سلم... مزجت دمعاً جرى من مقلة بدم",
          am: "በዙ-ሰለም ያሉትን ጎረቤቶች በማስታወስ ነውን? ከዓይንህ የሚፈሰውን እንባ ከደም ጋር የቀላቀልከው?",
          har: "በዙ-ሰለም ያሉትን ጎረቤቶች በማስታወስ ነውን? ከዓይንህ የሚፈሰውን እንባ ከደም ጋር የቀላቀልከው?"
        }
      },
      {
        number: 2,
        arabic: "أَمْ هَبَّتِ الرِّيحُ مِنْ تِلْقَاءِ كَاظِمَةٍ ... وَأَوْمَضَ الْبَرْقُ فِي الظَّلْمَاءِ مِنْ إِضَمِ",
        transliteration: "Am habbati r-rīḥu min tilqā'i Kāẓimatin ... Wa-awmaḍa l-barqu fī ẓ-ẓalmā'i min Iḍami",
        translation: {
          en: "Or is it that the wind has blown from the direction of Kazimah, and lightning has flashed in the darkness of Idam?",
          ar: "أم هبت الريح من تلقاء كاظمة... وأومض البرق في الظلماء من إضم",
          am: "ወይስ ነፋሱ ከካዚማህ አቅጣጫ ስለነፈሰ ነው? ወይንስ በኢደም ጨለማ ውስጥ መብረቅ ስለበራ ነው?",
          har: "ወይስ ነፋሱ ከካዚማህ አቅጣጫ ስለነፈሰ ነው? ወይንስ በኢደም ጨለማ ውስጥ መብረቅ ስለበራ ነው?"
        }
      },
      {
        number: 3,
        arabic: "فَمَا لِعَيْنَيْكَ إِنْ قُلْتَ اكْفُفَا هَمَتَا ... وَمَا لِقَلْبِكَ إِنْ قُلْتَ اسْتَفِقْ يَهِمِ",
        transliteration: "Famā li-'aynayka in qulta kfufā hamatā ... Wa-mā li-qalbika in qulta stafiq yahimi",
        translation: {
          en: "What is the matter with your eyes, that if you tell them to stop they weep more; and what is with your heart, that if you tell it to wake up it remains distracted?",
          ar: "فما لعينيك إن قلت اكففا همتا... وما لقلبك إن قلت استفق يهم",
          am: "ለዓይኖችህ ምን ሆናቸው ነው? እንባቸውን እንዲያቆሙ ብትላቸው ይበልጥ የሚፈሱት? ለልብህس ምን ሆኖ ነው? ንቃ ብትለው በጭንቀት የሚዋጠው?",
          har: "ለዓይኖችህ ምን ሆናቸው ነው? እንባቸውን እንዲያቆሙ ብትላቸው ይበልጥ የሚፈሱት? ለልብህስ ምን ሆኖ ነው? ንቃ ብትለው በጭንቀት የሚዋጠው?"
        }
      },
      {
        number: 4,
        arabic: "أَيَحْسَبُ الصَّبُّ أَنَّ الْحُبَّ مُنْكَتِمٌ ... مَا بَيْنَ مُنْسَجِمٍ مِنْهُ وَمُضْطَرِمِ",
        transliteration: "A-yaḥsabu ṣ-ṣabbu anna l-ḥubba munkatimun ... ... Mā bayna munsajimin minhu wa-muḍṭarimi",
        translation: {
          en: "Does the passionate lover think that his love can be concealed, when part of it is flowing in tears and part of it is burning inside?",
          ar: "أيحسب الصب أن الحب منكتم... ما بين منسجم منه ومضطرم",
          am: "ፍቅረኛው ፍቅሩ ሊደበቅ የሚችል ይመስለዋልን? በእንባ በሚፈሰውና በውስጡ በሚነደው ስቃይ መካከል።",
          har: "ፍቅረኛው ፍቅሩ ሊደበቅ የሚችል ይመስለዋልን? በእንባ በሚፈሰውና በውስጡ በሚነደው ስቃይ መካከል።"
        }
      },
      {
        number: 5,
        arabic: "لَوْلَا الْهَوَى لَمْ تُرِقْ دَمْعاً عَلَى طَلَلٍ ... وَلَا أَرِقْتَ لِذِكْرِ الْبَانِ وَالْعَلَمِ",
        transliteration: "Lawlā l-hawā lam turiq dam'an 'alā ṭalalin ... Wa-l-āriqta li-dhikri l-bāni wa-l-'alami",
        translation: {
          en: "If it were not for love, you would not have shed tears over abandoned ruins, nor would you have lost sleep at the remembrance of the willow tree and the mountain peak.",
          ar: "لولا الهوى لم ترق دمعاً على طلل... ولا أرقت لذكر البان والعلم",
          am: "ፍቅር ባይኖር ኖሮ በፈረሱት ፍርስራሾች ላይ እንባህን አታፈስም ነበር፤ የባን ዛፍ እና የተራراውን ጫፍ በማሰብ እንቅልፍ አታጣም ነበር።",
          har: "ፍቅር ባይኖር ኖሮ በፈረሱት ፍርስራሾች ላይ እንባህን አታፈስም ነበር፤ የባን ዛፍ እና የተራራውን ጫፍ በማሰብ እንቅልፍ አታጣም ነበር።"
        }
      },
      {
        number: 6,
        arabic: "فَكَيْفَ تُنْكِرُ حُبّاً بَعْدَ مَا شَهِدَتْ ... بِهِ عَلَيْكَ عُدُولُ الدَّمْعِ وَالسَّقَمِ",
        transliteration: "Fakayfa tunkiru ḥubban ba'da mā shahidat ... Bihi 'alayka 'udūlu d-dam'i wa-s-saqami",
        translation: {
          en: "So how can you deny love after there have testified against you such reliable witnesses as your tears and your illness?",
          ar: "فكيف تنكر حباً بعد ما شهدت... به عليك عدول الدمع والسقم",
          am: "እንባህና ህመምህ በአንተ ላይ እውነተኛ ምስክር ሆነው ከቆሙ በኋላ ፍቅርን እንዴት ትክዳለህ?",
          har: "እንባህና ህመምህ በአንተ ላይ እውነተኛ ምስክር ሆነው ከቆሙ በኋላ ፍቅርን እንዴት ትክዳለህ?"
        }
      },
      {
        number: 7,
        arabic: "وَأَثْبَتَ الْوَجْدُ خَطَّيْ عَبْرَةٍ وَضَنًى ... مِثْلَ الْبَهَارِ عَلَى خَدَّيْكَ وَالْعَنَمِ",
        transliteration: "Wa-athbata l-wajdu khaṭṭay 'abratin wa-ḍanan ... Mithla l-bahāri 'alā khaddayka wa-l-'anami",
        translation: {
          en: "And deep longing has carved two paths of tears and emaciation, like yellow chamomile and red boxwood on your cheeks.",
          ar: "وأثبت الوجد خطي عبرة وضنى... مثل البهار على خديك والعنم",
          am: "ጽኑ ፍላጎት በጉንጮችህ ላይ እንደ ቢጫ አበባ እና ቀይ ቅርንፉድ ያሉ የእንባ መስመሮችን እና የመክሳትን ምልክቶች አስቀምጧል።",
          har: "ጽኑ ፍላጎት በጉንጮችህ ላይ እንደ ቢጫ አበባ እና ቀይ ቅርንፉድ ያሉ የእንባ መስመሮችን እና የመክሳትን ምልክቶች አስቀምጧል።"
        }
      },
      {
        number: 8,
        arabic: "نَعَمْ سَرَى طَيْفُ مَنْ أَهْوَى فَأَرَّقَنِي ... وَالْحُبُّ يَعْتَرِضُ اللَّذَّاتِ بِالأَلَمِ",
        transliteration: "Na'am sarā ṭayfu man ahwā fa-arraqanī ... Wa-l-ḥubbu ya'tariḍu l-ladhdhāti bi-l-alami",
        translation: {
          en: "Yes, the phantom of the one I love appeared in my sleep and made me restless; indeed, love interrupts pleasures with pain.",
          ar: "نعم سرى طيف من أهوى فأرقني... والحب يعترض اللذات بالألم",
          am: "አዎን፣ የምወደው ሰው ምስል በሕልሜ መጥቶ እንቅልፍ አሳጣኝ፤ በእርግጥም ፍቅር ደስታን በስቃይ ያቋርጣል።",
          har: "አዎን، የምወደው ሰው ምስል በሕልሜ መጥቶ እንቅልፍ አሳጣኝ፤ በእርግጥም ፍቅር ደስታን በስቃይ ያቋርጣል።"
        }
      },
      {
        number: 9,
        arabic: "يَا لَائِمِي فِي الْهَوَى الْعُذْرِيِّ مَعْذِرَةً ... مِنِّي إِلَيْكَ وَلَوْ أَنْصَفْتَ لَمْ تَلُمِ",
        transliteration: "Yā lā'imī fī l-hawā l-'udhriyyi ma'dhiratan ... Minnī ilayka wa-law anṣafta lam talumi",
        translation: {
          en: "O you who reproach me for a pure, chaste love, accept my apology; and had you been fair, you would not have blamed me.",
          ar: "يا لائمي في الهوى العذري معذرة... مني إليك ولو أنصفت لم تلم",
          am: "ስለ ንጹህ ፍቅሬ የምትወቅሰኝ ሆይ! ይቅርታዬን ተቀበል፤ ፍርደኛ ብትሆን ኖሮ አትወቅሰኝም ነበር።",
          har: "ስለ ንጹህ ፍቅሬ የምትወቅሰኝ ሆይ! ይቅርታዬን ተቀበል፤ ፍርደኛ ብትሆን ኖሮ አትወቅሰኝም ነበር።"
        }
      },
      {
        number: 10,
        arabic: "مَوْلَايَ صَلِّ وَسَلِّمْ دَائِمًا أَبَدًا ... عَلَى حَبِيبِكَ خَيْرِ الْخَلْقِ كُلِّهِمِ",
        transliteration: "Mawlāya ṣalli wa-sallim dā'iman abadan ... 'Alā Ḥabībika khayri l-khalqi kullihimi",
        translation: {
          en: "My Patron, send blessings and peace, constantly and forever, upon Your Beloved, the best of all creation.",
          ar: "مولاي صل وسلم دائماً أبداً... على حبيبك خير الخلق كلهم",
          am: "ጌታዬ ሆይ! ዘወትርና ለዘላለም ሰላምና በረከትህን በወዳጅህ ላይ አውርድ፤ እርሱ ከፍጡራን ሁሉ በላጭ ነው።",
          har: "ጌታዬ ሆይ! ዘወትርና ለዘላለም ሰላምና በረከትህን በወዳጅህ ላይ አውርድ፤ እርሱ ከፍጡራን ሁሉ በላጭ ነው።"
        }
      }
    ]
  },
  {
    id: 'nooniyah',
    title: {
      en: 'Nooniyah Al-Qahtani Complete Poem',
      ar: 'نونية القحطاني كاملة بأعذب الألحان',
      am: 'ኑኒያህ አል-ቃሕጣኒ ሙሉ ግጥም',
      har: 'ኑኒያህ አል-ቃሕጣኒ'
    },
    author: {
      en: 'Imam Abu Muhammad Al-Qahtani',
      ar: 'الإمام أبو محمد عبد الله القحطاني الأندلسي',
      am: 'ኢማም አቡ ሙሐመድ አል-ቃሕጣኒ',
      har: 'ኢማም አቡ ሙሐመድ አል-ቃሕጣኒ'
    },
    reciter: {
      en: 'Fares Abbad',
      ar: 'الشيخ فارس عباد (أداء أسطوري خاشع)',
      am: 'ሼክ ፋሪስ አባድ',
      har: 'ሼክ ፋሪስ አባድ'
    },
    audioUrl: 'https://archive.org/download/qahtani_up_by_ayoub-islam/347_Fares3abbad_NooniatAlQa7tany.mp3',
    description: {
      en: 'The legendary Andalusian masterpiece on Islamic creed, etiquette, and spiritual self-reckoning. This complete composition of 690 beautiful rhyming couplets is rendered in the deeply moving, highly atmospheric solo recitation of Sheikh Fares Abbad.',
      ar: 'منظومة عقائدية تربوية أندلسية فريدة في العقيدة والآداب والمواعظ، تبلغ ٦٩٠ بيتاً تنتهي بالنون. وتتميز بنبرتها الصادقة المؤثرة، وأدائها الخاشع بصوت الشيخ فارس عباد.',
      am: 'በእስልምና እምነት، ስነ-ምግባር እና መንፈሳዊ እራስን መመርመር ዙሪያ የተፃፈው ይህ አስደናቂ የአንዳሉሺያ ድንቅ ስራ። ባለ 690 የአረብኛ ግጥሞች በሼክ ፋሪስ አባድ ልብ በሚነካ ድምፅ ይቀርባል።',
      har: 'በእስልምና እምነት، ስነ-ምግባር እና መንፈሳዊ እራስን መመርመር ዙሪያ የተፃፈው ይህ አስደናቂ የአንዳሉሺያ ድንቅ ስራ። ባለ 690 የአረብኛ ግጥሞች በሼክ ፋሪስ አባድ ልብ በሚነካ ድምፅ ይቀርባል።'
    },
    verses: nooniyahVerses
  },
  {
    id: 'ya-rahilina',
    title: {
      en: 'Ya Rahilina Ila Mina (O You Departing to Mina)',
      ar: 'يا راحلين إلى منى بقيادي (قصيدة الشوق إلى الحرمين الشريفين)',
      am: 'ያ ራሒሊነ ኢላ ሚና (ወደ ሚና እና ቅዱሳን ቦታዎች የናፍቆት ውዳሴ)',
      har: 'ያ ራሒሊነ ኢላ ሚና'
    },
    author: {
      en: 'Imam Abdul Rahim Al-Bura\'i Al-Yamani (d. 803 AH)',
      ar: 'الإمام عبد الرحيم البرعي اليماني (توفي ٨٠٣ هـ)',
      am: 'ኢማም አብዱል ረሒም አል-ቡርኢ አል-የመኒ',
      har: 'ኢማም አብዱል ረሒም አል-ቡርኢ አል-የመኒ'
    },
    reciter: {
      en: 'Hamza Khalid Al-Humaidi',
      ar: 'المنشد حمزة خالد الحميدي (ألحان وأداء مرئي مؤثر)',
      am: 'ሐምዛ ኻሊድ አል-ሑመይዲ',
      har: 'ሐምዛ ኻሊድ አል-ሑመይዲ'
    },
    audioUrl: 'https://archive.org/download/ya-rahilina-mina-al-burai/ya_rahilina_mina.mp3',
    description: {
      en: 'A deeply moving classic spiritual ode composed by the renowned Yemeni scholar and mystic Imam Abdul Rahim Al-Bura\'i. It articulates profound yearning for the sacred precincts of Mecca, Mina, Arafat, Tawaf around the Holy Kaaba, and loving salutations upon Prophet Muhammad ﷺ in Madinah.',
      ar: 'من أبلغ وأعذب قصائد الشوق إلى مكة المكرمة والمشاعر المقدسة (منى وعرفات والمزدلفة والطواف بالبيت العتيق) وزيارة النبي المصطفى ﷺ، أبدع نظمها الإمام البرعي اليماني بأنفاس عاشق متيم.',
      am: 'በመካ፣ በሚና፣ በዐረፋት፣ በካዕባ ጠዋፍ እና በነቢዩ ሙሐመድ ﷺ ናፍቆት ዙሪያ በኢማም አል-ቡርኢ የተፃፈ ልብ የሚነካ ድንቅ መንፈሳዊ ውዳሴ። በሐምዛ ኻሊድ አል-ሑመይዲ ዜማና አፈፃፀም የቀረበ።',
      har: 'በመካ፣ በሚና፣ በዐረፋት፣ በካዕባ ጠዋፍ እና በነቢዩ ሙሐመድ ﷺ ናፍቆት ዙሪያ በኢማም አል-ቡርኢ የተፃፈ ልብ የሚነካ ድንቅ መንፈሳዊ ውዳሴ።'
    },
    verses: [
      {
        number: 1,
        arabic: "يَا رَاحِلِينَ إِلَى مِنًى بِقِيَادِي ... هَيَّجْتُمُو يَوْمَ الرَّحِيلِ فُؤَادِي",
        transliteration: "Yā rāḥilīna ilā Minan bi-qiyādī ... Hayyajtumū yawma r-raḥīli fu'ādī",
        translation: {
          en: "O you departing toward Mina guided in your caravans, on the day of departure you have deeply stirred my longing heart.",
          ar: "يا من تسيرون نحو منى بقوافلكم، لقد أشعلتم في يوم رحيلكم لوعة الشوق والحنين في فؤادي.",
          am: "ወደ ሚና በቅፍለት የምትጓዙት ሆይ! በጉዞአችሁ ቀን በልቤ ውስጥ ያለውን የናፍቆት እሳት አነሳሳችሁ።",
          har: "ወደ ሚና በቅፍለት የምትጓዙት ሆይ! በጉዞአችሁ ቀን በልቤ ውስጥ ያለውን የናፍቆት እሳት አነሳሳችሁ።"
        }
      },
      {
        number: 2,
        arabic: "سِرْتُمْ وَسَارَ دَلِيلُكُمْ يَا وَحْشَتِي ... وَالعِيسُ أَطْرَبَنِي وَصَوْتُ الحَادِي",
        transliteration: "Sirtum wa-sāra dalīlukum yā waḥshatī ... Wa-l-'īsu aṭrabanī wa-ṣawtu l-ḥādī",
        translation: {
          en: "You set forth while your guide led onward—alas my desolate loneliness! While the camels and the melodious chant of the caravan singer stirred me.",
          ar: "مضيتم وسار هاديكم فخلّفتم في نفسي وحشة الغياب، بينما طربت لسير الإبل ونغمات الحادي المترنم.",
          am: "እናንተ ጉዞ ጀመራችሁ፣ መሪያችሁም መራችሁ—ብቸኝነቴ ከበደኝ! የካራቫን ዘፋኙ ድምፅና የግመሎቹ ጉዞ ግን ውስጤን አነቃቃው።",
          har: "እናንተ ጉዞ ጀመራችሁ፣ መሪያችሁም መራችሁ—ብቸኝነቴ ከበደኝ! የካራቫን ዘፋኙ ድምፅና የግመሎቹ ጉዞ ግን ውስጤን አነቃቃው።"
        }
      },
      {
        number: 3,
        arabic: "حَرَمْتُمُ جَفْنَ المَنَامِ لِبُعْدِكُمْ ... يَا سَاكِنِينَ المُنْحَنَى وَالوادي",
        transliteration: "Ḥaramtumu jafna l-manāmi li-bu'dikum ... Yā sākinīna l-munḥanā wa-l-wādī",
        translation: {
          en: "By your distance you deprived my eyelids of sleep, O dwellers of the sacred curve and the holy valley of Mecca.",
          ar: "لقد حرمتم عيوني لذة الكرى والمنام بسبب فراقكم، يا من تسكنون وادي مكة المكرمة ومنحنياتها المباركة.",
          am: "በሩቅ መሆናችሁ ምክንያት ዓይኖቼን ከእንቅልፍ ነሳችኋቸው፤ በቅዱሱ ሸለቆና ዙሪያው ያላችሁ ነዋሪዎች ሆይ!",
          har: "በሩቅ መሆናችሁ ምክንያት ዓይኖቼን ከእንቅልፍ ነሳችኋቸው፤ በቅዱሱ ሸለቆና ዙሪያው ያላችሁ ነዋሪዎች ሆይ!"
        }
      },
      {
        number: 4,
        arabic: "فَإِذَا وَصَلْتُمْ سَالِمِينَ فَبَلِّغُوا ... مِنِّي السَّلَامَ أُهَيْلَ ذَاكَ الوَادِي",
        transliteration: "Fa-idhā waṣaltum sālimīna fa-ballighū ... Minnī s-salāma uhayla dhāka l-wādī",
        translation: {
          en: "So when you arrive in peace and safety, convey my heartfelt greetings of salam to the cherished dwellers of that blessed valley.",
          ar: "فإذا بلغتم ديار الحرم آمنين سالمين، فأنشدوا وأبلغوا أهالي ذلك الوادي الشريف سلامي الحار المشتاق.",
          am: "በሰላም ወደ ቅዱሱ ስፍራ በደረሳችሁ ጊዜ፣ ለዚያ የተባረከ ሸለቆ ሰዎች ከእኔ የተላከውን ሞቅ ያለ ሰላምታ አድርሱልኝ።",
          har: "በሰላም ወደ ቅዱሱ ስፍራ በደረሳችሁ ጊዜ፣ ለዚያ የተባረከ ሸለቆ ሰዎች ከእኔ የተላከውን ሞቅ ያለ ሰላምታ አድርሱልኝ።"
        }
      },
      {
        number: 5,
        arabic: "وَتَذَكَّرُوا عِنْدَ الطَّوَافِ مُتَيَّمًا ... صَبًّا فَنِيَ بِالشَّوْقِ وَالإِبْعَادِ",
        transliteration: "Wa-tadhakkarū 'inda ṭ-ṭawāfi mutayyaman ... Ṣabban faniya bi-sh-shawqi wa-l-ib'ādī",
        translation: {
          en: "And remember, while performing Tawaf around the Holy Kaaba, an ardent lover consumed by burning yearning and distant exile.",
          ar: "واذكروا عند طوافكم بالبيت العتيق عاشقاً محباً أضناه الحنين وأفنته لوعة البعد والاشتياق.",
          am: "በካዕባ ዙሪያ ጠዋፍ በምታደርጉበት ጊዜ፣ በናፍቆትና በሩቅ ርቀት የተቃጠለውን አፍቃሪ አስታውሱ።",
          har: "በካዕባ ዙሪያ ጠዋፍ በምታደርጉበት ጊዜ፣ በናፍቆትና በሩቅ ርቀት የተቃጠለውን አፍቃሪ አስታውሱ።"
        }
      },
      {
        number: 6,
        arabic: "لِي مِنْ رُبَى أَطْلَالِ مَكَّةَ مَرْغَبٌ ... فَعَسَى الإِلَهُ يَجُودُ لِي بِمُرَادِي",
        transliteration: "Lī min rubā aṭlāli Makkata marghabun ... Fa-'asā l-Ilāhu yajūdu lī bi-murādī",
        translation: {
          en: "I hold a fervent desire for the hills and sanctified monuments of Mecca; may Allah graciously bestow upon me my heartfelt wish.",
          ar: "لي رغبة وشوق عظيم لربوع مكة ومعالمها، فعسى الله الكريم أن يتفضل علي بإدراك مرادي وزيارتها.",
          am: "ለመካ ከፍታዎችና ቅዱሳን ቦታዎች የከበረ ናፍቆት አለኝ፤ ቸሩ አምላክ የልቤን ምኞት እንዲሞላልኝ እመኛለሁ።",
          har: "ለመካ ከፍታዎችና ቅዱሳን ቦታዎች የከበረ ናፍቆት አለኝ፤ ቸሩ አምላክ የልቤን ምኞት እንዲሞላልኝ እመኛለሁ።"
        }
      },
      {
        number: 7,
        arabic: "وَيَلُوحُ لِي مَا بَيْنَ زَمْزَمَ وَالصَّفَا ... عِنْدَ المَقَامِ سَمِعْتُ صَوْتَ مُنَادِي",
        transliteration: "Wa-yalūḥu lī mā bayna Zamzama wa-ṣ-Ṣafā ... 'Inda l-maqāmi sami'tu ṣawta munādī",
        translation: {
          en: "Luminous visions appear to me between Zamzam and Safa, and near the Maqam of Ibrahim I heard a caller's voice beckon:",
          ar: "وتلوح في خيالي وروحي معالم زمزم والصفا، وكأني عند مقام إبراهيم أسمع هاتفاً ينادي بالبشارة.",
          am: "በዘምዘምና በሶፋ መካከል የብርሃን እይታ ይታየኛል፤ በመቃሙ አጠገብ የጠሪ ድምፅ ሰማሁ፡",
          har: "በዘምዘምና በሶፋ መካከል የብርሃን እይታ ይታየኛል፤ በመቃሙ አጠገብ የጠሪ ድምፅ ሰማሁ፡"
        }
      },
      {
        number: 8,
        arabic: "وَيَقُولُ لِي يَا نَائِمًا جِدَّ السُّرَى ... عَرَفَاتُ تَجْلُو كُلَّ قَلْبٍ صَادِي",
        transliteration: "Wa-yaqūlu lī yā nā'iman jidda s-surā ... 'Arafātu tajlū kulla qalbin ṣādī",
        translation: {
          en: "Calling: 'O sleeper, quicken your nocturnal pace! For the plains of Arafat cleanse and purify every thirsty heart!'",
          ar: "قائلاً لي: يا نائماً شُدّ المسير وجِدّ في الرحيل، فإن صعيد عرفات الطاهر يطهّر ويجلو كل قلب ظمآن للهدى والرحمة.",
          am: "እንዲህም ይለኛል፡- «አንተ ተኝተህ ያለህ ሆይ! ጉዞህን አፋጥን፤ ዐረፋት የተጠማውን ልብ ሁሉ ታነጻለችና!»",
          har: "እንዲህም ይለኛል፡- «አንተ ተኝተህ ያለህ ሆይ! ጉዞህን አፋጥን፤ ዐረፋት የተጠማውን ልብ ሁሉ ታነጻለችና!»"
        }
      },
      {
        number: 9,
        arabic: "تَاللَّهِ مَا أَحْلَى المَبِيتَ عَلَى مِنًى ... فِي يَوْمِ عِيدٍ أَشْرَفِ الأَعْيَادِ",
        transliteration: "Tallāhi mā aḥlā l-mabīta 'alā Minan ... Fī yawmi 'īdin ashrafi l-a'yādī",
        translation: {
          en: "By Allah, how sweet and sublime is the overnight stay in Mina, on the blessed Day of Eid—the most noble of celebrations!",
          ar: "فوالله ما أجمل وأطيب المبيت في منى، في يوم عيد النحر الأغر الذي هو أشرف الأعياد وأكرمها.",
          am: "በአላህ ይሁንብኝ! በክቡሩ የዒድ ቀን—ከበዓላት ሁሉ በላጭ በሆነው—በሚና ላይ ማደር ምንኛ ጣፋጭ ነው!",
          har: "በአላህ ይሁንብኝ! በክቡሩ የዒድ ቀን—ከበዓላት ሁሉ በላጭ በሆነው—በሚና ላይ ማደር ምንኛ ጣፋጭ ነው!"
        }
      },
      {
        number: 10,
        arabic: "النَّاسُ قَدْ حَجُّوا وَقَدْ بَلَغُوا المُنَى ... وَأَنَا حَجَجْتُ فَمَا بَلَغْتُ مُرَادِي",
        transliteration: "An-nāsu qad ḥajjū wa-qad balaghū l-munā ... Wa-anā ḥajajtu famā balaghtu murādī",
        translation: {
          en: "The people have completed Hajj and reached their greatest desires, while I embarked with all my soul yet remain physically held back.",
          ar: "قد حج الناس ونالوا بغيتهم وأمانيهم بالوصول، وأنا قصدت الحج بقلبي وروحي ولم أبلغ مرادي بجسدي بعد.",
          am: "ሰዎች ሐጅ አድርገው ምኞታቸውን አግኝተዋል፤ እኔ ግን በልቤ ብጓዝም ገና የተሟላውን ምኞቴን አላገኘሁም።",
          har: "ሰዎች ሐጅ አድርገው ምኞታቸውን አግኝተዋል፤ እኔ ግን በልቤ ብጓዝም ገና የተሟላውን ምኞቴን አላገኘሁም።"
        }
      },
      {
        number: 11,
        arabic: "حَجُّوا وَقَدْ غَفَرَ الإِلَهُ ذُنُوبَهُمْ ... بَاتُوا بِمُزْدَلِفَةٍ بِغَيْرِ تَمَادِي",
        transliteration: "Ḥajjū wa-qad ghafara l-Ilāhu dhunūbahum ... Bātū bi-Muzdalifata bi-ghayri tamādī",
        translation: {
          en: "They performed the pilgrimage and God forgave their shortcomings; they rested serenely at Muzdalifah without hindrance.",
          ar: "حجوا وغفر الله العظيم زلاتهم وذنوبهم، وباتوا بمزدلفة بخشوع وسكينة دون توانٍ أو تردد.",
          am: "ሐጅ አድርገው አላህ ወንጀላቸውን ይቅር ብሏቸዋል፤ በሙዝደሊፋህም በሰላምና በእርጋታ አድረዋል።",
          har: "ሐጅ አድርገው አላህ ወንጀላቸውን ይቅር ብሏቸዋል፤ በሙዝደሊፋህም በሰላምና በእርጋታ አድረዋል።"
        }
      },
      {
        number: 12,
        arabic: "ذَبَحُوا ضَحَايَاهُمْ وَسَالَ دِمَاؤُهَا ... وَأَنَا المُتَيَّمُ قَدْ نَحَرْتُ فُؤَادِي",
        transliteration: "Dhabbaḥū ḍaḥāyāhum wa-sāla dimā'uhā ... Wa-anā l-mutayyamu qad naḥartu fu'ādī",
        translation: {
          en: "They offered their sacrificial beasts and their blood flowed, while I, the captive devotee, have sacrificed my burning heart.",
          ar: "قدموا أضاحيهم لله تقرباً وسالت دماؤها، وأنا المحب الولهان قد قدمت فؤادي ذبيحة للشوق والحنين.",
          am: "መስዋዕታቸውን አርደው ደማቸው ፈሰሰ፤ እኔ በፍቅር የተያዝኩት ግን ልቤን በናፍቆት ሰውቻለሁ።",
          har: "መስዋዕታቸውን አርደው ደማቸው ፈሰሰ፤ እኔ በፍቅር የተያዝኩት ግን ልቤን በናፍቆት ሰውቻለሁ።"
        }
      },
      {
        number: 13,
        arabic: "حَلَقُوا رُؤُوسَهُمُ وَقَصُّوا ظُفْرَهُمْ ... قَبِلَ المُهَيْمِنُ تَوْبَةَ الأَسْيَادِ",
        transliteration: "Ḥalaqū ru'ūsahumu wa-qaṣṣū ẓufrahum ... Qabila l-Muhayminu tawbata l-asyādī",
        translation: {
          en: "They shaved their heads and trimmed their nails in sanctity, and the All-Preserving Lord accepted the repentance of the devout worshippers.",
          ar: "حلقوا رؤوسهم وقصوا أظفارهم تحللاً وطهارة، وتقبل الله المهيمن توبتهم توبة العارفين المقبولين.",
          am: "ራሳቸውን ተላጭተው ጥፍራቸውን ቆረጡ፤ ጠባቂው ጌታም የተከበሩትን አገልጋዮች ተውበት ተቀበለ።",
          har: "ራሳቸውን ተላጭተው ጥፍራቸውን ቆረጡ፤ ጠባቂው ጌታም የተከበሩትን አገልጋዮች ተውበት ተቀበለ።"
        }
      },
      {
        number: 14,
        arabic: "لَبِسُوا ثِيَابَ البِيضِ مَنْشُورَ الرِّضَا ... وَأَنَا المُتَيَّمُ قَدْ لَبِسْتُ سَوَادِي",
        transliteration: "Labisū thiyāba l-bīḍi manshūra r-riḍā ... Wa-anā l-mutayyamu qad labistu sawādī",
        translation: {
          en: "They donned pristine white robes glistening with divine acceptance, while I, the yearning lover, remain clad in the sorrow of separation.",
          ar: "ارتدوا ثياب الإحرام البيضاء مبشرين بالرضوان والمغفرة، وأنا المعذب بالغياب قد لبست حزن البعاد.",
          am: "በይቅርታና ውዴታ የተሞሉ ነጭ ልብሶችን ለበሱ፤ እኔ የራቅኩት አፍቃሪ ግን የርቀቱን ጨለማ ለብሻለሁ።",
          har: "በይቅርታና ውዴታ የተሞሉ ነጭ ልብሶችን ለበሱ፤ እኔ የራቅኩት አፍቃሪ ግን የርቀቱን ጨለማ ለብሻለሁ።"
        }
      },
      {
        number: 15,
        arabic: "يَا رَبِّ أَنْتَ وَصَلْتَهُمْ وَقَطَعْتَنِي ... فَبِحَقِّهِمْ يَا رَبِّ حُلَّ قِيَادِي",
        transliteration: "Yā Rabbi anta waṣaltahum wa-qaṭa'tanī ... Fa-bi-ḥaqqihim yā Rabbi ḥulla qiyādī",
        translation: {
          en: "O Lord! You brought them safely to their destination while holding me back; so for their sake, O Lord, unloose my bonds and grant me arrival!",
          ar: "يا رب أنت وفقتهم للوصول وحرمتني بجسدي، فبجاه هؤلاء المقبولين الصالحين حلّ قيدي ويسّر لي المسير إلى بيتك الحرام.",
          am: "ጌታዬ ሆይ! እነርሱን አደረስካቸው እኔን ግን አስቀረኸኝ፤ በእነርሱ ክብር የተነሳ የታሰርኩበትን ፈትተህ አድርሰኝ!",
          har: "ጌታዬ ሆይ! እነርሱን አደረስካቸው እኔን ግን አስቀረኸኝ፤ በእነርሱ ክብር የተነሳ የታሰርኩበትን ፈትተህ አድርሰኝ!"
        }
      },
      {
        number: 16,
        arabic: "بِاللَّهِ يَا زُوَّارَ قَبْرِ مُحَمَّدٍ ... مَنْ كَانَ مِنْكُمْ رَائِحٌ أَوْ غَادِي",
        transliteration: "Bi-llāhi yā zuwwāra qabri Muḥammadin ... Man kāna minkum rā'iḥun aw ghādī",
        translation: {
          en: "By Allah, O pilgrims visiting the noble resting place of Muhammad ﷺ, whichever of you journeys by dusk or sets out by dawn:",
          ar: "أستحلفكم بالله يا زوار الروضة الشريفة وقبر النبي المصطفى ﷺ، من كان منكم غادياً بالصباح أو رائحاً بالعشي.",
          am: "በአላህ ይሁንባችሁ! የሙሐመድ ﷺ መቃብር ጎብኚዎች ሆይ! ከእናንተ መካከል በጠዋትም ሆነ በማታ የሚጓዝ፡",
          har: "በአላህ ይሁንባችሁ! የሙሐመድ ﷺ መቃብር ጎብኚዎች ሆይ! ከእናንተ መካከል በጠዋትም ሆነ በማታ የሚጓዝ፡"
        }
      },
      {
        number: 17,
        arabic: "لِتُبْلِغُوا المُخْتَارَ أَلْفَ تَحِيَّةٍ ... مِنْ عَاشِقٍ مُتَقَطِّعِ الأَكْبَادِ",
        transliteration: "Li-tuballighū l-Mukhtāra alfa taḥiyyatin ... Min 'āshiqin mutaqaṭṭi'i l-akbādī",
        translation: {
          en: "Convey unto the Chosen Prophet ﷺ a thousand salutations from a devoted lover whose heart aches with unquenchable yearning!",
          ar: "أن تبلغوا النبي المختار المصطفى ﷺ ألف تحية وسلام من محب مخلص يتمزق فؤاده شوقاً إليه.",
          am: "ለተመረጡት ነቢይ ﷺ በናፍቆት ልቡ ከተሰበረው አፍቃሪ ሺህ ሰላምታዎችን አድርሱልኝ!",
          har: "ለተመረጡት ነቢይ ﷺ በናፍቆት ልቡ ከተሰበረው አፍቃሪ ሺህ ሰላምታዎችን አድርሱልኝ!"
        }
      },
      {
        number: 18,
        arabic: "قُولُوا لَهُ عَبْدُ الرَّحِيمِ مُتَيَّمٌ ... وَمُفَارِقُ الأَحْبَابِ وَالأَوْلَادِ",
        transliteration: "Qūlū lahū 'Abdu r-Raḥīmi mutayyamun ... Wa-mufāriqu l-aḥbābi wa-l-awlādī",
        translation: {
          en: "Tell him: 'Abdul Rahim is your enamored servant, having parted from beloved companions and kin in longing for you.'",
          ar: "قولوا له: إن عبد الرحيم البرعي متيم في محبتك، ومفارق لأحبابه وأولاده في سبيل شوقه العارم للقائك.",
          am: "እንዲህ በሉት፡- «አብዱል ረሒም በፍቅርህ የተማረከ ነው፤ ወዳጆቹንና ልጆቹን እንኳ ለፍቅርህ የተወ ነው።»",
          har: "እንዲህ በሉት፡- «አብዱል ረሒም በፍቅርህ የተማረከ ነው፤ ወዳጆቹንና ልጆቹን እንኳ ለፍቅርህ የተወ ነው።»"
        }
      },
      {
        number: 19,
        arabic: "صَلَّى عَلَيْكَ اللَّهُ يَا عَلَمَ الهُدَى ... مَا سَارَ رَكْبٌ أَوْ تَرَنَّمَ حَادِي",
        transliteration: "Ṣallā 'alayka Llāhu yā 'alama l-hudā ... Mā sāra rakbun aw tarannama ḥādī",
        translation: {
          en: "May the blessings and peace of Allah be upon you, O Beacon of Guidance, as long as caravans journey and singers chant along the path!",
          ar: "صلى عليك الله وسلم يا منارة الهدى وخير الورى، ما سارت قافلة في درب أو ترنم حادٍ بنغمات المسير والحنين.",
          am: "የቅን መመሪያ ምልክት የሆንከው ሆይ! የካራቫን ጉዞ እስካለና ዘፋኝ ዝማሬውን እስካሰማ ድረስ የአላህ ሰላምና በረከት በአንተ ላይ ይሁን!",
          har: "የቅን መመሪያ ምልክት የሆንከው ሆይ! የካራቫን ጉዞ እስካለና ዘፋኝ ዝማሬውን እስካሰማ ድረስ የአላህ ሰላምና በረከት በአንተ ላይ ይሁን!"
        }
      }
    ]
  },
  {
    id: 'ibtihal-layl',
    title: {
      en: 'Midnight Supplication & Spiritual Solace (40 Mins)',
      ar: 'ابتهالٌ في جوف الليل — ٤٠ دقيقة تُسكِّن القلب (شجن خاشع ومناجاة)',
      am: 'የሌሊት ዱዓና ልብን የሚያረጋጋ መንፈሳዊ ውዳሴ (40 ደቂቃ)',
      har: 'የሌሊት ዱዓና ልብን የሚያረጋጋ መንፈሳዊ ውዳሴ'
    },
    author: {
      en: 'Classical Masters of Devotion & Nocturnal Munajat',
      ar: 'أئمة المناجاة والابتهال والتضرع في الأسحار',
      am: 'የሌሊት ጸሎትና ውዳሴ አባቶች',
      har: 'የሌሊት ጸሎትና ውዳሴ አባቶች'
    },
    reciter: {
      en: 'Spiritual Melodies & Chants of Solace (40 Minutes)',
      ar: 'ألحان ونفحات الإنشاد والابتهال الشجي الروحاني',
      am: 'መንፈሳዊ ዝማሬዎችና ዜማዎች',
      har: 'መንፈሳዊ ዝማሬዎችና ዜማዎች'
    },
    audioUrl: 'https://archive.org/download/ya-rahilina-mina-al-burai/ya_rahilina_mina.mp3',
    description: {
      en: '40 minutes of heart-soothing midnight supplications, heartfelt repentance, and tranquil nocturnal devotions. A serene sanctuary of words and melodies designed to relieve inner turbulence, deepen spiritual connection, and evoke sincere tears of turning toward the Divine.',
      ar: '٤٠ دقيقة من الابتهالات والمناجاة الخاشعة في جوف الليل والأسحار. مزيج عذب من أرق الكلمات وأشجى النغمات التي تُسكِّن القلب وتطمئن الروح وتجدد التوبة الصادقة والرجاء بين يدي الله عز وجل.',
      am: '40 ደቂቃ የሚቆይ ልብን የሚያረጋጋ፣ የሌሊት ጸሎት፣ ተውባህና መንፈሳዊ እርጋታን የሚሰጥ ድንቅ ውዳሴና ዱዓ።',
      har: '40 ደቂቃ የሚቆይ ልብን የሚያረጋጋ፣ የሌሊት ጸሎት፣ ተውባህና መንፈሳዊ እርጋታን የሚሰጥ ድንቅ ውዳሴና ዱዓ።'
    },
    verses: ibtihalLaylVerses
  },
  {
    id: 'fajr-secrets',
    title: {
      en: 'The Secret Time of Fajr Salah & Sahar in Islam',
      ar: 'أسرار وقت صلاة الفجر والسحر في الإسلام (وثائقي ودليل روحي)',
      am: 'በእስልምና የፈጅር ሶላትና የሰሐር ወቅት ድብቅ ምስጢራት',
      har: 'በኢስላም የሱብሒ ሰላትና የሰሐር ወቅቲ ሚስጢራት'
    },
    author: {
      en: 'Quranic Revelations & Prophetic Sunnah (Religious Story TV)',
      ar: 'آيات قرآنية وأحاديث نبوية شريفة (Religious Story TV)',
      am: 'የቁርአን አንቀጾችና የነቢዩ ﷺ ሱንና (Religious Story TV)',
      har: 'የቁርአን አንቀጾችና የነቢዩ ﷺ ሱንና'
    },
    reciter: {
      en: 'Documentary Narration & Prophetic Duas (14 Chapters • 63 Mins)',
      ar: 'تأملات قرآنية ونبوية وأدعية الفجر والأسحار (١٤ فصلاً)',
      am: '14 ምዕራፎች ያሉት መንፈሳዊና ሳይንሳዊ ትንታኔ',
      har: '14 ምዕራፎች ያሉት መንፈሳዊ ትንታኔ'
    },
    audioUrl: 'https://archive.org/download/ya-rahilina-mina-al-burai/ya_rahilina_mina.mp3',
    description: {
      en: 'Explore the mysterious spiritual and scientific world of Sahar time—the final hours before dawn—and the secrets of Fajr Salah, Tahajjud in the last third of the night, angelic shift-changes at dawn, the distribution of Rizq and Barakah, how to break Shaitan\'s three knots, the Prophet\'s ﷺ morning routine, and the radiant Nur of Fajr.',
      ar: 'استكشف العالم الروحاني والعلمي المهيب لوقت السحر وصلاة الفجر: لماذا كان النبي ﷺ يستيقظ قبل الجميع؟ وما الأسرار الكامنة في التهجد، وقرآن الفجر المشهود، واجتماع ملائكة الليل والنهار، وتقسيم الأرزاق والبركة في البكور، وعقد الشيطان الثلاث، والسباعية النبوية بعد الفجر، وسر النور التام في الوجه والقلب.',
      am: 'ነቢዩ ሙሐመድ ﷺ ዓለም ተኝቶ ሳለ ለምን ቀድመው ይነቁ ነበር? በተሀጁድ፣ በፈጅር ሶላት፣ በመላእክት መሰባሰብ፣ በሲሳይ (ሪዝቅ) እና በረከት ክፍፍል፣ በሸይጣን ሶስት ቋጠሮዎች እና በፈጅር ብርሃን (ኑር) ውስጥ የተደበቁትን 14 መንፈሳዊና ሳይንሳዊ ምስጢራት ይመርምሩ።',
      har: 'በተሀጁድ፣ በሱብሒ ሶላት፣ በመላእክት መሰባሰብ፣ በሪዝቅና በረከት ክፍፍል እና በፈጅር ኑር ውስጥ ያሉትን 14 መንፈሳዊና ሳይንሳዊ ሚስጢራት ይመርምሩ።'
    },
    verses: fajrSecretsVerses
  }
];

interface VideoPart {
  part: number;
  title: {
    en: string;
    ar: string;
  };
  verseRange: string;
  startVerse: number;
  endVerse: number;
  description: {
    en: string;
    ar: string;
  };
  youtubeId: string;
  videoUrl?: string;
  highlights: {
    en: string[];
    ar: string[];
  };
}

const nooniyahVideoParts: VideoPart[] = [
  {
    part: 1,
    title: {
      en: "Part 1: The Divine Speech, Vision of Allah & Resurrection",
      ar: "الجزء الأول: منزلة القرآن ومبدأ العقيدة والتوحيد"
    },
    verseRange: "Verses 1 - 98",
    startVerse: 1,
    endVerse: 98,
    description: {
      en: "This introductory part establishes the absolute sanctity of the Holy Quran as the uncreated, timeless speech of Allah, seeks His divine guidance, and outlines the core tenets of the Islamic creed (Aqeedah).",
      ar: "يبدأ الناظم بالتوسل إلى الله بكتابه الكريم وبداية العقيدة، ثم يبين فضل القرآن الكريم وأنه كلام الله المنزل غير المخلوق، وضرورة التمسك به والاعتصام به من الشبهات والفتن."
    },
    youtubeId: "zR6p_oW96Lw",
    videoUrl: "https://drive.google.com/file/d/10Opn1eu5mQTL0sfbB3B3oXc910joVt5y/view?usp=sharing",
    highlights: {
      en: [
        "Inspirational opening seeking Allah's guidance and mercy",
        "The absolute sanctity and uncreated nature of the Holy Quran",
        "Establishment of the pillars of faith and the divine Decree (Qadar)"
      ],
      ar: [
        "الاستفتاح البديع لطلب الهدى والمغفرة من الله تعالى",
        "إثبات أن القرآن الكريم كلام الله غير مخلوق",
        "ترسيخ أركان الإيمان والرضا بالقضاء والقدر"
      ]
    }
  },
  {
    part: 2,
    title: {
      en: "Part 2: The Divine Speech, Vision of Allah & Resurrection",
      ar: "الجزء الثاني: صفات الله تعالى، ورؤية المؤمنين لربهم، والبعث"
    },
    verseRange: "Verses 99 - 184",
    startVerse: 99,
    endVerse: 184,
    description: {
      en: "Explores the magnificent attributes of Allah, establishes the supreme delight of believers seeing their Lord in the Hereafter, and details the certainty of Resurrection.",
      ar: "يستمر الناظم في إثبات صفات الجلال والكمال لله عز وجل، ويثبت يقيناً رؤية المؤمنين لربهم يوم القيامة وفي الجنة عياناً كأعظم نعيم، مع إثبات عقيدة البعث بعد الموت."
    },
    youtubeId: "_X6tKjW_Ulo",
    videoUrl: "https://drive.google.com/file/d/17G5TIgsI8slwCHMlPQ30XDe0zpDiS9q-/view?usp=sharing",
    highlights: {
      en: [
        "The attributes of Allah's Speech and His divine Highness ('Uluww)",
        "The supreme joy of seeing Allah in the Hereafter",
        "The reality of Resurrection and the restoration of souls to bodies"
      ],
      ar: [
        "إثبات صفة الكلام لله وعلوه سبحانه فوق خلقه",
        "إثبات عقيدة رؤية الله في الآخرة عياناً للمؤمنين",
        "حقيقة البعث والنشور وإعادة الأرواح للأبدان"
      ]
    }
  },
  {
    part: 3,
    title: {
      en: "Part 3: Jurisprudence of Worship & The Blessed Sunnah",
      ar: "الجزء الثالث: فقه العبادات (الوضوء والصلاة) ومكانة السنة"
    },
    verseRange: "Verses 185 - 260",
    startVerse: 185,
    endVerse: 260,
    description: {
      en: "Details the practical rules of daily worship, emphasizing the perfect performance of ablution (Wudhu), the reverence of Prayer (Salah), and adherence to the clear Sunnah.",
      ar: "ينتقل الناظم إلى الجانب العملي والعبادات، فيفصل أحكام الوضوء المسبغ، وأهمية الصلوات الخمس في أوقاتها، والخشوع التام في الوقوف بين يدي الله تعالى."
    },
    youtubeId: "7z3x1L5oW9Q",
    videoUrl: "https://drive.google.com/file/d/1lCUMZlDHTBsmkhrGaEhhvlNacV4d-KTx/view?usp=sharing",
    highlights: {
      en: [
        "Detailed step-by-step description of a complete, perfect Wudhu",
        "The supreme importance of performing the five daily prayers on time",
        "Shortening prayers during travel and the rulings of wiping over khuffs"
      ],
      ar: [
        "الوصف الدقيق المسهب للوضوء الصحيح الكامل المسبغ",
        "منزلة الصلوات الخمس والمحافظة عليها في جماعة",
        "فقه رخص السفر وقصر الصلاة والمسح على الخفين"
      ]
    }
  },
  {
    part: 4,
    title: {
      en: "Part 4: Refuting Astrology & False Philosophies",
      ar: "الجزء الرابع: الرد على التنجيم والمنجمين ومذهب الفلاسفة"
    },
    verseRange: "Verses 261 - 345",
    startVerse: 261,
    endVerse: 345,
    description: {
      en: "Exposes the fallacies of astrology, naturalism, and Greek philosophies, calling believers to stay anchored in the authentic prophetic teachings.",
      ar: "يفرد الناظم هذا الفصل لتفنيد ادعاءات المنجمين وربط السعد والنحس بالنجوم، ويرد بقوة على فلاسفة اليونان ومذهب الطبيعيين والدهريين مبيناً عجز عقولهم."
    },
    youtubeId: "FmS_39K_r4U",
    videoUrl: "https://drive.google.com/file/d/1mbjKNbJUkkRy0z5QiWT9wIOFS9ZU7koc/view?usp=sharing",
    highlights: {
      en: [
        "Invalidation of astrology and matching fortune to star signs",
        "Refutation of naturalism and the claim that nature creates itself",
        "Praising the divine wisdom and artistry apparent in creation"
      ],
      ar: [
        "إبْطال علم التنجيم وادعاء معرفة الغيب بحركة الكواكب",
        "الرد على ملاحدة الطبيعيين القائلين بنشوء الكون صدفة",
        "إثبات الحكمة البالغة والتدبير الإلهي المحكم للأكوان"
      ]
    }
  },
  {
    part: 5,
    title: {
      en: "Part 5: Noble Companions, Abu Bakr & Umar",
      ar: "الجزء الخامس: حب الصحابة ومناقب الصديق والفاروق"
    },
    verseRange: "Verses 346 - 430",
    startVerse: 346,
    endVerse: 430,
    description: {
      en: "Illustrates the core creed of loving the Prophet's Companions (Sahabah) and expands on the immense virtues, sacrifices, and leadership of Abu Bakr and Umar.",
      ar: "يستعرض الناظم عقيدة أهل السنة الوسطية في حب آل البيت والصحابة معاً، ويسرد مناقب الصديق أبي بكر رفيق الغار، والفاروق عمر ناشر العدل رضي الله عنهما."
    },
    youtubeId: "K96H78bL98s",
    videoUrl: "https://drive.google.com/file/d/1i4YXAhGJz5cD1MjrGtrMIWxgkLqxB4r9/view?usp=sharing",
    highlights: {
      en: [
        "The status of the Sahabah as the golden generation of Islam",
        "The unmatched virtues of Abu Bakr Al-Siddiq, the companion in the cave",
        "The courage and justice of Umar Al-Farooq, who separated truth from falsehood"
      ],
      ar: [
        "منزلة الصحابة الكرام وفضلهم كخير قرون الأمة",
        "مناقب الصديق أبي بكر الأرفع قدراً وصاحب الغار",
        "عدل وقوة الفاروق عمر بن الخطاب رضي الله عنه"
      ]
    }
  },
  {
    part: 6,
    title: {
      en: "Part 6: Uthman & Ali, and Safeguarding Against Sectarian Discord",
      ar: "الجزء السادس: مناقب ذي النورين وأمير المؤمنين واجتناب الفتن"
    },
    verseRange: "Verses 431 - 515",
    startVerse: 431,
    endVerse: 515,
    description: {
      en: "Continues with the virtues of Uthman ibn Affan and Ali ibn Abi Talib, and outlines the correct method of staying silent on historic disputes to preserve unity.",
      ar: "يكمل الناظم ذكر مناقب ذي النورين عثمان بن عفان، وأمير المؤمنين علي بن أبي طالب صهر المصطفى، ثم يسرد عقيدة الكف عما شجر بين الصحابة وحرمة الطعن فيهم."
    },
    youtubeId: "p57zU1m69QA",
    videoUrl: "https://drive.google.com/file/d/1rFMRSVrjieq5As4y3vNYt6Jy90EzVe8M/view?usp=sharing",
    highlights: {
      en: [
        "The generosity and martyrdom of Uthman ibn Affan (Dhun-Noorayn)",
        "The deep knowledge, chivalry, and status of Ali ibn Abi Talib",
        "The golden rule of avoiding sectarian fits and preserving the honor of all Sahabah"
      ],
      ar: [
        "حياء وجود وعطاء عثمان بن عفان رضي الله عنه",
        "مناقب علي بن أبي طالب باب العلم وأخو الرسول في المؤاخاة",
        "وجوب الكف عما شجر بين الصحابة وحفظ ألسنتنا من الفتنة"
      ]
    }
  },
  {
    part: 7,
    title: {
      en: "Part 7: Moral Rectitude, Sincerity & Zuhd (Asceticism)",
      ar: "الجزء السابع: تهذيب النفس ومحاسن الأخلاق والزهد والورع"
    },
    verseRange: "Verses 516 - 600",
    startVerse: 516,
    endVerse: 600,
    description: {
      en: "Provides timeless spiritual advice on purifying the soul, practicing humility, avoiding forbidden deeds, and developing a heart filled with sincere devotion.",
      ar: "ينتقل الناظم إلى المواعظ القلبية والتربية السلوكية، فيحث على التواضع والزهد الشرعي، والتحذير من الغيبة والكبر والربا وأكل أموال الناس بالباطل."
    },
    youtubeId: "S8w8MhL8Z9A",
    videoUrl: "https://drive.google.com/file/d/194xQtNQI1MfdmYzT3Yg8FD0g1j8jduFj/view?usp=sharing",
    highlights: {
      en: [
        "The concept of true Zuhd (detaching the heart from worldly greed)",
        "Guarding the tongue from backbiting, slander, and gossip",
        "Developing internal sincerity and fearing Allah in secrecy and public"
      ],
      ar: [
        "مفهوم الزهد الشرعي بعدم جعل الدنيا في القلوب",
        "حفظ اللسان من الغيبة والنميمة ومطاعن الناس",
        "ترسيخ الإخلاص لله وملازمة التقوى في السر والعلن"
      ]
    }
  },
  {
    part: 8,
    title: {
      en: "Part 8: Pursuit of Sacred Knowledge & The Blessed Conclusion to Nooniyah Al Qahtani Complete Poem with English Translation recited by Fares Abbad",
      ar: "الجزء الثامن: فضل طلب العلم وعلو الهمة والختام المبارك بالدعاء (بصوت فارس عباد وترجمة إنجليزية)"
    },
    verseRange: "Verses 601 - 690",
    startVerse: 601,
    endVerse: 690,
    description: {
      en: "Concludes with an inspiring, magnificent call to seek sacred knowledge, cultivate high aspirations, followed by a deeply moving final repentance and prayer.",
      ar: "الفصل الختامي البديع؛ يحث فيه على المبادرة لطلب العلم الشرعي النافع وملازمة العلماء، واغتنام الأوقات وعلو الهمة، ثم يختم بالتوبة والرحمة لجميع المسلمين."
    },
    youtubeId: "Y8Z8m_Z9A6M",
    videoUrl: "https://drive.google.com/file/d/1hRIEgCsWI_wVvJlK9SvZ8fAMam5XdmPn/view?usp=sharing",
    highlights: {
      en: [
        "The unmatched honor and virtues of seeking and teaching sacred knowledge",
        "Maintaining high aspirations (Himmah) and guarding precious time",
        "The deeply touching concluding supplication seeking Allah's ultimate forgiveness"
      ],
      ar: [
        "شرف ومكانة طلب العلم الشرعي وميراث النبوة",
        "علو الهمة واغتنام ساعات العمر والتحذير من التسويف",
        "الختام المؤثر بالاعتراف بالتقصير والاستغفار والتوبة"
      ]
    }
  }
];

const burdaVideoPart = {
  part: 1,
  title: {
    en: "Qasida Al-Burda - Complete Traditional Recitation",
    ar: "قصيدة البردة المباركة - إنشاد جماعي مغربي عذب"
  },
  verseRange: "Complete Poem",
  startVerse: 1,
  endVerse: 10,
  description: {
    en: "Experience the legendary panegyric ode composed by Imam Al-Busiri in praise of Prophet Muhammad ﷺ. Celebrated globally for its rhythmic beauty, artistic depth, and deep spiritual resonance.",
    ar: "عِش تجربة روحية فريدة مع قصيدة البردة المباركة للإمام البوصيري، المنشدة بأداء جماعي متميز يجمع بين عذوبة الألحان وجمال التراث الإسلامي الأصيل."
  },
  youtubeId: "Q_j8Bsc6l9A",
  highlights: {
    en: [
      "Traditional Moroccan and Andalusian acoustic rhythms",
      "Celebrates the immense spiritual depth and legacy of Al-Burda",
      "Communal chanting emphasizing unity and love"
    ],
    ar: [
      "أداء تراثي متميز على المقامات والطبوع الأندلسية والمغربية",
      "أجواء روحانية عالية تأخذ السامع في رحلة إيمانية خاشعة",
      "ترديد جماعي متناغم يبرز جمالية القصيدة وبلاغتها الفريدة"
    ]
  }
};

const yaRahilinaVideoPart = {
  part: 1,
  title: {
    en: "Ya Rahilina Ila Mina - Hamza Khalid Al-Humaidi (Official Nasheed & Ode)",
    ar: "يا راحلين إلى منى بقيادي - ألحان وإنتاج وأداء حمزة خالد الحميدي (كلمات: عبد الرحيم البرعي)"
  },
  verseRange: "Complete Ode (19 Verses)",
  startVerse: 1,
  endVerse: 19,
  description: {
    en: "Experience the moving spiritual video produced and chanted by Hamza Khalid Al-Humaidi featuring the timeless poem of Imam Abdul Rahim Al-Bura'i. The visual journey portrays pilgrim caravans crossing the desert to Mina, tearful circumambulation around the Holy Kaaba in Tawaf, peaceful standing on Mount Arafat, Muzdalifah, and deep emotional salutations upon Prophet Muhammad ﷺ in Madinah.",
    ar: "شاهد هذا العمل المرئي والإنشادي الروحاني البديع من ألحان وإنتاج وأداء المنشد حمزة خالد الحميدي، لكلمات الإمام عبد الرحيم البرعي اليماني. يستعرض الفيديو مشاهد ملحمية خاشعة لقوافل الحجيج في الصحراء، ومشعر منى، والطواف حول الكعبة المشرفة، وصعيد عرفات، والمسعى بين الصفا والمروة، والروضة النبوية الشريفة بالمدينة المنورة."
  },
  driveFolderUrl: "https://drive.google.com/drive/folders/1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq?usp=drive_link",
  driveFolderId: "1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq",
  driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq#grid",
  youtubeId: "kp4fMKQFtEk",
  youtubeUrl: "https://www.youtube.com/watch?v=kp4fMKQFtEk",
  highlights: {
    en: [
      "Touching journey of pilgrim caravans departing across the desert towards Mina",
      "Heartfelt remembrance of the lover while circumambulating the Holy Kaaba in Tawaf",
      "Purification of hearts on the blessed Mount of Arafat and peaceful night in Muzdalifah",
      "Wearing the radiant white garments of divine pleasure and sacrificing worldly ego",
      "Sending one thousand salutations of peace to Prophet Muhammad ﷺ in Madinah"
    ],
    ar: [
      "مسيرة قوافل الحجاج في الصحراء المباركة نحو مشعر منى والحرمين الشريفين",
      "تذكر المحب المتيم ودموع الشوق عند الطواف بالكعبة المشرفة والسعي بين الصفا والمروة",
      "جلاء القلوب في صعيد عرفات الطاهر وسكينة المبيت بمزدلفة المباركة",
      "ارتداء ثياب الإحرام البيضاء ونحر الهوى والتجرد التام لرب العالمين",
      "إبلاغ النبي المختار المصطفى ﷺ ألف تحية وسلام عاطر بالمدينة المنورة"
    ]
  }
};

const ibtihalLaylVideoPart = {
  part: 1,
  title: {
    en: "Midnight Supplication & Spiritual Solace (40 Minutes of Soul-Soothing Devotion)",
    ar: "ابتهالٌ في جوف الليل — ٤٠ دقيقة تُسكِّن القلب — شجن خاشع ومناجاة"
  },
  verseRange: "Nocturnal Devotion (24 Verses)",
  startVerse: 1,
  endVerse: 24,
  description: {
    en: "Immerse yourself in 40 minutes of deep peace, nocturnal munajat, and moving supplications in the stillness of the night. Featuring heartfelt recitations and evocative melodies that bring tranquility to restless souls, profound contemplation, and tearful turning to Allah in sincere repentance and hope.",
    ar: "استمع وعش ٤٠ دقيقة من السكينة الروحية والمناجاة الخاشعة في جوف الليل والأسحار. ابتهالات ودعوات تلامس أوتار القلوب وتهدئ الروح، تجمع بين صدق الافتقار والتوبة ونفحات الرجاء والمغفرة بين يدي الرحمن الرحيم."
  },
  driveFolderUrl: "https://drive.google.com/drive/folders/1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq?usp=drive_link",
  driveFolderId: "1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq",
  driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq#grid",
  youtubeId: "qZLGZqywU6I",
  youtubeUrl: "https://youtu.be/qZLGZqywU6I?si=pxprEUro-HhJqqc8",
  highlights: {
    en: [
      "40 minutes of continuous, soul-comforting midnight supplication and munajat",
      "Profound spiritual intimacy and turning to Allah during the peaceful nocturnal hours",
      "Heartfelt verses of sincere repentance (Tawbah), hope (Rajaa), and absolute reliance",
      "Evocative melodic maqams designed to relieve anxiety, stress, and heavy grief",
      "Direct Google Drive cloud storage and YouTube high-definition streaming integration"
    ],
    ar: [
      "٤٠ دقيقة متواصلة من الابتهالات والمناجاة الخاشعة التي تُسكِّن القلوب وتبعث الطمأنينة",
      "أجواء إيمانية فريدة في خلوة جوف الليل ومناجاة علام الغيوب وسامع النجوى",
      "قصائد وأبيات التوبة النصوح والافتقار الصادق والرجاء العظيم في عفو الله ورحمته",
      "ألحان ومقامات شجية مؤثرة تفرج الكرب وتزيل هموم الصدور والأحزان",
      "ربط مباشر مع مجلد Google Drive السحابي ومشغل YouTube فائق الجودة"
    ]
  }
};

const fajrSecretsVideoPart = {
  part: 1,
  title: {
    en: "The Secret Time of Fajr Salah in Islam (14-Chapter Spiritual & Scientific Documentary)",
    ar: "أسرار وقت صلاة الفجر والسحر في الإسلام (وثائقي شامل من ١٤ فصلاً)"
  },
  verseRange: "14 Chapters • 1h 03m",
  startVerse: 1,
  endVerse: 14,
  description: {
    en: "Why did the Prophet Muhammad ﷺ wake up before everyone else while the world was still asleep? What secrets are hidden inside the hours of Tahajjud, Fajr prayer, and sunrise? This 14-chapter documentary combines Quranic verses, authentic Hadiths (Bukhari & Muslim), spiritual reflections, and modern circadian biology to unveil the hidden system of dawn.",
    ar: "لماذا كان النبي محمد ﷺ يستيقظ قبل الجميع بينما يغط العالم في النوم؟ وما الأسرار المودعة في ساعات السحر والتهجد وصلاة الفجر والشروق؟ يجمع هذا العمل الوثائقي (١٤ فصلاً) بين الآيات القرآنية والأحاديث الصحيحة والحقائق العلمية البيولوجية لكشف أعظم نظام إلهي في حياة الإنسان."
  },
  driveFolderUrl: "https://drive.google.com/drive/folders/1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq?usp=drive_link",
  driveFolderId: "1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq",
  driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=1yBYV_N_4leL8qzCDRDmeeTEHx4wLz6fq#grid",
  youtubeId: "rkqNzpAeeFE",
  youtubeUrl: "https://www.youtube.com/watch?v=rkqNzpAeeFE",
  highlights: {
    en: [
      "Why Fajr Salah is witnessed by the angels of the night and day (Quran 17:78)",
      "The spiritual secrets of Tahajjud & Divine Descent in the last third of the night",
      "Why Rizq (sustenance) and Barakah are distributed in the early morning hours",
      "7 Prophetic deeds after Fajr that grant the complete reward of Hajj and Umrah",
      "How to break Shaitan's 3 knots ('Just 10 more minutes') through Dhikr, Wudhu & Salah",
      "The biological clock effects of waking before sunrise & the secret of Nur on the face"
    ],
    ar: [
      "أسرار قرآن الفجر المشهود واجتماع ملائكة الليل والنهار في صلاة الصبح",
      "الأسرار الروحية لقيام الليل (التهجد) والتنزل الإلهي في الثلث الأخير من الليل",
      "ارتباط تقسيم الأرزاق والبركة بساعات البكور ودعاء النبي ﷺ لأمته",
      "السباعية النبوية بعد صلاة الفجر لنيل أجر حجة وعمرة تامة تامة تامة",
      "كيف تحل عقد الشيطان الثلاث («عليك ليل طويل فارقد») بالذكر والوضوء والصلاة",
      "التأثير العلمي للاستيقاظ قبل الشروق على الساعة البيولوجية وسر النور التام في الوجه والقلب"
    ]
  }
};

const getVerseTime = (verseNum: number, totalDuration: number, totalVerses: number = 690): number => {
  const duration = totalDuration || 2540;
  const intro = 10;
  const outro = 10;
  const netDuration = duration - intro - outro;
  
  if (verseNum <= 1) return intro;
  if (verseNum >= totalVerses) return duration - outro;
  
  return intro + ((verseNum - 1) / totalVerses) * netDuration;
};

const getVerseFromTime = (t: number, totalDuration: number, totalVerses: number = 690): number => {
  const duration = totalDuration || 2540;
  const intro = 10;
  const outro = 10;
  const netDuration = duration - intro - outro;
  
  if (t < intro) return 1;
  if (t > duration - outro) return totalVerses;
  
  return Math.min(totalVerses, Math.max(1, Math.floor(((t - intro) / netDuration) * totalVerses) + 1));
};

const getPlayableSource = (url: string) => {
  if (!url) return null;
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return {
        type: 'iframe',
        src: `https://drive.google.com/file/d/${match[1]}/preview`
      };
    }
  }
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let ytId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      ytId = match[2];
    }
    if (ytId) {
      return {
        type: 'iframe',
        src: `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=0`
      };
    }
  }

  return {
    type: 'video',
    src: url
  };
};

const DB_NAME = 'PoetryVideoDB';
const STORE_NAME = 'videos';

const saveVideoToDB = (part: number, value: File | string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, part);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
};

const loadVideosFromDB = (): Promise<{[key: number]: File | string}> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const videos: {[key: number]: File | string} = {};
      
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = (e) => {
        const cursor = (e.target as any).result;
        if (cursor) {
          videos[Number(cursor.key)] = cursor.value;
          cursor.continue();
        } else {
          resolve(videos);
        }
      };
      cursorRequest.onerror = () => reject(cursorRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
};

const deleteVideoFromDB = (part: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(part);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
};

const PoetrySection: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPoemId, setSelectedPoemId] = useState<string>(() => {
    return localStorage.getItem('selectedPoemId') || 'burda';
  });
  const [activeTab, setActiveTab] = useState<'text' | 'audio' | 'video'>(() => {
    return (localStorage.getItem('poetryActiveTab') as any) || 'text';
  });
  const [textFormat, setTextFormat] = useState<'arabic' | 'translation' | 'transliteration' | 'all'>('all');
  const [activeVideoPart, setActiveVideoPart] = useState<number>(() => {
    const val = localStorage.getItem('activeVideoPart');
    return val ? Number(val) : 1;
  });
  const [localVideoFiles, setLocalVideoFiles] = useState<{[key: number]: string}>({});
  const fileInputRefs = useRef<{[key: number]: HTMLInputElement | null}>({});

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedVerseNumber, setCopiedVerseNumber] = useState<number | null>(null);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [nooniyahChapterFilter, setNooniyahChapterFilter] = useState<number | 'all'>(() => {
    const val = localStorage.getItem('nooniyahChapterFilter');
    return val === 'all' || !val ? 'all' : Number(val);
  });
  const [nooniyahAudioChapterFilter, setNooniyahAudioChapterFilter] = useState<number | 'all'>(() => {
    const val = localStorage.getItem('nooniyahAudioChapterFilter');
    return val === 'all' || !val ? 'all' : Number(val);
  });
  const [yaRahilinaViewMode, setYaRahilinaViewMode] = useState<'stream' | 'drive'>('stream');
  const [ibtihalLaylViewMode, setIbtihalLaylViewMode] = useState<'stream' | 'drive'>('stream');
  const [fajrSecretsViewMode, setFajrSecretsViewMode] = useState<'stream' | 'drive'>('stream');
  const [fajrStartTime, setFajrStartTime] = useState<number>(0);
  const [fajrAutoplay, setFajrAutoplay] = useState<number>(0);
  const [activeFajrChapter, setActiveFajrChapter] = useState<number | 'all'>('all');

  // Dual Audio Mode & Failover States
  const [audioMode, setAudioMode] = useState<'online' | 'tts'>('online');
  const [hasAudioError, setHasAudioError] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert(language === 'ar' ? 'يرجى اختيار ملف فيديو صالح.' : 'Please select a valid video file.');
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalVideoFiles(prev => {
      if (prev[activeVideoPart]) {
        URL.revokeObjectURL(prev[activeVideoPart]);
      }
      return { ...prev, [activeVideoPart]: url };
    });
    saveVideoToDB(activeVideoPart, file).catch(err => {
      console.warn("Failed to save video to IndexedDB:", err);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleVideoFile(file);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(localVideoFiles).forEach((url: unknown) => {
        const urlStr = url as string;
        if (urlStr && urlStr.startsWith('blob:')) {
          URL.revokeObjectURL(urlStr);
        }
      });
    };
  }, [localVideoFiles]);

  const selectedPoemIdRef = useRef(selectedPoemId);
  const audioModeRef = useRef(audioMode);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('selectedPoemId', selectedPoemId);
  }, [selectedPoemId]);

  useEffect(() => {
    localStorage.setItem('poetryActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('activeVideoPart', activeVideoPart.toString());
  }, [activeVideoPart]);

  useEffect(() => {
    localStorage.setItem('nooniyahChapterFilter', nooniyahChapterFilter.toString());
  }, [nooniyahChapterFilter]);

  useEffect(() => {
    localStorage.setItem('nooniyahAudioChapterFilter', nooniyahAudioChapterFilter.toString());
  }, [nooniyahAudioChapterFilter]);

  // Load custom videos from IndexedDB on mount
  useEffect(() => {
    loadVideosFromDB()
      .then((videos) => {
        const urls: {[key: number]: string} = {};
        
        // Default persistent drive link requested by the user for Part 1
        const part1DriveUrl = 'https://drive.google.com/file/d/10Opn1eu5mQTL0sfbB3B3oXc910joVt5y/view?usp=sharing';
        urls[1] = part1DriveUrl;

        // Default persistent drive link requested by the user for Part 2
        const part2DriveUrl = 'https://drive.google.com/file/d/17G5TIgsI8slwCHMlPQ30XDe0zpDiS9q-/view?usp=sharing';
        urls[2] = part2DriveUrl;

        // Default persistent drive link requested by the user for Part 3
        const part3DriveUrl = 'https://drive.google.com/file/d/1lCUMZlDHTBsmkhrGaEhhvlNacV4d-KTx/view?usp=sharing';
        urls[3] = part3DriveUrl;

        // Default persistent drive link requested by the user for Part 4
        const part4DriveUrl = 'https://drive.google.com/file/d/1mbjKNbJUkkRy0z5QiWT9wIOFS9ZU7koc/view?usp=sharing';
        urls[4] = part4DriveUrl;

        // Default persistent drive link requested by the user for Part 5
        const part5DriveUrl = 'https://drive.google.com/file/d/1i4YXAhGJz5cD1MjrGtrMIWxgkLqxB4r9/view?usp=sharing';
        urls[5] = part5DriveUrl;

        // Default persistent drive link requested by the user for Part 6
        const part6DriveUrl = 'https://drive.google.com/file/d/1rFMRSVrjieq5As4y3vNYt6Jy90EzVe8M/view?usp=sharing';
        urls[6] = part6DriveUrl;

        // Default persistent drive link requested by the user for Part 7
        const part7DriveUrl = 'https://drive.google.com/file/d/194xQtNQI1MfdmYzT3Yg8FD0g1j8jduFj/view?usp=sharing';
        urls[7] = part7DriveUrl;

        // Default persistent drive link requested by the user for Part 8
        const part8DriveUrl = 'https://drive.google.com/file/d/1hRIEgCsWI_wVvJlK9SvZ8fAMam5XdmPn/view?usp=sharing';
        urls[8] = part8DriveUrl;

        Object.entries(videos).forEach(([part, file]) => {
          if (typeof file === 'string') {
            urls[Number(part)] = file;
          } else if (file) {
            urls[Number(part)] = URL.createObjectURL(file as any);
          }
        });
        setLocalVideoFiles(urls);
      })
      .catch((err) => {
        console.warn("Failed to load videos from IndexedDB:", err);
      });
  }, []);

  useEffect(() => {
    selectedPoemIdRef.current = selectedPoemId;
  }, [selectedPoemId]);

  useEffect(() => {
    audioModeRef.current = audioMode;
  }, [audioMode]);

  const {
    isSpeaking,
    isPaused: isTtsPaused,
    isLoading: isTtsLoading,
    speak: speakTts,
    stop: stopTts,
    pause: pauseTts,
    resume: resumeTts,
    activeText
  } = useTTS();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentPoem = poemsData.find(p => p.id === selectedPoemId) || poemsData[0];
  const isFirstMountRef = useRef(true);

  // Event handlers for the JSX audio element
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (selectedPoemId === 'nooniyah' && audioMode === 'online') {
        const currentVerse = getVerseFromTime(audioRef.current.currentTime, audioRef.current.duration || 2540);
        setHighlightedVerse(currentVerse);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    if (audioRef.current) {
      console.warn("Audio playback/load error detected:", audioRef.current.src);
      setHasAudioError(true);
      setIsPlaying(false);
    }
  };

  // Pause previous audio on switch
  useEffect(() => {
    setHasAudioError(false);
    if (!isFirstMountRef.current) {
      setNooniyahChapterFilter('all');
      setNooniyahAudioChapterFilter('all');
    }
    isFirstMountRef.current = false;

    if (audioMode === 'tts') {
      stopTts();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying && audioMode === 'online') {
        audioRef.current.play()
          .catch(err => {
            console.warn("Autoplay blocked:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [selectedPoemId]);

  // Clean up and sync global pause listener & custom open-poetry-work listener
  useEffect(() => {
    const handleGlobalPause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      stopTts();
    };
    const handleOpenPoetryWork = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.poemId) {
        setSelectedPoemId(customEvent.detail.poemId);
      }
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      if (typeof customEvent.detail?.startTime === 'number') {
        setFajrStartTime(customEvent.detail.startTime);
        setFajrAutoplay(1);
      }
    };
    window.addEventListener('pause-recitation', handleGlobalPause);
    window.addEventListener('open-poetry-work', handleOpenPoetryWork);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTts();
      window.removeEventListener('pause-recitation', handleGlobalPause);
      window.removeEventListener('open-poetry-work', handleOpenPoetryWork);
    };
  }, []);

  // Sync state parameters to audio node
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate, isMuted]);

  // User interaction tracking to unlock playback for browsers with strict autoplay policies
  useEffect(() => {
    const unlock = () => {
      setIsMuted(false);
      
      if (audioRef.current) {
        audioRef.current.muted = false;
        // Safe quick play/pause to unlock audio context in standard browsers
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioRef.current?.pause();
            })
            .catch(err => {
              console.log("Audio auto-unlock info:", err);
            });
        }
      }
      
      // Clean up the listeners once user has interacted
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Sync playing state with TTS speaking state
  useEffect(() => {
    if (audioMode === 'tts') {
      setIsPlaying(isSpeaking && !isTtsPaused);
    }
  }, [isSpeaking, isTtsPaused, audioMode]);

  const togglePlayPause = () => {
    if (audioMode === 'tts') {
      if (isSpeaking) {
        if (isTtsPaused) {
          resumeTts();
        } else {
          pauseTts();
        }
      } else {
        // Recite from the currently highlighted/selected verse, or start from verse 1
        const targetVerseNum = highlightedVerse || 1;
        const targetVerse = currentPoem.verses.find(v => v.number === targetVerseNum) || currentPoem.verses[0];
        if (targetVerse) {
          window.dispatchEvent(new Event('pause-recitation'));
          setHighlightedVerse(targetVerse.number);
          speakTts(targetVerse.arabic, 'ar');
        }
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause any active Azan or global reciters
      window.dispatchEvent(new Event('pause-recitation'));
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasAudioError(false);
        })
        .catch(err => {
          console.error("Playback failed:", err);
          setHasAudioError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (val: number) => {
    if (audioMode === 'tts') return; // Seek disabled in synthesis mode
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (timeInSecs: number): string => {
    if (isNaN(timeInSecs)) return '00:00';
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredVerses = currentPoem.verses.filter(verse => {
    // If Nooniyah, filter by chapter range first
    if (selectedPoemId === 'nooniyah' && nooniyahChapterFilter !== 'all') {
      const partObj = nooniyahVideoParts[nooniyahChapterFilter - 1];
      if (partObj) {
        if (verse.number < partObj.startVerse || verse.number > partObj.endVerse) {
          return false;
        }
      }
    }
    if (selectedPoemId === 'fajr-secrets' && activeFajrChapter !== 'all') {
      if (verse.number !== activeFajrChapter) {
        return false;
      }
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      verse.arabic.includes(query) ||
      verse.transliteration.toLowerCase().includes(query) ||
      verse.translation.en.toLowerCase().includes(query) ||
      (verse.translation.ar && verse.translation.ar.toLowerCase().includes(query)) ||
      (verse.translation.am && verse.translation.am.toLowerCase().includes(query))
    );
  });

  const getLocalized = (obj: any) => {
    return obj[language] || obj.en;
  };

  const getChapterShortTitle = (part: VideoPart, lang: string) => {
    const title = lang === 'ar' ? part.title.ar : part.title.en;
    if (lang === 'ar') {
      return title
        .replace(/^الجزء الأول:\s*/, '')
        .replace(/^الجزء الثاني:\s*/, '')
        .replace(/^الجزء الثالث:\s*/, '')
        .replace(/^الجزء الرابع:\s*/, '')
        .replace(/^الجزء الخامس:\s*/, '')
        .replace(/^الجزء السادس:\s*/, '')
        .replace(/^الجزء السابع:\s*/, '')
        .replace(/^الجزء الثامن:\s*/, '');
    } else {
      return title.replace(/^Part \d+:\s*/i, '');
    }
  };

  return (
    <section className="space-y-8 pb-12" id="poetry-section">
      {/* Intro Header Banner */}
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-secondary-400/20 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-400/10 text-secondary-300 text-xs font-bold uppercase tracking-wider border border-secondary-400/20">
            <Sparkles size={12} className="animate-pulse" />
            <span>{language === 'ar' ? 'البلاغة والقصائد الروحية' : 'Spiritual Poetry & Odes'}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
            {language === 'ar' ? 'القصائد والمدائح الروحية ونونية القحطاني' : 'Spiritual Poetry, Odes & Nooniyah Companion'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {language === 'ar' 
              ? 'تذوق جمال البيان الإسلامي والأشواق الروحية وعلم العقيدة من خلال أروع قصائد الأدب الإسلامي المنظوم (قصيدة البردة، نونية القحطاني، ويا راحلين إلى منى)، مع خدمة الترجمة والتبويب والأداء الصوتي والمرئي المتقن.'
              : 'Immerse yourself in the aesthetic splendor, eloquence, and foundational creeds of classical Islamic literature. Experience word-for-word bilingual translations, phonetic guides, and legendary acoustic and visual recitations.'}
          </p>
        </div>
      </div>

      {/* Tabs Selector Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs text-left">
        {/* Poem Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/45 dark:border-slate-800 shrink-0 flex-wrap gap-1">
          {poemsData.map(poem => {
            const isSelected = selectedPoemId === poem.id;
            return (
              <button
                key={poem.id}
                onClick={() => setSelectedPoemId(poem.id)}
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 select-none cursor-pointer focus:outline-none
                  ${isSelected
                    ? 'bg-primary-800 text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <BookOpen size={15} />
                <span>
                  {poem.id === 'burda'
                    ? (language === 'ar' ? 'قصيدة البردة' : (language === 'am' ? 'ቃሲዳ አል-ቡርዳ' : (language === 'har' ? 'ቃሲዳ አል-ቡርዳ' : 'Qasida Al-Burda')))
                    : poem.id === 'nooniyah'
                      ? (language === 'ar' ? 'نونية القحطاني' : (language === 'am' ? 'ኑኒያህ አል-ቃሕጣኒ' : (language === 'har' ? 'ኑኒያህ አል-ቃሕጣኒ' : 'Nooniyah Al-Qahtani')))
                      : poem.id === 'ya-rahilina'
                        ? (language === 'ar' ? 'يا راحلين إلى منى' : (language === 'am' ? 'ያ ራሒሊነ ኢላ ሚና' : (language === 'har' ? 'ያ ራሒሊነ ኢላ ሚና' : 'Ya Rahilina Ila Mina')))
                        : poem.id === 'ibtihal-layl'
                          ? (language === 'ar' ? 'ابتهال جوف الليل' : (language === 'am' ? 'የሌሊት ዱዓና ውዳሴ' : (language === 'har' ? 'የሌሊት ዱዓ' : 'Midnight Supplication')))
                          : (language === 'ar' ? 'أسرار صلاة الفجر والسحر' : (language === 'am' ? 'የፈጅር ሶላት ምስጢራት' : (language === 'har' ? 'የሱብሒ ሚስጢራት' : 'Secrets of Fajr & Sahar')))}
                </span>
              </button>
            );
          })}
        </div>

        {/* Media Form Selector (Text / Audio / Video) */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/45 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none
              ${activeTab === 'text'
                ? 'bg-primary-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
          >
            <BookOpen size={15} />
            <span>{language === 'ar' ? 'النص والترجمات' : 'Text & Translations'}</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none
              ${activeTab === 'audio'
                ? 'bg-primary-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
          >
            <Volume2 size={15} />
            <span>{language === 'ar' ? 'الصوت والتلاوة' : 'Audio Recitation'}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('video');
              window.dispatchEvent(new Event('pause-recitation'));
            }}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none
              ${activeTab === 'video'
                ? 'bg-primary-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
          >
            <Video size={15} />
            <span>{language === 'ar' ? 'الفيديو التعليمي' : 'Video Companion'}</span>
          </button>
        </div>
      </div>

      {/* Render Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* Format Control Panel */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-900/45 p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-xs">
            {/* Format Option Selectors & Font Size */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">
                  {language === 'ar' ? 'خيارات عرض النص' : 'Display Format'}
                </span>
                <div className="flex flex-wrap bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <button
                    onClick={() => setTextFormat('arabic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${textFormat === 'arabic'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    {language === 'ar' ? 'العربية فقط' : 'Arabic Only'}
                  </button>
                  <button
                    onClick={() => setTextFormat('translation')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${textFormat === 'translation'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    {language === 'ar' ? 'مع الترجمة' : 'With Translation'}
                  </button>
                  <button
                    onClick={() => setTextFormat('transliteration')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${textFormat === 'transliteration'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    {language === 'ar' ? 'مع النطق' : 'Transliteration'}
                  </button>
                  <button
                    onClick={() => setTextFormat('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${textFormat === 'all'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    {language === 'ar' ? 'عرض الكل' : 'Show All'}
                  </button>
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">
                  {language === 'ar' ? 'حجم الخط' : 'Font Size'}
                </span>
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${fontSize === 'normal'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    title={language === 'ar' ? 'حجم عادي' : 'Normal Size'}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2.5 py-1.5 rounded-lg text-sm font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${fontSize === 'large'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    title={language === 'ar' ? 'حجم كبير' : 'Large Size'}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2.5 py-1.5 rounded-lg text-base font-bold transition-all select-none cursor-pointer focus:outline-none
                      ${fontSize === 'xlarge'
                        ? 'bg-primary-800 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    title={language === 'ar' ? 'حجم كبير جداً' : 'Extra Large'}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* Local Search Input inside the Text Tab */}
            <div className="space-y-1.5 md:w-80">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block">
                {language === 'ar' ? 'البحث عن كلمة أو بيت' : 'Search Verses'}
              </span>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث في الأبيات والترجمات...' : 'Search verses & translation...'}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 shadow-3xs outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Nooniyah Al-Qahtani Chapters Selector */}
          {selectedPoemId === 'nooniyah' && (
            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-950/20 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 text-[11px] font-bold uppercase tracking-wider">
                    <BookOpen size={12} />
                    <span>{language === 'ar' ? 'أقسام نونية القحطاني' : 'Nooniyah Al-Qahtani Chapters'}</span>
                  </span>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 font-serif leading-tight">
                    {language === 'ar' ? 'فهرس الأبواب للانتقال الفوري وتجنب التمرير' : 'Logical Chapters Index (Instant Jump)'}
                  </h3>
                </div>
                {nooniyahChapterFilter !== 'all' && (
                  <button
                    onClick={() => setNooniyahChapterFilter('all')}
                    className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-3xs hover:bg-slate-50 transition-colors shrink-0"
                  >
                    <span>{language === 'ar' ? 'عرض كافة أبيات القصيدة (٦٩٠ بيت)' : 'Show Full Poem (690 Verses)'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {/* Complete Poem selection card */}
                <button
                  onClick={() => setNooniyahChapterFilter('all')}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 group
                    ${nooniyahChapterFilter === 'all'
                      ? 'bg-primary-800 border-primary-800 text-white shadow-md scale-[1.01]'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold font-mono uppercase tracking-wider
                      ${nooniyahChapterFilter === 'all' ? 'bg-primary-950 text-secondary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                    >
                      {language === 'ar' ? 'شامل' : 'All'}
                    </span>
                    <BookOpen size={16} className={nooniyahChapterFilter === 'all' ? 'text-primary-300' : 'text-slate-400 group-hover:scale-110 transition-transform'} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight line-clamp-1 mb-1 font-serif">
                      {language === 'ar' ? 'كامل المنظومة المباركة' : 'The Complete Poem'}
                    </h4>
                    <span className="text-[10px] font-bold font-mono opacity-60">
                      {language === 'ar' ? 'الأبيات ١ - ٦٩٠' : 'Verses 1 - 690'}
                    </span>
                  </div>
                </button>

                {/* Chapter selection cards */}
                {nooniyahVideoParts.map(part => {
                  const isActive = nooniyahChapterFilter === part.part;
                  return (
                    <button
                      key={part.part}
                      onClick={() => {
                        setNooniyahChapterFilter(part.part);
                        // Scroll down to the verses container smoothly
                        const el = document.getElementById('poetry-verses-header');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 group
                        ${isActive
                          ? 'bg-primary-800 border-primary-800 text-white shadow-md scale-[1.01]'
                          : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold font-mono uppercase tracking-wider
                          ${isActive ? 'bg-primary-950 text-secondary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                        >
                          {language === 'ar' ? `الباب ${part.part}` : `Chapter ${part.part}`}
                        </span>
                        <ChevronRight size={14} className={`transition-transform duration-300 ${isActive ? 'text-primary-300 translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight line-clamp-2 mb-1">
                          {getChapterShortTitle(part, language)}
                        </h4>
                        <span className="text-[10px] font-bold font-mono opacity-60">
                          {language === 'ar' ? `الأبيات ${part.startVerse} - ${part.endVerse}` : part.verseRange}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Chapter Details Drawer banner */}
              {nooniyahChapterFilter !== 'all' && (
                <div className="mt-2 bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs animate-fade-in grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-7 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {language === 'ar' ? 'موضوع الباب الحالي وملخصه' : 'Active Chapter Theme'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {getLocalized(nooniyahVideoParts[nooniyahChapterFilter - 1].description)}
                    </p>
                  </div>
                  <div className="md:col-span-5 bg-emerald-500/5 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-500/10 space-y-2.5">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      <span>{language === 'ar' ? 'محاور هذا الفصل الرئيسية' : 'Core Key Highlights'}</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {nooniyahVideoParts[nooniyahChapterFilter - 1].highlights[language === 'ar' ? 'ar' : 'en'].map((hl, i) => (
                        <li key={i} className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-medium flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fajr & Sahar Secrets 14-Chapter Interactive Timeline Index */}
          {selectedPoemId === 'fajr-secrets' && (
            <div className="space-y-4 bg-gradient-to-br from-slate-50 via-primary-50/20 to-amber-50/20 dark:from-slate-950/40 dark:via-primary-950/20 dark:to-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-3xs animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
                      <Sun size={12} />
                      <span>{language === 'ar' ? '١٤ فصلاً زمنياً متكاملاً' : '14 Documentary Chapters & Timestamps'}</span>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('video');
                        window.dispatchEvent(new Event('pause-recitation'));
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      <Film size={12} />
                      <span>{language === 'ar' ? 'مشاهدة الوثائقي المرئي' : 'Watch Documentary Video'}</span>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100 font-serif leading-tight pt-1">
                    {language === 'ar' ? 'فهرس فصول أسرار صلاة الفجر ووقت السحر (انقر للتصفية أو التشغيل)' : 'Interactive Chapter Timeline: The Secret Time of Fajr Salah'}
                  </h3>
                </div>
                {activeFajrChapter !== 'all' && (
                  <button
                    onClick={() => setActiveFajrChapter('all')}
                    className="text-xs font-bold text-primary-700 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-3xs hover:bg-slate-50 transition-colors shrink-0"
                  >
                    <span>{language === 'ar' ? 'عرض جميع الفصول (١٤ فصلاً)' : 'Show All 14 Chapters'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {fajrSecretsChapters.map(chap => {
                  const isActive = activeFajrChapter === chap.chapter;
                  return (
                    <div
                      key={chap.chapter}
                      onClick={() => {
                        setActiveFajrChapter(isActive ? 'all' : chap.chapter);
                        setHighlightedVerse(chap.chapter);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2.5 cursor-pointer group
                        ${isActive
                          ? 'bg-primary-800 border-primary-800 text-white shadow-md scale-[1.01]'
                          : 'bg-white dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-850 hover:border-primary-400 dark:hover:border-primary-700 text-slate-800 dark:text-slate-200'}`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono uppercase tracking-wider
                          ${isActive ? 'bg-primary-950 text-secondary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                          {language === 'ar' ? `الفصل ${chap.chapter}` : `Ch ${chap.chapter}`} • {chap.timestamp}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFajrStartTime(chap.startTimeSeconds);
                            setFajrAutoplay(1);
                            setFajrSecretsViewMode('stream');
                            setActiveTab('video');
                            window.dispatchEvent(new Event('pause-recitation'));
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer
                            ${isActive
                              ? 'bg-secondary-400 text-primary-950 hover:bg-secondary-300'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-100'}`}
                          title={language === 'ar' ? 'تشغيل هذا الفصل في الفيديو' : 'Play this chapter in Video'}
                        >
                          <Play size={9} className="fill-current" />
                          <span>{language === 'ar' ? 'فيديو' : 'Watch'}</span>
                        </button>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-snug line-clamp-2">
                          {getLocalized(chap.title)}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verses List */}
          <div className="space-y-6" id="poetry-verses-header">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-200">
                {language === 'ar' ? 'أبيات القصيدة المباركة' : 'Verses of the Blessed Poem'}
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                {filteredVerses.length} {language === 'ar' ? 'أبيات معروضة' : 'Verses Listed'}
              </span>
            </div>

            {filteredVerses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800 rounded-3xl space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500 font-bold">
                  {language === 'ar' ? 'لا توجد أبيات تطابق بحثك' : 'No verses match your search query.'}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-primary-700 hover:underline cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="space-y-5" id="poetry-verses-grid">
                {filteredVerses.map(verse => {
                  const isCurrentHighlight = highlightedVerse === verse.number;
                  const isVerseSpeaking = isSpeaking && highlightedVerse === verse.number;
                  return (
                    <div
                      key={verse.number}
                      id={`verse-${verse.number}`}
                      onClick={() => setHighlightedVerse(isCurrentHighlight ? null : verse.number)}
                      className={`p-6 rounded-2xl border transition-all text-left cursor-pointer relative overflow-hidden group
                        ${isCurrentHighlight 
                          ? 'bg-primary-500/5 dark:bg-primary-950/20 border-primary-500/40 shadow-xs' 
                          : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:border-slate-300'}`}
                    >
                      {/* Top left action bar with play and copy buttons */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs font-bold border border-slate-200/50 dark:border-slate-700/50 group-hover:bg-primary-50 dark:group-hover:bg-primary-950 group-hover:text-primary-700 transition-colors">
                          {verse.number}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid triggering card selection
                            if (isVerseSpeaking) {
                              stopTts();
                            } else {
                              window.dispatchEvent(new Event('pause-recitation'));
                              setHighlightedVerse(verse.number);
                              speakTts(verse.arabic, 'ar');
                            }
                          }}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-3xs hover:scale-105 active:scale-95 flex items-center justify-center
                            ${isVerseSpeaking
                              ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                              : 'bg-slate-100 hover:bg-primary-800 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-700 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-700/40'}`}
                          title={language === 'ar' ? 'استمع إلى هذا البيت' : 'Listen to this verse'}
                        >
                          {isVerseSpeaking ? (
                            <Pause size={12} className="fill-current" />
                          ) : (
                            <Volume2 size={12} />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const fullVerseText = `${verse.arabic}\n\n[${getLocalized(currentPoem.title)} - ${language === 'ar' ? 'البيت' : 'Verse'} ${verse.number}]\n${verse.transliteration ? `\n${verse.transliteration}\n` : ''}\n${getLocalized(verse.translation)}`;
                            navigator.clipboard.writeText(fullVerseText);
                            setCopiedVerseNumber(verse.number);
                            setTimeout(() => setCopiedVerseNumber(null), 2000);
                          }}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-3xs hover:scale-105 active:scale-95 flex items-center justify-center
                            ${copiedVerseNumber === verse.number
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-700/40'}`}
                          title={language === 'ar' ? 'نسخ هذا البيت مع الترجمة' : 'Copy verse with translation'}
                        >
                          {copiedVerseNumber === verse.number ? (
                            <Check size={12} className="text-white" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>

                      <div className="space-y-4 pt-1">
                        {/* Arabic Verse Statement with proper line & hemistich formatting */}
                        <div className="text-right pl-28 pr-2 space-y-2" dir="rtl">
                          {verse.arabic.split('\n').map((line, lineIdx) => {
                            const trimmedLine = line.trim();
                            if (!trimmedLine) return null;
                            const hasSeparator = trimmedLine.includes('...') || trimmedLine.includes('…');
                            
                            const fontSizeClass = 
                              fontSize === 'large' 
                                ? 'text-2xl sm:text-3xl leading-[2.4]' 
                                : fontSize === 'xlarge' 
                                  ? 'text-3xl sm:text-4xl leading-[2.6]' 
                                  : 'text-xl sm:text-2xl leading-loose';

                            if (hasSeparator) {
                              const parts = trimmedLine.split(/\s*(?:\.{3}|…)\s*/);
                              const shatr1 = parts[0]?.trim() || '';
                              const shatr2 = parts[1]?.trim() || '';

                              return (
                                <div 
                                  key={lineIdx}
                                  className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-4 py-1.5 border-b border-slate-100/70 dark:border-slate-800/40 last:border-b-0"
                                >
                                  <span className={`text-right font-arabic font-medium text-slate-900 dark:text-slate-100 flex-1 tracking-wide ${fontSizeClass}`}>
                                    {shatr1}
                                  </span>
                                  {shatr2 && (
                                    <>
                                      <span className="hidden md:inline-flex items-center justify-center text-primary-500/80 dark:text-primary-400/80 px-2 select-none shrink-0 font-serif text-xs opacity-75">
                                        ۞
                                      </span>
                                      <span className={`text-right md:text-left font-arabic font-medium text-slate-900 dark:text-slate-100 flex-1 tracking-wide ${fontSizeClass}`}>
                                        {shatr2}
                                      </span>
                                    </>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <div key={lineIdx} className="py-1.5 border-b border-slate-100/70 dark:border-slate-800/40 last:border-b-0">
                                <p className={`font-arabic font-medium text-slate-900 dark:text-slate-100 tracking-wide ${fontSizeClass}`}>
                                  {trimmedLine}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Formatting dependent card layouts */}
                        {textFormat !== 'arabic' && (
                          <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800/80 w-full" />
                            <div className={`grid gap-4 text-xs sm:text-sm pl-4 sm:pl-12 
                              ${textFormat === 'all' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
                            >
                              {/* Phonetic Transliteration */}
                              {(textFormat === 'transliteration' || textFormat === 'all') && (
                                <div className="space-y-1.5 bg-slate-50/60 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-left">
                                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400 block">
                                    {language === 'ar' ? 'الكتابة الصوتية بالإنجليزية' : 'Phonetic Guide'}
                                  </span>
                                  <p className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed whitespace-pre-line font-mono text-xs sm:text-sm">
                                    {verse.transliteration}
                                  </p>
                                </div>
                              )}

                              {/* Translation Card */}
                              {(textFormat === 'translation' || textFormat === 'all') && (
                                <div className="space-y-1.5 bg-primary-500/5 dark:bg-primary-950/15 p-4 rounded-2xl border border-primary-500/10 dark:border-primary-900/20 text-left">
                                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-primary-600 dark:text-primary-400 block">
                                    {language === 'ar' ? 'الترجمة والمعنى' : 'Translation'}
                                  </span>
                                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                                    {getLocalized(verse.translation)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Audio Tab */}
      {activeTab === 'audio' && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Detailed Info Card */}
          <div className="bg-white dark:bg-slate-900/45 rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg border border-primary-200/30">
                  {getLocalized(currentPoem.author)}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {language === 'ar' ? `المنشد: ${getLocalized(currentPoem.reciter)}` : `Reciter: ${getLocalized(currentPoem.reciter)}`}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-850 dark:text-slate-100">
                {getLocalized(currentPoem.title)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {getLocalized(currentPoem.description)}
              </p>
            </div>

            {/* Odes stats */}
            <div className="lg:col-span-4 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200/50 dark:border-slate-800 pb-2">
                <span>{language === 'ar' ? 'إجمالي الأبيات المختارة' : 'Selected Key Verses'}</span>
                <span className="text-primary-700 font-mono text-sm">{currentPoem.verses.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200/50 dark:border-slate-800 pb-2">
                <span>{language === 'ar' ? 'الترجمة المتوفرة' : 'Translation Mode'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">English & Multi</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{language === 'ar' ? 'صيغة الملف الصوتي' : 'Audio Quality'}</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">128kbps Stream</span>
              </div>
            </div>
          </div>

          {/* Embedded High-Fidelity Audio Player */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
            {/* Decorative ambient background wave */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 to-indigo-950/50 pointer-events-none" />

            {/* Audio Mode/Source Selector Row */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60 shadow-inner">
                <button
                  onClick={() => {
                    setAudioMode('online');
                    stopTts();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                    ${audioMode === 'online'
                      ? 'bg-primary-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {language === 'ar' ? 'تلاوة صوتية متصلة' : 'Online Recitation'}
                </button>
                <button
                  onClick={() => {
                    setAudioMode('tts');
                    if (audioRef.current) {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all select-none cursor-pointer focus:outline-none
                    ${audioMode === 'tts'
                      ? 'bg-primary-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {language === 'ar' ? 'نظام القراءة الذكي' : 'AI Voice Synthesis (TTS)'}
                </button>
              </div>
              {audioMode === 'tts' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                  ✨ {language === 'ar' ? 'نظام النطق الذكي نشط' : 'Smart Reading Active'}
                </span>
              )}
            </div>

            {/* Network Failover Notice Card */}
            {hasAudioError && audioMode === 'online' && (
              <div className="relative z-10 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Info size={14} />
                    {language === 'ar' ? 'عذراً، تعذر الاتصال بالخادم الصوتي' : 'Audio Stream Unreachable'}
                  </p>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {language === 'ar'
                      ? 'بسبب الضغط العالي على خوادم الأرشيف، تعذر تشغيل الصوت الأصلي. يرجى تفعيل نظام النطق الذكي بالذكاء الاصطناعي للاستماع للأبيات بوضوح.'
                      : 'Due to temporary archive.org server limits, this recitation stream cannot be loaded. You can switch to our smart AI Voice Synthesis for offline-friendly reading.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAudioMode('tts');
                    setHasAudioError(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer select-none whitespace-nowrap self-stretch sm:self-auto text-center"
                >
                  {language === 'ar' ? 'تشغيل نظام النطق الذكي' : 'Switch to AI Synthesis'}
                </button>
              </div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
              {/* Audio Details info */}
              <div className="flex items-center gap-3.5 self-start md:self-center">
                <div className={`p-3 rounded-2xl bg-primary-800 text-secondary-400 ${isPlaying ? 'animate-pulse' : ''}`}>
                  <Book size={20} className="fill-current" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-secondary-400">
                    {isPlaying ? (audioMode === 'tts' ? 'Reading Aloud' : 'Now Streaming') : 'Ready to Recite'}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-[250px] sm:max-w-[320px]">
                    {getLocalized(currentPoem.title)}
                  </h4>
                </div>
              </div>

              {/* Player controls */}
              <div className="flex items-center gap-3.5">
                {/* Speed slider (Only for online stream) */}
                {audioMode === 'online' && (
                  <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50 text-slate-300">
                    <Sliders size={12} className="text-primary-400" />
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="bg-transparent text-[10px] font-bold border-none outline-none focus:ring-0 cursor-pointer text-white"
                      title="Speed Control"
                    >
                      <option value="0.5" className="bg-slate-900">0.50x</option>
                      <option value="0.75" className="bg-slate-900">0.75x</option>
                      <option value="1.0" className="bg-slate-900">1.00x</option>
                      <option value="1.25" className="bg-slate-900">1.25x</option>
                      <option value="1.5" className="bg-slate-900">1.50x</option>
                    </select>
                  </div>
                )}

                {/* Stop/Restart button */}
                <button
                  onClick={() => {
                    if (audioMode === 'tts') {
                      stopTts();
                      setHighlightedVerse(1);
                      setIsPlaying(false);
                    } else if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      setCurrentTime(0);
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 hover:text-white transition-colors cursor-pointer select-none"
                  title={audioMode === 'tts' ? "Reset Reader" : "Restart Audio"}
                >
                  <RotateCcw size={15} />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="p-3.5 rounded-full bg-secondary-400 hover:bg-secondary-500 text-primary-950 font-bold hover:scale-105 active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer select-none"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Timeline progress slider vs Verse list counter */}
            {audioMode === 'online' ? (
              <div className="relative z-10 flex flex-col gap-1 w-full pt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary-400 focus:outline-none"
                  title="Timeline Slider"
                />
              </div>
            ) : (
              <div className="relative z-10 flex flex-col gap-1.5 w-full pt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>
                    {language === 'ar'
                      ? `البيت ${highlightedVerse || 1} من أصل ${currentPoem.verses.length}`
                      : `Verse ${highlightedVerse || 1} of ${currentPoem.verses.length}`}
                  </span>
                  <span>
                    {isTtsLoading
                      ? (language === 'ar' ? 'جاري تهيئة الصوت...' : 'Loading voice...')
                      : isPlaying
                        ? (language === 'ar' ? 'جاري تلاوة البيت...' : 'Reciting verse...')
                        : (language === 'ar' ? 'انقر على أي بيت أدناه لتشغيله منفصلاً' : 'Click any verse card below to play individually')}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-secondary-400 transition-all duration-300"
                    style={{ width: `${((highlightedVerse || 1) / currentPoem.verses.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Volume section (Only for online stream) */}
            {audioMode === 'online' && (
              <div className="relative z-10 flex items-center gap-3 w-full border-t border-slate-800/60 pt-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1 max-w-[150px] bg-slate-800 rounded-lg appearance-none cursor-pointer accent-secondary-400 focus:outline-none"
                  title="Volume Slider"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            )}
          </div>

          {/* Nooniyah Al-Qahtani Audio Chapters Selector */}
          {selectedPoemId === 'nooniyah' && (
            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 text-[10px] font-extrabold uppercase tracking-wider">
                    <Volume2 size={11} />
                    <span>{language === 'ar' ? 'فهرس أبواب الصوتيات' : 'Audio Chapters Index'}</span>
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-serif">
                    {language === 'ar' ? 'اختر الباب للانتقال الفوري وتصفية الأبيات' : 'Select a logical chapter for instant jump'}
                  </h4>
                </div>
                {nooniyahAudioChapterFilter !== 'all' && (
                  <button
                    onClick={() => {
                      setNooniyahAudioChapterFilter('all');
                      setHighlightedVerse(1);
                    }}
                    className="text-[11px] font-bold text-primary-700 dark:text-primary-400 hover:underline cursor-pointer flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg shadow-3xs"
                  >
                    <span>{language === 'ar' ? 'عرض كافة الأبيات (٦٩٠ بيت)' : 'Show Full Poem (690 Verses)'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {/* Complete Poem selection card */}
                <button
                  onClick={() => {
                    setNooniyahAudioChapterFilter('all');
                    setHighlightedVerse(1);
                    if (audioMode === 'online' && audioRef.current) {
                      handleSeek(0);
                    }
                  }}
                  className={`px-3 py-2.5 rounded-xl border transition-all text-left flex flex-col justify-between h-16 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 group
                    ${nooniyahAudioChapterFilter === 'all'
                      ? 'bg-primary-800 border-primary-800 text-white shadow-xs scale-[1.01]'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'}`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold font-mono uppercase tracking-wider self-start
                    ${nooniyahAudioChapterFilter === 'all' ? 'bg-primary-950 text-secondary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                  >
                    {language === 'ar' ? 'الكل' : 'ALL'}
                  </span>
                  <span className="text-xs font-bold leading-tight truncate w-full font-serif mt-1">
                    {language === 'ar' ? 'كامل المنظومة المباركة' : 'The Full Poem'}
                  </span>
                </button>

                {/* Chapter selection cards */}
                {nooniyahVideoParts.map(part => {
                  const isActive = nooniyahAudioChapterFilter === part.part;
                  return (
                    <button
                      key={part.part}
                      onClick={() => {
                        setNooniyahAudioChapterFilter(part.part);
                        setHighlightedVerse(part.startVerse);
                        if (audioMode === 'online' && audioRef.current) {
                          const targetTime = getVerseTime(part.startVerse, duration || 2540);
                          handleSeek(targetTime);
                          if (!isPlaying) {
                            audioRef.current.play()
                              .then(() => {
                                setIsPlaying(true);
                                setHasAudioError(false);
                              })
                              .catch(err => {
                                console.warn("Playback failed:", err);
                              });
                          }
                        }
                      }}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-left flex flex-col justify-between h-16 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 group
                        ${isActive
                          ? 'bg-primary-800 border-primary-800 text-white shadow-xs scale-[1.01]'
                          : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'}`}
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold font-mono uppercase tracking-wider self-start
                        ${isActive ? 'bg-primary-950 text-secondary-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {language === 'ar' ? `الباب ${part.part}` : `Part ${part.part}`}
                      </span>
                      <span className="text-xs font-bold leading-tight truncate w-full mt-1">
                        {getChapterShortTitle(part, language)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Index of Poem's Verses */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'فهرس الأبيات للتشغيل الفوري والتحكم' : 'Interactive Verse Playback Index'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="rtl">
              {currentPoem.verses
                .filter(verse => {
                  if (selectedPoemId === 'nooniyah' && nooniyahAudioChapterFilter !== 'all') {
                    const partObj = nooniyahVideoParts[nooniyahAudioChapterFilter - 1];
                    if (partObj) {
                      if (verse.number < partObj.startVerse || verse.number > partObj.endVerse) {
                        return false;
                      }
                    }
                  }
                  return true;
                })
                .map(verse => {
                const isActive = highlightedVerse === verse.number;
                const isVerseSpeaking = isSpeaking && highlightedVerse === verse.number;
                return (
                  <button
                    key={verse.number}
                    onClick={() => {
                      if (audioMode === 'tts') {
                        if (isVerseSpeaking) {
                          stopTts();
                        } else {
                          window.dispatchEvent(new Event('pause-recitation'));
                          setHighlightedVerse(verse.number);
                          speakTts(verse.arabic, 'ar');
                        }
                      } else {
                        setHighlightedVerse(verse.number);
                        if (audioRef.current) {
                          const targetTime = getVerseTime(verse.number, duration || 2540);
                          handleSeek(targetTime);
                          if (!isPlaying) {
                            audioRef.current.play()
                              .then(() => {
                                setIsPlaying(true);
                                setHasAudioError(false);
                              })
                              .catch(err => {
                                console.warn("Playback failed:", err);
                              });
                          }
                        }
                      }
                    }}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                      ${isActive
                        ? 'bg-primary-800 border-primary-800 text-white'
                        : 'bg-white dark:bg-slate-900/40 border-slate-250/50 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                    dir="rtl"
                  >
                    <span className="font-arabic text-sm font-medium leading-relaxed text-right flex-1 select-all">
                      {verse.arabic}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-mono
                        ${isActive ? 'bg-primary-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {verse.number}
                      </span>
                      {audioMode === 'tts' && (
                        <div className={isActive ? 'text-white' : 'text-slate-400'}>
                          {isVerseSpeaking ? <Pause size={10} className="fill-current animate-pulse" /> : <Play size={10} />}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Render Video Tab */}
      {activeTab === 'video' && (
        <div className="space-y-8 animate-fade-in text-left">
          {selectedPoemId === 'burda' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Video Player (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-slate-950 rounded-3xl border border-slate-850 overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${burdaVideoPart.youtubeId}?rel=0&autoplay=0&modestbranding=1`}
                    title="Qasida Al-Burda Chanting"
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="bg-white dark:bg-slate-900/45 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Film size={12} />
                      <span>{burdaVideoPart.verseRange}</span>
                    </span>
                    <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                      {getLocalized(burdaVideoPart.title)}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {getLocalized(burdaVideoPart.description)}
                  </p>
                </div>
              </div>

              {/* Right Side: Highlights (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-emerald-500/5 dark:bg-emerald-950/10 p-5 rounded-3xl border border-emerald-500/10 space-y-3.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{language === 'ar' ? 'موضوعات وأهداف هذا الجزء' : 'Key Highlights'}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {burdaVideoPart.highlights[language === 'ar' ? 'ar' : 'en'].map((hl, index) => (
                      <li key={index} className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : selectedPoemId === 'ya-rahilina' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Video Player (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Source Selection & Drive Link Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setYaRahilinaViewMode('stream')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        yaRahilinaViewMode === 'stream'
                          ? 'bg-primary-800 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Film size={14} />
                      <span>{language === 'ar' ? 'مشغل الفيديو' : 'Video Player'}</span>
                    </button>
                    <button
                      onClick={() => setYaRahilinaViewMode('drive')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        yaRahilinaViewMode === 'drive'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Folder size={14} />
                      <span>{language === 'ar' ? 'مجلد Google Drive' : 'Google Drive Folder'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={yaRahilinaVideoPart.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Film size={13} />
                      <span>YouTube</span>
                      <ExternalLink size={12} className="text-red-200" />
                    </a>
                    <a
                      href={yaRahilinaVideoPart.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Cloud size={13} className="text-blue-500" />
                      <span>{language === 'ar' ? 'Google Drive' : 'Google Drive'}</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Player Viewport */}
                <div className="bg-slate-950 rounded-3xl border border-slate-850 overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                  {yaRahilinaViewMode === 'stream' ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${yaRahilinaVideoPart.youtubeId}?rel=0&autoplay=0&modestbranding=1`}
                      title="Ya Rahilina Ila Mina - Hamza Khalid Al-Humaidi"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col">
                      <iframe
                        src={yaRahilinaVideoPart.driveEmbedUrl}
                        title="Google Drive Folder - Ya Rahilina Ila Mina"
                        className="w-full h-full border-none"
                        allow="autoplay; fullscreen"
                      />
                    </div>
                  )}
                </div>

                {/* Google Drive Connection Pill Banner */}
                <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent p-4 rounded-2xl border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <HardDrive size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'رابط ملفات جوجل درايف المرفقة' : 'Linked Google Drive Cloud Folder'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">1yBYV_N_...</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-md">
                        {yaRahilinaVideoPart.driveFolderUrl}
                      </p>
                    </div>
                  </div>
                  <a
                    href={yaRahilinaVideoPart.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'عرض المجلد السحابي' : 'View Drive Folder'}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                <div className="bg-white dark:bg-slate-900/45 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <Film size={12} />
                          <span>{yaRahilinaVideoPart.verseRange}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 text-xs font-bold">
                          <Sparkles size={12} />
                          <span>{language === 'ar' ? 'حمزة خالد الحميدي' : 'Hamza Khalid Al-Humaidi'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-xs font-bold">
                          <Cloud size={12} />
                          <span>Google Drive</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                        {getLocalized(yaRahilinaVideoPart.title)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {getLocalized(yaRahilinaVideoPart.description)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'كلمات القصيدة' : 'Poem Lyrics'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'الإمام عبد الرحيم البرعي اليماني' : 'Imam Abdul Rahim Al-Bura\'i (d. 803 AH)'}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'الألحان والأداء' : 'Melody & Performance'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'المنشد حمزة خالد الحميدي' : 'Hamza Khalid Al-Humaidi'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Highlights & Verses Jump (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-emerald-500/5 dark:bg-emerald-950/10 p-5 rounded-3xl border border-emerald-500/10 space-y-3.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{language === 'ar' ? 'الموضوعات والوقفات الإيمانية' : 'Spiritual Themes & Highlights'}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {yaRahilinaVideoPart.highlights[language === 'ar' ? 'ar' : 'en'].map((hl, index) => (
                      <li key={index} className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900/45 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {language === 'ar' ? 'أبيات القصيدة (١٩)' : 'Verses of the Ode (19)'}
                    </h4>
                    <button
                      onClick={() => setActiveTab('text')}
                      className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'عرض النص كاملاً' : 'View Full Text'}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentPoem.verses.map((v) => (
                      <button
                        key={v.number}
                        onClick={() => {
                          setHighlightedVerse(v.number);
                          setActiveTab('text');
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-right transition-all flex items-center justify-between gap-3 text-xs group cursor-pointer"
                        dir="rtl"
                      >
                        <span className="font-arabic truncate text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                          {v.arabic}
                        </span>
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500 shrink-0" dir="ltr">
                          {v.number}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedPoemId === 'ibtihal-layl' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Video Player (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Source Selection & Drive Link Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIbtihalLaylViewMode('stream')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        ibtihalLaylViewMode === 'stream'
                          ? 'bg-primary-800 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Film size={14} />
                      <span>{language === 'ar' ? 'مشغل الفيديو' : 'Video Player'}</span>
                    </button>
                    <button
                      onClick={() => setIbtihalLaylViewMode('drive')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        ibtihalLaylViewMode === 'drive'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Folder size={14} />
                      <span>{language === 'ar' ? 'مجلد Google Drive' : 'Google Drive Folder'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={ibtihalLaylVideoPart.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Film size={13} />
                      <span>YouTube</span>
                      <ExternalLink size={12} className="text-red-200" />
                    </a>
                    <a
                      href={ibtihalLaylVideoPart.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Cloud size={13} className="text-blue-500" />
                      <span>Google Drive</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Player Viewport */}
                <div className="bg-slate-950 rounded-3xl border border-slate-850 overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                  {ibtihalLaylViewMode === 'stream' ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ibtihalLaylVideoPart.youtubeId}?rel=0&autoplay=0&modestbranding=1`}
                      title="ابتهالٌ في جوف الليل - 40 دقيقة تُسكِّن القلب - شجن"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col">
                      <iframe
                        src={ibtihalLaylVideoPart.driveEmbedUrl}
                        title="Google Drive Folder - ابتهالٌ في جوف الليل"
                        className="w-full h-full border-none"
                        allow="autoplay; fullscreen"
                      />
                    </div>
                  )}
                </div>

                {/* Google Drive Connection Pill Banner */}
                <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent p-4 rounded-2xl border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <HardDrive size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'رابط مجلد جوجل درايف السحابي' : 'Linked Google Drive Cloud Folder'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">1yBYV_N_...</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-md">
                        {ibtihalLaylVideoPart.driveFolderUrl}
                      </p>
                    </div>
                  </div>
                  <a
                    href={ibtihalLaylVideoPart.driveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>{language === 'ar' ? 'عرض المجلد السحابي' : 'View Drive Folder'}</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                <div className="bg-white dark:bg-slate-900/45 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <Film size={12} />
                          <span>{ibtihalLaylVideoPart.verseRange}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                          <Sparkles size={12} />
                          <span>{language === 'ar' ? '٤٠ دقيقة تُسكِّن القلب' : '40 Minutes Solace'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-xs font-bold">
                          <Cloud size={12} />
                          <span>Google Drive</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                        {getLocalized(ibtihalLaylVideoPart.title)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {getLocalized(ibtihalLaylVideoPart.description)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'نوع العمل' : 'Category & Spirit'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'ابتهالات ودعوات خاشعة في جوف الليل' : 'Nocturnal Munajat & Heart Supplications'}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'المدة والأجواء' : 'Duration & Atmosphere'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? '٤٠ دقيقة متواصلة من الطمأنينة والشجن' : '40 Continuous Minutes of Spiritual Solace'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Highlights & Verses Jump (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-indigo-500/5 dark:bg-indigo-950/10 p-5 rounded-3xl border border-indigo-500/10 space-y-3.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 dark:text-indigo-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{language === 'ar' ? 'الموضوعات والوقفات الإيمانية' : 'Spiritual Themes & Highlights'}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {ibtihalLaylVideoPart.highlights[language === 'ar' ? 'ar' : 'en'].map((hl, index) => (
                      <li key={index} className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900/45 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      {language === 'ar' ? `أبيات ومناجاة العمل (${currentPoem.verses.length})` : `Supplication Verses (${currentPoem.verses.length})`}
                    </h4>
                    <button
                      onClick={() => setActiveTab('text')}
                      className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'عرض النص كاملاً' : 'View Full Text'}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentPoem.verses.map((v) => (
                      <button
                        key={v.number}
                        onClick={() => {
                          setHighlightedVerse(v.number);
                          setActiveTab('text');
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-right transition-all flex items-center justify-between gap-3 text-xs group cursor-pointer"
                        dir="rtl"
                      >
                        <span className="font-arabic truncate text-slate-800 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                          {v.arabic}
                        </span>
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500 shrink-0" dir="ltr">
                          {v.number}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedPoemId === 'fajr-secrets' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Video Player & Documentary Details (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Source Selection & External Link Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setFajrSecretsViewMode('stream')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        fajrSecretsViewMode === 'stream'
                          ? 'bg-primary-800 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Film size={14} />
                      <span>{language === 'ar' ? 'مشغل الوثائقي' : 'Documentary Player'}</span>
                    </button>
                    <button
                      onClick={() => setFajrSecretsViewMode('drive')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        fajrSecretsViewMode === 'drive'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Folder size={14} />
                      <span>{language === 'ar' ? 'مجلد Google Drive' : 'Google Drive Folder'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={fajrSecretsVideoPart.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Film size={13} />
                      <span>YouTube</span>
                      <ExternalLink size={12} className="text-red-200" />
                    </a>
                    <a
                      href={fajrSecretsVideoPart.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-3xs transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Cloud size={13} className="text-blue-500" />
                      <span>Google Drive</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Player Viewport */}
                <div className="bg-slate-950 rounded-3xl border border-slate-850 overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                  {fajrSecretsViewMode === 'stream' ? (
                    <iframe
                      key={`fajr-yt-${fajrStartTime}-${fajrAutoplay}`}
                      src={`https://www.youtube.com/embed/${fajrSecretsVideoPart.youtubeId}?start=${fajrStartTime}&autoplay=${fajrAutoplay}&rel=0&modestbranding=1`}
                      title="The Secret Time of Fajr Salah in Islam"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col">
                      <iframe
                        src={fajrSecretsVideoPart.driveEmbedUrl}
                        title="Google Drive Folder - Secrets of Fajr"
                        className="w-full h-full border-none"
                        allow="autoplay; fullscreen"
                      />
                    </div>
                  )}
                </div>

                {/* Active Chapter Timestamp Bar */}
                <div className="bg-gradient-to-r from-amber-500/10 via-primary-500/10 to-transparent p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'البث المباشر لفصول أسرار صلاة الفجر' : 'Interactive Timestamp Playback Active'}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold">
                          {fajrSecretsChapters.find(c => c.startTimeSeconds === fajrStartTime)?.timestamp || '00:00'}
                        </span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-md">
                        {getLocalized(fajrSecretsChapters.find(c => c.startTimeSeconds === fajrStartTime)?.title || fajrSecretsChapters[0].title)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('text')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-800 hover:bg-primary-700 text-white font-bold transition-all shrink-0 shadow-xs cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>{language === 'ar' ? 'قراءة النصوص والأدعية' : 'Read Texts & Duas'}</span>
                  </button>
                </div>

                {/* Documentary Info Card */}
                <div className="bg-white dark:bg-slate-900/45 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <Film size={12} />
                          <span>{fajrSecretsVideoPart.verseRange}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 text-xs font-bold">
                          <Sun size={12} />
                          <span>{language === 'ar' ? 'أسرار السحر والفجر' : 'Sahar & Fajr Secrets'}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                        {getLocalized(fajrSecretsVideoPart.title)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {getLocalized(fajrSecretsVideoPart.description)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'المصادر الشرعية والعلمية' : 'Primary Sources'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? 'القرآن الكريم، صحيح البخاري ومسلم، والطب البيولوجي' : 'Holy Quran, Sahih Bukhari & Muslim, Circadian Biology'}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {language === 'ar' ? 'الأقسام والفصول' : 'Chapters & Structure'}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'ar' ? '١٤ فصلاً متكاملاً مع الآيات والأذكار المأثورة' : '14 Timestamped Chapters with Duas & Verses'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: 14-Chapter Timestamp Jumper & Key Highlights (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900/45 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" />
                      <span>{language === 'ar' ? 'فصول الوثائقي (١٤ فصلاً)' : '14 Video Chapters (Click to Seek)'}</span>
                    </h4>
                  </div>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {fajrSecretsChapters.map((chap) => {
                      const isCurrentChap = fajrStartTime === chap.startTimeSeconds;
                      return (
                        <button
                          key={chap.chapter}
                          onClick={() => {
                            setFajrSecretsViewMode('stream');
                            setFajrStartTime(chap.startTimeSeconds);
                            setFajrAutoplay(1);
                            setHighlightedVerse(chap.chapter);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 text-xs group cursor-pointer ${
                            isCurrentChap
                              ? 'bg-primary-800 border-primary-700 text-white shadow-sm'
                              : 'border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shrink-0 ${
                              isCurrentChap
                                ? 'bg-secondary-400 text-primary-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-400'
                            }`}>
                              {chap.timestamp}
                            </span>
                            <span className="font-semibold truncate">
                              {getLocalized(chap.title)}
                            </span>
                          </div>
                          <Play size={11} className={`shrink-0 ${isCurrentChap ? 'text-secondary-300 fill-current' : 'text-slate-400 group-hover:text-primary-600'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-amber-500/5 dark:bg-amber-950/10 p-5 rounded-3xl border border-amber-500/15 space-y-3.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{language === 'ar' ? 'أبرز المحاور والأسرار' : 'Key Documentary Insights'}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {fajrSecretsVideoPart.highlights[language === 'ar' ? 'ar' : 'en'].map((hl, index) => (
                      <li key={index} className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Video Player Screen (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Premium Theater Box */}
                  <div className="bg-slate-950 rounded-3xl border border-slate-850 overflow-hidden shadow-2xl relative aspect-video flex flex-col items-center justify-center">
                    {(() => {
                      const currentPart = nooniyahVideoParts[activeVideoPart - 1];
                      const videoSource = currentPart.videoUrl 
                        ? getPlayableSource(currentPart.videoUrl)
                        : getPlayableSource(`https://www.youtube.com/watch?v=${currentPart.youtubeId}`);
                      
                      if (videoSource?.type === 'iframe') {
                        return (
                          <iframe
                            src={videoSource.src}
                            title={`Nooniyah Al-Qahtani Part ${activeVideoPart}`}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        );
                      } else if (videoSource?.type === 'video') {
                        return (
                          <video
                            src={videoSource.src}
                            controls
                            className="w-full h-full rounded-2xl"
                          />
                        );
                      } else {
                        return (
                          <iframe
                            src={`https://www.youtube.com/embed/${currentPart.youtubeId}?rel=0&autoplay=0&modestbranding=1`}
                            title={`Nooniyah Al-Qahtani Part ${activeVideoPart}`}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        );
                      }
                    })()}
                  </div>

                  {/* Video Title and Navigation Row */}
                  <div className="bg-white dark:bg-slate-900/45 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <Film size={12} />
                          <span>{nooniyahVideoParts[activeVideoPart - 1].verseRange}</span>
                        </span>
                        <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                          {getLocalized(nooniyahVideoParts[activeVideoPart - 1].title)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveVideoPart(prev => Math.max(1, prev - 1))}
                          disabled={activeVideoPart === 1}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                          title="Previous Part"
                        >
                          <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          {activeVideoPart} / 8
                        </span>
                        <button
                          onClick={() => setActiveVideoPart(prev => Math.min(8, prev + 1))}
                          disabled={activeVideoPart === 8}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                          title="Next Part"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Part Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {getLocalized(nooniyahVideoParts[activeVideoPart - 1].description)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Playlist Parts Sidebar (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white dark:bg-slate-900/45 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                      {language === 'ar' ? 'أجزاء السلسلة (٨)' : 'Poem Parts (8 Parts)'}
                    </h3>
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {nooniyahVideoParts.map(item => {
                        const isActive = activeVideoPart === item.part;
                        return (
                          <button
                            key={item.part}
                            onClick={() => {
                              setActiveVideoPart(item.part);
                              window.dispatchEvent(new Event('pause-recitation'));
                            }}
                            className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer outline-none focus:ring-2 focus:ring-primary-500/10
                              ${isActive
                                ? 'bg-primary-800 border-primary-800 text-white shadow-md'
                                : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold border shrink-0
                              ${isActive
                                ? 'bg-primary-900 border-primary-700 text-secondary-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                            >
                              {item.part}
                            </div>
                            <div className="space-y-1 min-w-0">
                              <h4 className="text-xs font-bold leading-snug truncate">
                                {getLocalized(item.title)}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
                                <span className={isActive ? 'text-primary-300' : 'text-slate-500'}>
                                  {item.verseRange}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Part Key Highlights & Objectives */}
                  <div className="bg-emerald-500/5 dark:bg-emerald-950/10 p-5 rounded-3xl border border-emerald-500/10 space-y-3.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{language === 'ar' ? 'موضوعات وأهداف هذا الجزء' : 'Key Highlights of this Part'}</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {nooniyahVideoParts[activeVideoPart - 1].highlights[language === 'ar' ? 'ar' : 'en'].map((hl, index) => (
                        <li key={index} className="text-xs text-slate-750 dark:text-slate-300 leading-relaxed font-semibold flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embedded hidden audio player to support muted attribute on initial render */}
      <audio
        ref={audioRef}
        src={currentPoem.audioUrl}
        muted={isMuted}
        preload="metadata"
        className="hidden"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      {/* Footnote advice and guidelines */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 text-left flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
          <Shield size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200">
            {language === 'ar' ? 'ملاحظة تعليمية وتأديبية' : 'Spiritual and Technical Footnote'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {language === 'ar'
              ? 'مجموعة أبيات هذه الأوراد والقصائد مصممة للتأمل البلاغي وحفظ عيون التراث الإسلامي الأصيل. يمكنك التحكم بسرعة القراءة والصوت بكل مرونة لتسهيل عملية المتابعة.'
              : 'These curated poetic selections represent peak achievements in classical Arabic metrics and Islamic theology. Use the playback speed sliders to comfortably match your learning and memorization pace.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PoetrySection;
