import React, { useState, useEffect, useRef } from 'react';
import { X, Sun, Moon, Book, Shield, Hash, List, Heart, Sparkles, Play, Pause, Volume2, VolumeX, RotateCcw, Loader2 } from 'lucide-react';

interface AzkarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TimeMode = 'morning' | 'evening';
export type Category = 'daily' | 'supplications' | 'wird' | 'istighfar' | 'hizb' | 'names';

export interface DhikrSection {
  id?: string;
  title?: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  count?: number | string;
  note?: string;
}

export interface DhikrItem {
  id: string;
  title: string;
  arabic: string;
  arabicEvening?: string; // For daily adhkar that change
  transliteration?: string;
  translation: string;
  translationEvening?: string; // For daily adhkar translations that change
  count?: number;
  reference?: string;
  note?: string;
  audio?: string; // URL for audio file
  sections?: DhikrSection[];
}

// --- DATA SOURCE ---

export const dailyAdhkar: DhikrItem[] = [
  {
    id: 'waking',
    title: 'Praise upon Waking / Evening',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    arabicEvening: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    translationEvening: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
    count: 1,
    reference: "Page 1"
  },
  {
    id: 'bika_state',
    title: 'Morning/Evening Invocation',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    arabicEvening: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
    translationEvening: "O Allah, by You we enter the evening and by You we enter the morning, by You we live, by You we die, and to You is the final return.",
    count: 1,
    reference: "Page 1"
  },
  {
    id: 'declaration',
    title: 'Affirming Faith',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْعَظَمَةُ وَالسُّلْطَانُ لِلَّهِ، وَالْعِزَّةُ وَالْقُدْرَةُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً',
    arabicEvening: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْعَظَمَةُ وَالسُّلْطَانُ لِلَّهِ، وَالْعِزَّةُ وَالْقُدْرَةُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَعَلَى كَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً',
    translation: "We have entered the morning and at this very time the whole kingdom belongs to Allah, and all greatness and authority belong to Allah, and all honor and power belong to Allah, Lord of the worlds. We have entered the morning upon the natural religion of Islam, the word of pure faith, the religion of our Prophet Muhammad (peace be upon him), and the faith of our father Ibrahim, who was a true believer and a Muslim, and was not of the polytheists.",
    translationEvening: "We have entered the evening and at this very time the whole kingdom belongs to Allah, and all greatness and authority belong to Allah, and all honor and power belong to Allah, Lord of the worlds. We have entered the evening upon the natural religion of Islam, the word of pure faith, the religion of our Prophet Muhammad (peace be upon him), and the faith of our father Ibrahim, who was a true believer and a Muslim, and was not of the polytheists.",
    count: 1,
    reference: "Page 1"
  },
  {
    id: 'witness',
    title: 'Calling Allah to Witness',
    arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، بِأَنَّكَ أَنْتَ اللهُ الَّذِي لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ',
    arabicEvening: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، بِأَنَّكَ أَنْتَ اللهُ الَّذِي لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ',
    translation: "O Allah, I have entered the morning calling You as a witness, and calling the bearers of Your Throne, Your angels, and all Your creation to witness, that You are Allah, there is no deity except You, alone, without any partner, and that Muhammad is Your servant and Your Messenger.",
    translationEvening: "O Allah, I have entered the evening calling You as a witness, and calling the bearers of Your Throne, Your angels, and all Your creation to witness, that You are Allah, there is no deity except You, alone, without any partner, and that Muhammad is Your servant and Your Messenger.",
    count: 4,
    reference: "Page 1"
  },
  {
    id: 'radaytu',
    title: 'Satisfaction with Allah',
    arabic: 'اللَّهُمَّ إِنِّي رَضِيتُ بِاللهِ تَعَالَى رَبّاً، وَبِالْإِسْلَامِ دِيناً، وَبِالْقُرْآنِ كِتَاباً، وَبِمُحَمَّدٍ ﷺ نَبِيّاً وَرَسُولاً',
    translation: "O Allah, I am pleased with Allah the Exalted as my Lord, with Islam as my religion, with the Quran as my book, and with Muhammad (peace be upon him) as my Prophet and Messenger.",
    count: 3,
    reference: "Page 1"
  },
  {
    id: 'fire_protection',
    title: 'Protection from Fire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    translation: "O Allah, protect me from the Fire.",
    count: 7,
    reference: "Page 1"
  },
  {
    id: 'ask_paradise',
    title: 'Asking for Paradise',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ رِضَاكَ وَالْجَنَّةَ',
    translation: "O Allah, we ask You for Your pleasure and Paradise.",
    count: 8,
    reference: "Page 1"
  },
  {
    id: 'hashr_end',
    title: 'End of Surah Al-Hashr (Verses 22-24)',
    arabic: 'أَعُوذُ بِاللهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ (3 مرات)\n\nهُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَنُ الرَّحِيمُ (22) هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ (23) هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ ۚ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ (24)',
    translation: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful. He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior. Exalted is Allah above whatever they associate with Him. He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names. Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.",
    count: 1,
    reference: "Page 1",
    audio: "https://server8.mp3quran.net/afs/059.mp3"
  },
  {
    id: 'sayyid',
    title: 'Sayyid al-Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translation: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave. I keep Your covenant and Your promise as best as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me, and I acknowledge my sin. So forgive me, for verily, none forgives sins except You.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'path_protection',
    title: 'Protection of the Path',
    arabic: 'بِسْمِ اللهِ طَرِيقِي، وَالرَّحْمَنُ رَفِيقِي، وَالرَّحِيمُ يَحْرُسُنِي مِنْ كُلِّ شَيْءٍ يَلْمِسُنِي، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    translation: "In the name of Allah is my path, the Most Merciful is my companion, and the Compassionate guards me from everything that touches me, and from the evil of the blowers in knots (witches), and from the evil of an envier when he envies.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'qul_ikhlas',
    title: 'Surah Al-Ikhlas (Sincerity)',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
    count: 3,
    reference: "Page 3",
    audio: "https://server8.mp3quran.net/afs/112.mp3"
  },
  {
    id: 'qul_falaq',
    title: 'Surah Al-Falaq (Daybreak)',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.'",
    count: 3,
    reference: "Page 3",
    audio: "https://server8.mp3quran.net/afs/113.mp3"
  },
  {
    id: 'qul_nas',
    title: 'Surah An-Nas (Mankind)',
    arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\nSay, 'I seek refuge in the Lord of mankind, The Sovereign of mankind. The God of mankind, From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind.'",
    count: 3,
    reference: "Page 3",
    audio: "https://server8.mp3quran.net/afs/114.mp3"
  },
  {
    id: 'subhan_allah_3x',
    title: 'Praise & Power (Subhan Allah)',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ',
    translation: "Glory be to Allah and His praise, Glory be to Allah the Magnificent, and there is no power nor strength except through Allah, the Most High, the Supreme.",
    count: 3,
    reference: "Page 3"
  }
];

export const generalSupplications: DhikrItem[] = [
  {
    id: 'ask_good_deeds',
    title: 'Asking for Good Deeds',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ، وَتَرْكَ الْمُنْكَرَاتِ، وَحُبَّ الْمَسَاكِينِ، وَإِذَا أَرَدْتَ بِعِبَادِكَ فِتْنَةً فَاقْبِضْنِي إِلَيْكَ غَيْرَ مَفْتُونٍ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ',
    translation: "O Allah, I ask You for the performance of good deeds, the abandonment of evil deeds, and love for the poor, and if You intend to test Your servants, then take me to You without being tested. By Your mercy, O Most Merciful of the merciful.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'best_character',
    title: 'Guidance to Best Character',
    arabic: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ فَإِنَّهُ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ، وَاصْرِفْ عَنِّي سَيِّئَهَا فَإِنَّهُ لَا يَصْرِفُ عَنِّي سَيِّئَهَا إِلَّا أَنْتَ',
    translation: "O Allah, guide me to the best of deeds and the best of character, for none guides to the best of them except You. And protect me from evil deeds and evil character, for none protects from them except You.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'creation_guidance',
    title: 'Total Dependence on Allah',
    arabic: 'اللَّهُمَّ أَنْتَ خَلَقْتَنِي وَأَنْتَ تَهْدِينِي، وَأَنْتَ تُطْعِمُنِي وَأَنْتَ تَسْقِينِي، وَأَنْتَ تُمِيتُنِي وَأَنْتَ تُحْيِينِي، اقْضِ عَنِّي الدَّيْنَ، وَأَغْنِنِي مِنَ الْفَقْرِ، وَتَوَفَّنِي مُسْلِماً، وَأَلْحِقْنِي بِالصَّالِحِينَ',
    translation: "O Allah, You created me and You guide me, You feed me and You give me drink, You cause me to die and You give me life. Settle my debt for me, enrich me from poverty, cause me to die as a Muslim, and join me with the righteous.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'ya_ghaniyyu',
    title: 'Seeking Sufficiency',
    arabic: 'اللَّهُمَّ يَا غَنِيُّ يَا حَمِيدُ، يَا مُبْدِئُ يَا مُعِيدُ، يَا رَحِيمُ يَا وَدُودُ، يَا ذَا الْعَرْشِ الْمَجِيدِ، يَا فَعَّالٌ لِمَا يُرِيدُ، اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَبِطَاعَتِكَ عَنْ مَعْصِيَتِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    translation: "O Allah, O Rich, O Praiseworthy, O Initiator, O Restorer, O Merciful, O Loving, O Possessor of the Glorious Throne, O Doer of whatever He wills. Suffice me with Your lawful provision against Your prohibited provision, and with obedience to You against disobedience to You, and enrich me with Your bounty making me independent of anyone other than You.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'health_faith',
    title: 'Health in Faith',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ صِحَّةً فِي إِيمَانٍ، وَإِيمَاناً فِي حُسْنِ خُلُقٍ، وَصَلَاحاً يَتْبَعُهُ نَجَاحٌ وَفَلَاحٌ',
    translation: "O Allah, I ask You for health in faith, and faith in good character, and success that is followed by prosperity.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'relief_worry',
    title: 'Relief from Worry',
    arabic: 'اللَّهُمَّ فَارِجَ الْهَمِّ، كَاشِفَ الْغَمِّ، مُجِيبَ دَعْوَةِ الْمُضْطَرِّينَ، رَحْمَانَ الدُّنْيَا وَالْآخِرَةِ وَرَحِيمَهُمَا، أَنْتَ تَرْحَمُنِي فَارْحَمْنِي بِرَحْمَةٍ تُغْنِينِي بِهَا عَنْ رَحْمَةِ مَنْ سِوَاكَ',
    translation: "O Allah, Reliever of worry, Remover of grief, Responder to the call of the desperate, Most Gracious of this world and the Hereafter and Most Merciful of them both. You have mercy on me, so have mercy on me with a mercy that makes me independent of the mercy of anyone other than You.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'quran_naml',
    title: 'Gratitude (Surah An-Naml)',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to do righteousness of which You approve. And admit me by Your mercy into [the ranks of] Your righteous servants.",
    count: 1,
    reference: "Page 3"
  },
  {
    id: 'quran_ahqaf',
    title: 'Righteousness (Surah Al-Ahqaf)',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي ۖ إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ',
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents and to work righteousness of which You will approve and make righteous for me my offspring. Indeed, I have repented to You, and indeed, I am of the Muslims.",
    count: 1,
    reference: "Page 3"
  },
  {
    id: 'quran_furqan',
    title: 'Family Blessings (Surah Al-Furqan)',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
    count: 1,
    reference: "Page 3"
  },
  {
    id: 'guidance_dua',
    title: 'Guidance & Keys to Good',
    arabic: 'اللَّهُمَّ اهْدِنَا وَاهْدِ بِنَا، وَيَسِّرِ الْهُدَى إِلَيْنَا، وَاجْعَلْنَا مَفَاتِيحَ لِلْخَيْرِ مَغَالِيقَ لِلشَّرِّ',
    translation: "O Allah, guide us and guide through us, and make guidance easy for us, and make us keys to good and locks to evil.",
    count: 1,
    reference: "Page 4"
  },
  {
    id: 'quran_anxiety_relief',
    title: 'Anxiety Relief & Loving the Quran',
    arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَداً مِنْ خَلْقِكَ، أَوْ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ الْعَظِيمَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي وَغَمِّي',
    translation: "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your decree over me is ever executed, and Your judgment over me is entirely just. I ask You by every name belonging to You which You have named Yourself, or revealed in Your Book, or taught to any of Your creation, or preserved in the knowledge of the Unseen with You, that You make the Magnificent Quran the spring of my heart, the light of my chest, the banisher of my sadness, and the reliever of my anxiety.",
    count: 1,
    reference: "Page 2"
  },
  {
    id: 'comprehensive_good',
    title: 'Asking for All Good',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ وَعَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ وَعَمَلٍ، وَأَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَرَسُولُكَ سَيِّدُنَا مُحَمَّدٌ ﷺ، وَأَسْأَلُكَ مَا قَضَيْتَ لِي مِنْ أَمْرٍ أَنْ تَجْعَلَ عَاقِبَتَهُ رَشَداً بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ',
    translation: "O Allah, I ask You for all goodness, both in the immediate present and the distant future, what I know of it and what I do not know. And I seek refuge in You from all evil, both in the immediate present and the distant future, what I know of it and what I do not know. O Allah, I ask You for Paradise and whatever words or actions bring me closer to it, and I seek refuge in You from the Fire and whatever words or actions bring me closer to it. I ask You for the best of what Your servant and Messenger Muhammad (SAW) asked You for, and I ask that whatever decree You have ordained for me, You make its outcome guided.",
    count: 1,
    reference: "Page 3"
  },
  {
    id: 'guidance_blessings',
    title: 'Unconditional Guidance & Protection',
    arabic: 'اللَّهُمَّ اهْدِنِي مِنْ عِنْدِكَ، وَأَفِضْ عَلَيَّ مِنْ فَضْلِكَ، وَانْشُرْ عَلَيَّ مِنْ رَحْمَتِكَ، وَأَنْزِلْ عَلَيَّ مِنْ بَرَكَاتِكَ، يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، لَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، وَصَلَّى اللهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ',
    translation: "O Allah, guide me from Yourself, pour Your favors upon me, spread Your mercy over me, and send down Your blessings upon me. O Ever-Living, O Sustainer, in Your mercy I seek relief, do not leave me to myself even for the blink of an eye, and rectify all my affairs. May Allah send blessings and peace upon our master Muhammad, and upon his family and companions.",
    count: 1,
    reference: "Page 3"
  },
  {
    id: 'quran_cure_shield',
    title: 'Quran as Cure & Preservation',
    arabic: 'اللَّهُمَّ لَا تُشْمِتْ أَعْدَائِي بِدَائِي، وَاجْعَلِ الْقُرْآنَ الْعَظِيمَ شِفَائِي وَدَوَائِي، فَأَنَا الْعَلِيلُ وَأَنْتَ الْمُدَاوِي، أَنْتَ ثِقَتِي وَرَجَائِي، وَاجْعَلْ حُسْنِ ظَنِّي بِكَ شِفَائِي، اللَّهُمَّ احْفَظْ عَلَيَّ عَقْلِي وَدِينِي، وَبِكَ يَا رَبِّ ثَبِّتْ يَقِينِي، وَارْزُقْنِي رِزْقاً حَلَالاً يَكْفِينِي، وَأَبْعِدْ عَنِّي شَرَّ مَنْ يُؤْذِينِي، وَلَا تُحْوِجْنِي إِلَى طَبِيبٍ يُدَاوِينِي، اللَّهُمَّ اسْتُرْنِي فَوْقَ الْأَرْضِ، اللَّهُمَّ ارْحَمْنِي فِي بَطْنِ الْأَرْضِ، اللَّهُمَّ اغْفِرْ لِي يَوْمَ الْعَرْضِ',
    translation: "O Allah, do not let my enemies rejoice over my illness, and make the magnificent Quran my cure and medicine, for I am the sick and You are the Healer, You are my trust and hope. Make my good opinion of You my healing. O Allah, preserve my intellect and religion, and through You, O Lord, strengthen my certainty, provide me with lawful sustenance that suffices me, keep me away from the evil of those who harm me, and do not make me in need of a doctor to treat me. O Allah, cover me above the earth, O Allah, have mercy on me inside the earth, O Allah, forgive me on the Day of presentation before You.",
    count: 1,
    reference: "Page 3"
  }
];

export const specificWird: DhikrItem[] = [
  {
    id: 'hasbiyallah',
    title: 'Hasbiyallah',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    translation: "Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
    count: 7,
    reference: "Page 3"
  },
  {
    id: 'protection_sami',
    title: 'Protection from Shaytan',
    arabic: 'أَعُوذُ بِاللهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    translation: "I seek refuge in Allah, the All-Hearing, the All-Knowing, from the accursed Satan.",
    count: 3,
    reference: "Page 3"
  },
  {
    id: 'salawat_10',
    title: 'Salawat (Blessings on Prophet)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    translation: "O Allah, send blessings upon our Master Muhammad and upon his family and companions and grant them peace.",
    count: 10,
    reference: "Page 3"
  },
  {
    id: 'jaza_allah',
    title: 'Reward for the Prophet',
    arabic: 'جَزَى اللَّهُ عَنَّا سَيِّدَنَا مُحَمَّداً ﷺ مَا هُوَ أَهْلُهُ',
    translation: "May Allah reward our Master Muhammad (peace be upon him) on our behalf with what he is worthy of.",
    count: 3,
    reference: "Page 3"
  },
  {
    id: 'hasbuna',
    title: 'Sufficiency of Allah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    count: 11,
    reference: "Page 4"
  },
  {
    id: 'yunus',
    title: 'Dua of Yunus (AS)',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    count: 11,
    reference: "Page 4"
  },
  {
    id: 'ufawwidu',
    title: 'Trust in Allah',
    arabic: 'وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ ۚ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ',
    translation: "And I entrust my affair to Allah. Indeed, Allah is Seeing of [His] servants.",
    count: 11,
    reference: "Page 4"
  },
  {
    id: 'hayyu_qayyum',
    title: 'Beseeching Mercy',
    arabic: 'يَا حَيُّ يَا قَيُّومُ لَا إِلَهَ إِلَّا أَنْتَ بِرَحْمَتِكَ أَسْتَغِيثُ',
    translation: "O Ever-Living, O Sustainer, there is no deity but You, in Your mercy I seek relief.",
    count: 11,
    reference: "Page 4"
  },
  {
    id: 'jaza_allah_long',
    title: 'Reward for the Prophet (Extended)',
    arabic: 'جَزَى اللَّهُ عَنَّا سَيِّدَنَا مُحَمَّداً ﷺ مَا هُوَ أَهْلُهُ',
    translation: "May Allah reward our Master Muhammad (peace be upon him) on our behalf with what he is worthy of.",
    count: 11,
    reference: "Page 4"
  },
  {
    id: 'tahlil_haqq',
    title: 'The Manifest Truth',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْمَلِكُ الْحَقُّ الْمُبِينُ',
    translation: "There is no god but Allah, the King, the Manifest Truth.",
    count: 10,
    reference: "Page 4"
  },
  {
    id: 'tawwab',
    title: 'Seeking Forgiveness',
    arabic: 'يَا تَوَّابُ يَا غَفُورُ يَا رَحِيمُ يَا لَطِيفُ',
    translation: "O Accepter of Repentance, O Forgiver, O Merciful, O Subtle.",
    count: 10,
    reference: "Page 4"
  },
  {
    id: 'sufficiency',
    title: 'Sufficiency in Knowledge',
    arabic: 'حَسْبِي مِنْ سُؤَالِي عِلْمُكَ بِحَالِي',
    translation: "Your knowledge of my condition is sufficient for me instead of my asking.",
    count: 10,
    reference: "Page 4"
  },
  {
    id: 'tasbih_strength',
    title: 'Praise & Power',
    arabic: 'سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ',
    translation: "Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest, and there is no power nor strength except through Allah, the Most High, the Magnificent.",
    count: 10,
    reference: "Page 4"
  },
  {
    id: 'names_protection_short',
    title: 'Name of Allah Protection',
    arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    translation: "In the name of Allah with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
    count: 3,
    reference: "Page 4"
  },
  {
    id: 'la_ilaha_wahdahu',
    title: 'Declaration of Unity',
    arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    translation: "There is no deity but Allah alone, He has no partner. His is the dominion and His is the praise, and He is over all things competent.",
    count: 10,
    reference: "Page 4"
  }
];

export const istighfarCollection: DhikrItem[] = [
  {
    id: 'sayyid_istighfar',
    title: 'Sayyid al-Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translation: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave. I keep Your covenant and Your promise as best as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me, and I acknowledge my sin. So forgive me, for verily, none forgives sins except You.",
    count: 1,
    reference: "Bukhari"
  },
  {
    id: 'astaghfirullah_100',
    title: 'Asking Forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    translation: "I seek forgiveness from Allah and repent to Him.",
    count: 100,
    reference: "Muslim"
  },
  {
    id: 'rabbi_ighfir',
    title: 'Forgiveness and Mercy',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    translation: "My Lord, forgive me and accept my repentance, indeed You are the Oft-Returning, the Merciful.",
    count: 100,
    reference: "Abu Dawud"
  }
];

export const hizbs: DhikrItem[] = [
  {
    id: 'hizb_bahr_full',
    title: 'Hizb al-Bahr (Complete Protection Litany)',
    arabic: `بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ
اللَّهُمَّ يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا عَلِيمُ * أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي * فَنِعْمَ الرَّبُّ رَبِّي وَنِعْمَ الْحَسْبُ حَسْبِي * تَنْصُرُ مَنْ تَشَاءُ وَأَنْتَ الْعَزِيزُ الرَّحِيمُ * نَسْأَلُكَ الْعِصْمَةَ فِي الْحَرَكَاتِ وَالسَّكَنَاتِ وَالْكَلِمَاتِ وَالْإِرَادَاتِ وَالْخَطَرَاتِ مِنَ الظُّنُونِ وَالشُّكُوكِ وَالْأَوْهَامِ السَّاتِرَةِ لِلْقُلُوبِ عَنْ مُطَالَعَةِ الْغُيُوبِ

فَقَدِ ابْتُلِيَ الْمُؤْمِنُونَ وَزُلْزِلُوا زِلْزَالًا شَدِيدًا * وَإِذْ يَقُولُ الْمُنَافِقُونَ وَالَّذِينَ فِي قُلُوبِهِم مَّرَضٌ مَّا وَعَدَنَا اللَّهُ وَرَسُولُهُ إِلَّا غُرُورًا * فَثَبِّتْنَا وَانصُرْنَا وَسَخِّرْ لَنَا هَذَا الْبَحْرَ كَمَا سَخَّرْتَ الْبَحْرَ لِمُوسَى عَلَيْهِ السَّلَامُ * وَسَخِّرْ لَنَا النَّارَ لِإِبْرَاهِيمَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ الْجِبَالَ وَالْحَدِيدَ لِدَاوُدَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ الرِّيحَ وَالشَّيَاطِينَ وَالْجِنَّ لِسُلَيْمَانَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ لَنَا كُلَّ بَحْرٍ هُوَ لَكَ فِي الْأَرْضِ وَالسَّمَاءِ وَالْمُلْكِ وَالْمَلَكُوتِ * وَبَحْرَ الدُّنْيَا وَبَحْرَ الْآخِرَةِ * وَسَخِّرْ لَنَا كُلَّ شَيْءٍ يَا مَنْ بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ

كهيعص * كهيعص * كهيعص

أُنْصُرْنَا فَإِنَّكَ خَيْرُ النَّاصِرِينَ * وَافْتَحْ لَنَا فَإِنَّكَ خَيْرُ الْفَاتِحِينَ * وَاغْفِرْ لَنَا فَإِنَّكَ خَيْرُ الْغَافِرِينَ * وَارْحَمْنَا فَإِنَّكَ خَيْرُ الرَّاحِمِينَ * وَارْزُقْنَا فَإِنَّكَ خَيْرُ الرَّازِقِينَ * وَاهْدِنَا وَنَجِّنَا مِنَ الْقَوْمِ الظَّالِمِينَ

وَهَبْ لَنَا مِنْ لَدُنْكَ رِيحًا طَيِّبَةً كَمَا هِيَ فِي عِلْمِكَ * وَانْشُرْهَا عَلَيْنَا مِنْ خَزَائِنِ رَحْمَتِكَ * وَاحْمِلْنَا بِهَا حَمْلَ الْكَرَامَةِ مَعَ السَّلَامَةِ وَالْعَافِيَةِ فِي الدِّينِ وَالدُّنْيَا وَالْآخِرَةِ * إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ * اللَّهُمَّ يَسِّرْ لَنَا أُمُورَنَا مَعَ الرَّاحَةِ لِقُلُوبِنَا وَأَبْدَانِنَا وَالسَّلَامَةِ وَالْعَافِيَةِ فِي دِينِنَا وَدُنْيَانَا وَكُنْ صَاحِبًا فِي سَفَرِنَا وَخَلِيفَةً فِي أَهْلِنَا

وَاطْمِسْ عَلَى وُجُوهِ أَعْدَائِنَا وَامْسَخْهُمْ عَلَى مَكَانَتِهِمْ فَلَا يَسْتَطِيعُونَ الْمُضِيَّ وَلَا الْمَجِيءَ إِلَيْنَا * وَلَوْ نَشَاءُ لَطَمَسْنَا عَلَى أَعْيُنِهِمْ فَاسْتَبَقُوا الصِّرَاطَ فَأَنَّى يُبْصِرُونَ * وَلَوْ نَشَاءُ لَمَسَخْنَاهُمْ عَلَى مَكَانَتِهِمْ فَمَا اسْتَطَاعُوا مُضِيًّا وَلَا يَرْجِعُونَ

يس * وَالْقُرْآنِ الْحَكِيمِ * إِنَّكَ لَمِنَ الْمُرْسَلِينَ * عَلَى صِرَاطٍ مُسْتَقِيمٍ * تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ * لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ * لَقَدْ حَقَّ الْقَوْلُ عَلَى أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ * إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُمْ مُقْمَحُونَ * وَجَعَلْنَا مِنْ بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ * شَاهَتِ الْوُجُوهُ * شَاهَتِ الْوُجُوهُ * شَاهَتِ الْوُجُوهُ

وَعَنَتِ الْوُجُوهُ لِلْحَيِّ الْقَيُّومِ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًا * طس * حم * عسق * مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ بَيْنَهُمَا بَرْزَخٌ لَا يَبْغِيَانِ * حم * حم * حم * حم * حم * حم * حم

حم * عَمَّ الْأَمْرُ وَجَاءَ النَّصْرُ فَعَلَيْنَا لَا يُنْصَرُونَ * حم * تَنْزِيلُ الْكِتَابِ مِنَ اللَّهِ الْعَزِيزِ الْعَلِيمِ * غَافِرِ الذَّنْبِ وَقَابِلِ التَّوْبِ شَدِيدِ الْعِقَابِ ذِي الطَّوْلِ لَا إِلَهَ إِلَّا هُوَ إِلَيْهِ الْمَصِيرُ * بِسْمِ اللَّهِ بَابُنَا * تَبَارَكَ حِيطَانُنَا * يس سَقْفُنَا * كهيعص كِفَايَتُنَا * حم عسق حِمَايَتُنَا

فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ (ثلاثًا) * سِتْرُ الْعَرْشِ مَسْبُولٌ عَلَيْنَا * وَعَيْنُ اللَّهِ نَاظِرَةٌ إِلَيْنَا * بِحَوْلِ اللَّهِ لَا يُقْدَرُ عَلَيْنَا (ثلاثًا) * وَاللَّهُ مِنْ وَرَائِهِمْ مُحِهِيطٌ * بَلْ هُوَ قُرْآنٌ مَجِيدٌ * فِي لَوْحٍ مَحْفُوظٍ * فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ (ثلاثًا) * إِنَّ وَلِيِّيَ اللَّهُ الَّذِي نَزَّلَ الْكِتَابَ وَهُوَ يَتَوَلَّى الصَّالِحِينَ (ثلاثًا) * حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ (ثلاثًا) * بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (ثلاثًا) * أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (ثلاثًا) * وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ (ثلاثًا) * وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ وَسَلَّمَ * سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ * وَسَلَامٌ عَلَى الْمُرْسَلِينَ * وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ`,
    transliteration: `Bismillāhir-raḥmānir-raḥīm. Allāhumma ṣalli 'alā sayyidinā Muḥammadin wa 'alā ālihi wa ṣaḥbihi wa sallim. Allāhumma yā 'Aliyyu yā 'Aẓīmu yā Ḥalīmu yā 'Alīm. Anta rabbī wa 'ilmuka ḥasbī. Fa ni'mar-rabbu rabbī wa ni'mal-ḥasbu ḥasbī. Tanṣuru man tashā'u wa antal-'azīzur-raḥīm. Nas'alukal-'iṣmata fil-ḥarakāti was-sakanāti wal-kalimāti wal-irādāti wal-khaṭarāti minad-ḍunūni wash-shukūki wal-awhāmis-sātirati lil-qulūbi 'an muṭāla'atil-ghuyūb.

Faqadibtuliyal-mu'minūna wa zulzilū zilzālan shadīdā. Wa idh yaqūlul-munāfiqūna wal-ladhīna fī qulūbihim maraḍun mā wa'adanā-Allāhu wa rasūluhū illā ghurūrā. Fa thabbitnā wanṣurnā wa sakhkhir lanā hādhal-baḥra kamā sakhkhartal-baḥra li-Mūsā 'alayhis-salām, wa sakhkhartan-nāra li-Ibrāhīma 'alayhis-salām, wa sakhkhartal-jibāla wal-ḥadīda li-Dāwūda 'alayhis-salām, wa sakhkhartar-rīḥa wash-shayāṭīna wal-jinna li-Sulaymāna 'alayhis-salām. Wa sakhkhir lanā kulla baḥrin huwa laka fil-arḍi was-samā'i wal-mulki wal-malakūt, wa baḥrad-dunyā wa baḥral-ākhirah. Wa sakhkhir lanā kulla shay'in yā man biyadihī malakūtu kulli shay'.

Kāf-Hā-Yā-'Ayn-Ṣāḍ. Kāf-Hā-Yā-'Ayn-Ṣāḍ. Kāf-Hā-Yā-'Ayn-Ṣāḍ.

Unṣurnā fa-innaka khayrun-nāṣirīn. Waftaḥ lanā fa-innaka khayrul-fātiḥīn. Waghfir lanā fa-innaka khayrul-ghāfirīn. Warḥamnā fa-innaka khayrur-rāḥimīn. Warzuqnā fa-innaka khayrur-rāziqīn. Wahdinā wa najjinā minal-qawmiḍ-ḍālimīn.

Wa hab lanā min ladunka rīḥan ṭayyibatan kamā hiya fī 'ilmik, wan-shurhā 'alaynā min khazā'ini raḥmatik. Waḥ-milnā bihā ḥamlal-karāmati ma'as-salāmati wal-'āfiyati fid-dīni wad-dunyā wal-ākhirah. Innaka 'alā kulli shay'in qadīr. Allāhumma yassir lanā umūranā ma'ar-rāḥati li-qulūbinā wa abdāninā was-salāmati wal-'āfiyati fī dīninā wa dunyānā wa kun ṣāḥiban fī safarinā wa khalīfatan fī ahlinā.

Waṭmis 'alā wujūhi a'dā'inā wamsakh-hum 'alā makānatihim falā yastaṭī'ūnal-muḍiyya walal-majī'a ilaynā. Wa law nashā'u laṭamasnā 'alā a'yunihim fastabaquṣ-ṣirāṭa fa-annā yubṣirūn. Wa law nashā'u lamasakhnāhum 'alā makānatihim famas-taṭā'ū muḍiyyan wa lā yarji'ūn.

Yā-sīn. Wal-qur'ānil-ḥakīm. Innaka laminal-mursalīn. 'Alā ṣirāṭim-mustaqīm. Tanzīlal-'azīzir-raḥīm. Li-tundhira qawmam-mā undhira ābā'uhum fahum ghāfilūn. Laqad ḥaqqal-qawlu 'alā aktharihim fahum lā yu'minūn. Innā ja'alnā fī a'nāqihim aghlālan fahiye ilal-adhqāni fahum muqmaḥūn. Wa ja'alnā mim-bayni aydīhim saddan wa min khalfihim saddan fa-aghshaynāhum fahum lā yubṣirūn. Shāhatil-wujūh. Shāhatil-wujūh. Shāhatil-wujūh.

Wa 'anatil-wujūhu lil-ḥayyil-qayyūmi wa qad khāba man ḥamala ḍulmā. Ṭā-Sīn. Ḥā-Mīm. 'Ayn-Sīn-Qāf. Marajal-baḥrayni yaltaqiyāni baynahumā barzakhul-lā yabghiyān. Ḥā-Mīm (x7).

Ḥā-Mīm. 'Ammal-amru wa jā'an-naṣru fa'alaynā lā yunṣarūn. Ḥā-Mīm. Tanzīlul-kitābi minallāhil-'azīzil-'alīm, ghāfiridh-dhanbi wa qābilit-tawbi shadīdil-'iqābi dhit-ṭawl, lā ilāha illā huwa ilayhil-maṣīr. Bismillāhi bābunā, Tabāraka ḥīṭānunā, Yā-Sīn saqfunā, Kāf-Hā-Yā-'Ayn-Ṣāḍ kifāyatunā, Ḥā-Mīm-'Ayn-Sīn-Qāf ḥimāyatunā.

Fa-sayakfīkahumullāhu wa huwas-samī'ul-'alīm (x3). Sitrul-'arshi masbūlun 'alaynā, wa 'aynullāhi nāḍiratun ilaynā, bi-ḥawlillāhi lā yuqdaru 'alaynā (x3). Wallāhu miw-warā'ihim muḥīṭ, bal huwa qur'ānum-majīd fī lawḥim-maḥfūẓ. Fallāhu khayrun ḥāfiḍaw-wa huwa arḥamur-rāḥimīn (x3). Inna waliyyiyallāhul-ladhī nazzalal-kitāba wa huwa yatawallas-ṣāliḥīn (x3). Ḥasbiyallāhu lā ilāha illā huwa 'alayhi tawakkaltu wa huwa rabbul-'arshil-'aẓīm (x3). Bismillāhil-ladhī lā yaḍurru ma'asmihī shay'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm (x3). A'ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq (x3). Wa lā ḥawla wa lā quwwata illā billāhil-'aliyyil-'aẓīm (x3). Wa ṣallallāhu 'alā sayyidinā Muḥammadin wa 'alā ālihi wa ṣaḥbihi wa sallam. Subḥāna rabbika rabbil-'izzati 'ammā yaṣifūn, wa salāmun 'alal-mursalīn, wal-ḥamdu lillāhi rabbil-'ālamīn.`,
    translation: `In the name of Allah, the Entirely Merciful, the Especially Merciful. O Allah, send blessings and peace upon our Master Muhammad and upon his family and companions. O Allah, O Most High, O Supreme, O Forbearing, O All-Knowing! You are my Lord, and Your knowledge is my sufficiency. How perfect is my Lord, and how perfect is my sufficiency! You grant victory to whomsoever You will, and You are the Almighty, the All-Merciful. We ask of You protection in our movements and our stillness, our words, our desires, and our thoughts, from the doubts, the suspicions, and the illusions that veil our hearts from beholding the Unseen.

For 'the believers were tried and shaken with a mighty shaking.' And when the hypocrites and those in whose hearts is a disease said, 'Allah and His Messenger promised us nothing but delusion.' So keep us firm, aid us, and subject to us this sea as You subjected the sea to Moses (A.S.), and subjected the fire to Abraham (A.S.), and subjected the mountains and iron to David (A.S.), and subjected the wind and the devils and the jinn to Solomon (A.S.). And subject to us every sea that is Yours on earth and in heaven, in the physical kingdom and the spiritual dominion, and the sea of this world, and the sea of the Hereafter. And subject to us everything, O You in whose Hand is the dominion over all things.

Kaf, Ha, Ya, 'Ayn, Sad. (x3) (These divine letters are deep secrets of spiritual protection).

Aid us, for You are the best of helpers. And open for us, for You are the best of openers. And forgive us, for You are the best of forgivers. And have mercy upon us, for You are the best of those who show mercy. And provide for us, for You are the best of providers. And guide us and deliver us from the wrongdoing people.

And grant us, from Your presence, a gentle wind, as exists in Your knowledge. Scatter it over us from the treasuries of Your mercy, and carry us by it a carriage of honor with peace, safety, and well-being in our religion, our worldly life, and the Hereafter. Verily, You have power over all things. O Allah, make easy for us our affairs, along with comfort for our hearts and bodies, and peace and well-being in our religion and our worldly life. Be our companion on our journey and the guardian over our families.

And obliterate the faces of our enemies and freeze them in their places, so they can neither move forward nor come towards us. 'And if We willed, We would have obliterated their eyes, then they would race to the path, but how could they see? And if We willed, We would have transformed them in their places, then they would not be able to proceed nor could they return.'

Ya-Sin. By the wise Quran, indeed you are among the messengers, on a straight path. A revelation of the Almighty, the Merciful, that you may warn a people whose fathers were not warned, so they are heedless. Already the word has come into effect against most of them, so they do not believe. Indeed, We have put shackles on their necks up to their chins, so their heads are forced up. And We have put a barrier before them and a barrier behind them, and We have covered them, so they do not see. Defaced are the faces! Defaced are the faces! Defaced are the faces!

And all faces shall be humbled before the Living, the Self-Sustaining. And indeed, ruined is he who carries wrongdoing. Ta-Sin. Ha-Meem. 'Ayn-Seen-Qaaf. He released the two seas, meeting side-by-side; between them is a barrier they cannot transgress. Ha-Meem (x7).

Ha-Meem! The matter is decreed, victory has come, and over us they shall not be victorious. Ha-Meem. The revelation of the Book is from Allah, the Almighty, the All-Knowing. The Forgiver of sin, the Accepter of repentance, severe in punishment, owner of abundance. There is no deity except Him; to Him is the final return. In the Name of Allah is our door. 'Blessed is He' (Tabarak) is our walls. Ya-Sin is our roof. Kaf-Ha-Ya-Ayn-Sad is our sufficiency. Ha-Meem-Ayn-Seen-Qaaf is our protection.

So Allah will sufficient you against them, and He is the All-Hearing, the All-Knowing (x3). The veil of the Throne is drawn over us, and the Eye of Allah is gazing upon us. By the power of Allah, no one can overpower us (x3). 'And Allah encompasses them from behind. Indeed, it is a glorious Quran, in a preserved tablet.' And Allah is the best of Guardians, and He is the Most Merciful of those who show mercy (x3). 'Verily, my protector is Allah, who has revealed the Book, and He protects the righteous' (x3). 'Sufficient for me is Allah; there is no deity except Him. Upon Him I trust, and He is the Lord of the Great Throne' (x3). In the Name of Allah, with whose Name nothing can cause harm on earth nor in heaven, and He is the All-Hearing, the All-Knowing (x3). I seek refuge in the perfect words of Allah from the evil of what He created (x3). There is no power nor strength except through Allah, the Most High, the Supreme (x3). And may Allah bless our Master Muhammad, and his Family and Companions, and grant them peace. Glory be to your Lord, the Lord of Might, above what they describe. And peace be upon the messengers. And praise be to Allah, Lord of the worlds.`,
    sections: [
      {
        id: 'hb_1',
        title: '1. Opening: Basmala, Salawat & Divine Sufficiency',
        arabic: `بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ
اللَّهُمَّ يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا عَلِيمُ * أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي * فَنِعْمَ الرَّبُّ رَبِّي وَنِعْمَ الْحَسْبُ حَسْبِي * تَنْصُرُ مَنْ تَشَاءُ وَأَنْتَ الْعَزِيزُ الرَّحِيمُ * نَسْأَلُكَ الْعِصْمَةَ فِي الْحَرَكَاتِ وَالسَّكَنَاتِ وَالْكَلِمَاتِ وَالْإِرَادَاتِ وَالْخَطَرَاتِ مِنَ الظُّنُونِ وَالشُّكُوكِ وَالْأَوْهَامِ السَّاتِرَةِ لِلْقُلُوبِ عَنْ مُطَالَعَةِ الْغُيُوبِ`,
        transliteration: `Bismillāhir-raḥmānir-raḥīm. Allāhumma ṣalli 'alā sayyidinā Muḥammadin wa 'alā ālihi wa ṣaḥbihi wa sallim. Allāhumma yā 'Aliyyu yā 'Aẓīmu yā Ḥalīmu yā 'Alīm. Anta rabbī wa 'ilmuka ḥasbī. Fa ni'mar-rabbu rabbī wa ni'mal-ḥasbu ḥasbī. Tanṣuru man tashā'u wa antal-'azīzur-raḥīm. Nas'alukal-'iṣmata fil-ḥarakāti was-sakanāti wal-kalimāti wal-irādāti wal-khaṭarāti minad-ḍunūni wash-shukūki wal-awhāmis-sātirati lil-qulūbi 'an muṭāla'atil-ghuyūb.`,
        translation: `In the name of Allah, the Entirely Merciful, the Especially Merciful. O Allah, send blessings and peace upon our Master Muhammad and upon his family and companions. O Allah, O Most High, O Supreme, O Forbearing, O All-Knowing! You are my Lord, and Your knowledge is my sufficiency. How perfect is my Lord, and how perfect is my sufficiency! You grant victory to whomsoever You will, and You are the Almighty, the All-Merciful. We ask of You protection in our movements and our stillness, our words, our desires, and our thoughts, from the doubts, the suspicions, and the illusions that veil our hearts from beholding the Unseen.`
      },
      {
        id: 'hb_2',
        title: '2. Believers\' Trial & Subjugation of Creation',
        arabic: `فَقَدِ ابْتُلِيَ الْمُؤْمِنُونَ وَزُلْزِلُوا زِلْزَالًا شَدِيدًا * وَإِذْ يَقُولُ الْمُنَافِقُونَ وَالَّذِينَ فِي قُلُوبِهِم مَّرَضٌ مَّا وَعَدَنَا اللَّهُ وَرَسُولُهُ إِلَّا غُرُورًا * فَثَبِّتْنَا وَانصُرْنَا وَسَخِّرْ لَنَا هَذَا الْبَحْرَ كَمَا سَخَّرْتَ الْبَحْرَ لِمُوسَى عَلَيْهِ السَّلَامُ * وَسَخِّرْ لَنَا النَّارَ لِإِبْرَاهِيمَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ الْجِبَالَ وَالْحَدِيدَ لِدَاوُدَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ الرِّيحَ وَالشَّيَاطِينَ وَالْجِنَّ لِسُلَيْمَانَ عَلَيْهِ السَّلَامُ * وَسَخِّرْ لَنَا كُلَّ بَحْرٍ هُوَ لَكَ فِي الْأَرْضِ وَالسَّمَاءِ وَالْمُلْكِ وَالْمَلَكُوتِ * وَبَحْرَ الدُّنْيَا وَبَحْرَ الْآخِرَةِ * وَسَخِّرْ لَنَا كُلَّ شَيْءٍ يَا مَنْ بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ`,
        transliteration: `Faqadibtuliyal-mu'minūna wa zulzilū zilzālan shadīdā. Wa idh yaqūlul-munāfiqūna wal-ladhīna fī qulūbihim maraḍun mā wa'adanā-Allāhu wa rasūluhū illā ghurūrā. Fa thabbitnā wanṣurnā wa sakhkhir lanā hādhal-baḥra kamā sakhkhartal-baḥra li-Mūsā 'alayhis-salām, wa sakhkhartan-nāra li-Ibrāhīma 'alayhis-salām, wa sakhkhartal-jibāla wal-ḥadīda li-Dāwūda 'alayhis-salām, wa sakhkhartar-rīḥa wash-shayāṭīna wal-jinna li-Sulaymāna 'alayhis-salām. Wa sakhkhir lanā kulla baḥrin huwa laka fil-arḍi was-samā'i wal-mulki wal-malakūt, wa baḥrad-dunyā wa baḥral-ākhirah. Wa sakhkhir lanā kulla shay'in yā man biyadihī malakūtu kulli shay'.`,
        translation: `For 'the believers were tried and shaken with a mighty shaking.' And when the hypocrites and those in whose hearts is a disease said, 'Allah and His Messenger promised us nothing but delusion.' So keep us firm, aid us, and subject to us this sea as You subjected the sea to Moses (A.S.), and subjected the fire to Abraham (A.S.), and subjected the mountains and iron to David (A.S.), and subjected the wind and the devils and the jinn to Solomon (A.S.). And subject to us every sea that is Yours on earth and in heaven, in the physical kingdom and the spiritual dominion, and the sea of this world, and the sea of the Hereafter. And subject to us everything, O You in whose Hand is the dominion over all things.`
      },
      {
        id: 'hb_3',
        title: '3. Mystical Letters of Protection (Kāf-Hā-Yā-\'Ayn-Ṣāḍ)',
        arabic: `كهيعص * كهيعص * كهيعص`,
        transliteration: `Kāf-Hā-Yā-'Ayn-Ṣāḍ. Kāf-Hā-Yā-'Ayn-Ṣāḍ. Kāf-Hā-Yā-'Ayn-Ṣāḍ.`,
        translation: `Kaf, Ha, Ya, 'Ayn, Sad. (x3) (These divine letters are deep secrets of spiritual protection).`,
        count: '3x'
      },
      {
        id: 'hb_4',
        title: '4. Six Invocations for Victory, Deliverance & Guidance',
        arabic: `أُنْصُرْنَا فَإِنَّكَ خَيْرُ النَّاصِرِينَ * وَافْتَحْ لَنَا فَإِنَّكَ خَيْرُ الْفَاتِحِينَ * وَاغْفِرْ لَنَا فَإِنَّكَ خَيْرُ الْغَافِرِينَ * وَارْحَمْنَا فَإِنَّكَ خَيْرُ الرَّاحِمِينَ * وَارْزُقْنَا فَإِنَّكَ خَيْرُ الرَّازِقِينَ * وَاهْدِنَا وَنَجِّنَا مِنَ الْقَوْمِ الظَّالِمِينَ`,
        transliteration: `Unṣurnā fa-innaka khayrun-nāṣirīn. Waftaḥ lanā fa-innaka khayrul-fātiḥīn. Waghfir lanā fa-innaka khayrul-ghāfirīn. Warḥamnā fa-innaka khayrur-rāḥimīn. Warzuqnā fa-innaka khayrur-rāziqīn. Wahdinā wa najjinā minal-qawmiḍ-ḍālimīn.`,
        translation: `Aid us, for You are the best of helpers. And open for us, for You are the best of openers. And forgive us, for You are the best of forgivers. And have mercy upon us, for You are the best of those who show mercy. And provide for us, for You are the best of providers. And guide us and deliver us from the wrongdoing people.`
      },
      {
        id: 'hb_5',
        title: '5. Gentle Breeze, Ease & Protection of Family',
        arabic: `وَهَبْ لَنَا مِنْ لَدُنْكَ رِيحًا طَيِّبَةً كَمَا هِيَ فِي عِلْمِكَ * وَانْشُرْهَا عَلَيْنَا مِنْ خَزَائِنِ رَحْمَتِكَ * وَاحْمِلْنَا بِهَا حَمْلَ الْكَرَامَةِ مَعَ السَّلَامَةِ وَالْعَافِيَةِ فِي الدِّينِ وَالدُّنْيَا وَالْآخِرَةِ * إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ * اللَّهُمَّ يَسِّرْ لَنَا أُمُورَنَا مَعَ الرَّاحَةِ لِقُلُوبِنَا وَأَبْدَانِنَا وَالسَّلَامَةِ وَالْعَافِيَةِ فِي دِينِنَا وَدُنْيَانَا وَكُنْ صَاحِبًا فِي سَفَرِنَا وَخَلِيفَةً فِي أَهْلِنَا`,
        transliteration: `Wa hab lanā min ladunka rīḥan ṭayyibatan kamā hiya fī 'ilmik, wan-shurhā 'alaynā min khazā'ini raḥmatik. Waḥ-milnā bihā ḥamlal-karāmati ma'as-salāmati wal-'āfiyati fid-dīni wad-dunyā wal-ākhirah. Innaka 'alā kulli shay'in qadīr. Allāhumma yassir lanā umūranā ma'ar-rāḥati li-qulūbinā wa abdāninā was-salāmati wal-'āfiyati fī dīninā wa dunyānā wa kun ṣāḥiban fī safarinā wa khalīfatan fī ahlinā.`,
        translation: `And grant us, from Your presence, a gentle wind, as exists in Your knowledge. Scatter it over us from the treasuries of Your mercy, and carry us by it a carriage of honor with peace, safety, and well-being in our religion, our worldly life, and the Hereafter. Verily, You have power over all things. O Allah, make easy for us our affairs, along with comfort for our hearts and bodies, and peace and well-being in our religion and our worldly life. Be our companion on our journey and the guardian over our families.`
      },
      {
        id: 'hb_6',
        title: '6. Neutralization of Enemy Harm & Inability to Attack',
        arabic: `وَاطْمِسْ عَلَى وُجُوهِ أَعْدَائِنَا وَامْسَخْهُمْ عَلَى مَكَانَتِهِمْ فَلَا يَسْتَطِيعُونَ الْمُضِيَّ وَلَا الْمَجِيءَ إِلَيْنَا * وَلَوْ نَشَاءُ لَطَمَسْنَا عَلَى أَعْيُنِهِمْ فَاسْتَبَقُوا الصِّرَاطَ فَأَنَّى يُبْصِرُونَ * وَلَوْ نَشَاءُ لَمَسَخْنَاهُمْ عَلَى مَكَانَتِهِمْ فَمَا اسْتَطَاعُوا مُضِيًّا وَلَا يَرْجِعُونَ`,
        transliteration: `Waṭmis 'alā wujūhi a'dā'inā wamsakh-hum 'alā makānatihim falā yastaṭī'ūnal-muḍiyya walal-majī'a ilaynā. Wa law nashā'u laṭamasnā 'alā a'yunihim fastabaquṣ-ṣirāṭa fa-annā yubṣirūn. Wa law nashā'u lamasakhnāhum 'alā makānatihim famas-taṭā'ū muḍiyyan wa lā yarji'ūn.`,
        translation: `And obliterate the faces of our enemies and freeze them in their places, so they can neither move forward nor come towards us. 'And if We willed, We would have obliterated their eyes, then they would race to the path, but how could they see? And if We willed, We would have transformed them in their places, then they would not be able to proceed nor could they return.'`
      },
      {
        id: 'hb_7',
        title: '7. Surah Ya-Sin Protection & Shielding Barriers',
        arabic: `يس * وَالْقُرْآنِ الْحَكِيمِ * إِنَّكَ لَمِنَ الْمُرْسَلِينَ * عَلَى صِرَاطٍ مُسْتَقِيمٍ * تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ * لِتُنْذِرَ قَوْمًا مَا أُنْذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ * لَقَدْ حَقَّ الْقَوْلُ عَلَى أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ * إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُمْ مُقْمَحُونَ * وَجَعَلْنَا مِنْ بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ * شَاهَتِ الْوُجُوهُ * شَاهَتِ الْوُجُوهُ * شَاهَتِ الْوُجُوهُ`,
        transliteration: `Yā-sīn. Wal-qur'ānil-ḥakīm. Innaka laminal-mursalīn. 'Alā ṣirāṭim-mustaqīm. Tanzīlal-'azīzir-raḥīm. Li-tundhira qawmam-mā undhira ābā'uhum fahum ghāfilūn. Laqad ḥaqqal-qawlu 'alā aktharihim fahum lā yu'minūn. Innā ja'alnā fī a'nāqihim aghlālan fahiye ilal-adhqāni fahum muqmaḥūn. Wa ja'alnā mim-bayni aydīhim saddan wa min khalfihim saddan fa-aghshaynāhum fahum lā yubṣirūn. Shāhatil-wujūh. Shāhatil-wujūh. Shāhatil-wujūh.`,
        translation: `Ya-Sin. By the wise Quran, indeed you are among the messengers, on a straight path. A revelation of the Almighty, the Merciful, that you may warn a people whose fathers were not warned, so they are heedless. Already the word has come into effect against most of them, so they do not believe. Indeed, We have put shackles on their necks up to their chins, so their heads are forced up. And We have put a barrier before them and a barrier behind them, and We have covered them, so they do not see. Defaced are the faces! Defaced are the faces! Defaced are the faces!`
      },
      {
        id: 'hb_8',
        title: '8. Humbling Before Al-Hayy Al-Qayyum & Seven Ha-Meem',
        arabic: `وَعَنَتِ الْوُجُوهُ لِلْحَيِّ الْقَيُّومِ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًا * طس * حم * عسق * مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ بَيْنَهُمَا بَرْزَخٌ لَا يَبْغِيَانِ * حم * حم * حم * حم * حم * حم * حم`,
        transliteration: `Wa 'anatil-wujūhu lil-ḥayyil-qayyūmi wa qad khāba man ḥamala ḍulmā. Ṭā-Sīn. Ḥā-Mīm. 'Ayn-Sīn-Qāf. Marajal-baḥrayni yaltaqiyāni baynahumā barzakhul-lā yabghiyān. Ḥā-Mīm (x7).`,
        translation: `And all faces shall be humbled before the Living, the Self-Sustaining. And indeed, ruined is he who carries wrongdoing. Ta-Sin. Ha-Meem. 'Ayn-Seen-Qaaf. He released the two seas, meeting side-by-side; between them is a barrier they cannot transgress. Ha-Meem (x7).`,
        count: '7x'
      },
      {
        id: 'hb_9',
        title: '9. The Decree of Victory & Sacred Enclosure',
        arabic: `حم * عَمَّ الْأَمْرُ وَجَاءَ النَّصْرُ فَعَلَيْنَا لَا يُنْصَرُونَ * حم * تَنْزِيلُ الْكِتَابِ مِنَ اللَّهِ الْعَزِيزِ الْعَلِيمِ * غَافِرِ الذَّنْبِ وَقَابِلِ التَّوْبِ شَدِيدِ الْعِقَابِ ذِي الطَّوْلِ لَا إِلَهَ إِلَّا هُوَ إِلَيْهِ الْمَصِيرُ * بِسْمِ اللَّهِ بَابُنَا * تَبَارَكَ حِيطَانُنَا * يس سَقْفُنَا * كهيعص كِفَايَتُنَا * حم عسق حِمَايَتُنَا`,
        transliteration: `Ḥā-Mīm. 'Ammal-amru wa jā'an-naṣru fa'alaynā lā yunṣarūn. Ḥā-Mīm. Tanzīlul-kitābi minallāhil-'azīzil-'alīm, ghāfiridh-dhanbi wa qābilit-tawbi shadīdil-'iqābi dhit-ṭawl, lā ilāha illā huwa ilayhil-maṣīr. Bismillāhi bābunā, Tabāraka ḥīṭānunā, Yā-Sīn saqfunā, Kāf-Hā-Yā-'Ayn-Ṣāḍ kifāyatunā, Ḥā-Mīm-'Ayn-Sīn-Qāf ḥimāyatunā.`,
        translation: `Ha-Meem! The matter is decreed, victory has come, and over us they shall not be victorious. Ha-Meem. The revelation of the Book is from Allah, the Almighty, the All-Knowing. The Forgiver of sin, the Accepter of repentance, severe in punishment, owner of abundance. There is no deity except Him; to Him is the final return. In the Name of Allah is our door. 'Blessed is He' (Tabarak) is our walls. Ya-Sin is our roof. Kaf-Ha-Ya-Ayn-Sad is our sufficiency. Ha-Meem-Ayn-Seen-Qaaf is our protection.`
      },
      {
        id: 'hb_10',
        title: '10. Divine Sufficiency, Throne Armor & Concluding Praises',
        arabic: `فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ (ثلاثًا) * سِتْرُ الْعَرْشِ مَسْبُولٌ عَلَيْنَا * وَعَيْنُ اللَّهِ نَاظِرَةٌ إِلَيْنَا * بِحَوْلِ اللَّهِ لَا يُقْدَرُ عَلَيْنَا (ثلاثًا) * وَاللَّهُ مِنْ وَرَائِهِمْ مُحِهِيطٌ * بَلْ هُوَ قُرْآنٌ مَجِيدٌ * فِي لَوْحٍ مَحْفُوظٍ * فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ (ثلاثًا) * إِنَّ وَلِيِّيَ اللَّهُ الَّذِي نَزَّلَ الْكِتَابَ وَهُوَ يَتَوَلَّى الصَّالِحِينَ (ثلاثًا) * حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ (ثلاثًا) * بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (ثلاثًا) * أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (ثلاثًا) * وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ (ثلاثًا) * وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَصَحْبِهِ وَسَلَّمَ * سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ * وَسَلَامٌ عَلَى الْمُرْسَلِينَ * وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ`,
        transliteration: `Fa-sayakfīkahumullāhu wa huwas-samī'ul-'alīm (x3). Sitrul-'arshi masbūlun 'alaynā, wa 'aynullāhi nāḍiratun ilaynā, bi-ḥawlillāhi lā yuqdaru 'alaynā (x3). Wallāhu miw-warā'ihim muḥīṭ, bal huwa qur'ānum-majīd fī lawḥim-maḥfūẓ. Fallāhu khayrun ḥāfiḍaw-wa huwa arḥamur-rāḥimīn (x3). Inna waliyyiyallāhul-ladhī nazzalal-kitāba wa huwa yatawallas-ṣāliḥīn (x3). Ḥasbiyallāhu lā ilāha illā huwa 'alayhi tawakkaltu wa huwa rabbul-'arshil-'aẓīm (x3). Bismillāhil-ladhī lā yaḍurru ma'asmihī shay'un fil-arḍi wa lā fis-samā'i wa huwas-samī'ul-'alīm (x3). A'ūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq (x3). Wa lā ḥawla wa lā quwwata illā billāhil-'aliyyil-'aẓīm (x3). Wa ṣallallāhu 'alā sayyidinā Muḥammadin wa 'alā ālihi wa ṣaḥbihi wa sallam. Subḥāna rabbika rabbil-'izzati 'ammā yaṣifūn, wa salāmun 'alal-mursalīn, wal-ḥamdu lillāhi rabbil-'ālamīn.`,
        translation: `So Allah will sufficient you against them, and He is the All-Hearing, the All-Knowing (x3). The veil of the Throne is drawn over us, and the Eye of Allah is gazing upon us. By the power of Allah, no one can overpower us (x3). 'And Allah encompasses them from behind. Indeed, it is a glorious Quran, in a preserved tablet.' And Allah is the best of Guardians, and He is the Most Merciful of those who show mercy (x3). 'Verily, my protector is Allah, who has revealed the Book, and He protects the righteous' (x3). 'Sufficient for me is Allah; there is no deity except Him. Upon Him I trust, and He is the Lord of the Great Throne' (x3). In the Name of Allah, with whose Name nothing can cause harm on earth nor in heaven, and He is the All-Hearing, the All-Knowing (x3). I seek refuge in the perfect words of Allah from the evil of what He created (x3). There is no power nor strength except through Allah, the Most High, the Supreme (x3). And may Allah bless our Master Muhammad, and his Family and Companions, and grant them peace. Glory be to your Lord, the Lord of Might, above what they describe. And peace be upon the messengers. And praise be to Allah, Lord of the worlds.`
      }
    ],
    count: 1,
    reference: "Imam Shadhili",
    note: "Imam Shadhili said of this litany: 'By Allah, I did not utter it except as it was revealed to me by the Prophet ﷺ.' It is recited for protection, safety on journeys, and easing of major obstacles."
  }
];

export const asmaUlHusna: DhikrItem[] = [
  { id: '1', title: 'Allah (الله)', arabic: 'الله', translation: "The Greatest Name" },
  { id: '2', title: 'Ar-Rahman (الرَّحْمَنُ)', arabic: 'الرَّحْمَنُ', translation: "The Entirely Merciful" },
  { id: '3', title: 'Ar-Rahim (الرَّحِيمُ)', arabic: 'الرَّحِيمُ', translation: "The Especially Merciful" },
  { id: '4', title: 'Al-Malik (الْمَلِكُ)', arabic: 'الْمَلِكُ', translation: "The King" },
  { id: '5', title: 'Al-Quddus (الْقُدُّوسُ)', arabic: 'الْقُدُّوسُ', translation: "The Absolutely Pure" },
  { id: '6', title: 'As-Salam (السَّلاَمُ)', arabic: 'السَّلاَمُ', translation: "The Source of Peace" },
  { id: '7', title: 'Al-Mu\'min (الْمُؤْمِنُ)', arabic: 'الْمُؤْمِنُ', translation: "The Granter of Security" },
  { id: '8', title: 'Al-Muhaymin (الْمُهَيْمِنُ)', arabic: 'الْمُهَيْمِنُ', translation: "The Guardian, The Witness" },
  { id: '9', title: 'Al-Aziz (الْعَزِيزُ)', arabic: 'الْعَزِيزُ', translation: "The Almighty" },
  { id: '10', title: 'Al-Jabbar (الْجَبَّارُ)', arabic: 'الْجَبَّارُ', translation: "The Compeller" },
  { id: '11', title: 'Al-Mutakabbir (الْمُتَكَبِّرُ)', arabic: 'الْمُتَكَبِّرُ', translation: "The Supreme, The Majestic" },
  { id: '12', title: 'Al-Khaliq (الْخَالِقُ)', arabic: 'الْخَالِقُ', translation: "The Creator" },
  { id: '13', title: 'Al-Bari\' (الْبَارِئُ)', arabic: 'الْبَارِئُ', translation: "The Evolver" },
  { id: '14', title: 'Al-Musawwir (الْمُصَوِّرُ)', arabic: 'الْمُصَوِّرُ', translation: "The Fashioner" },
  { id: '15', title: 'Al-Ghaffar (الْغَفَّارُ)', arabic: 'الْغَفَّارُ', translation: "The Repeatedly Forgiving" },
  { id: '16', title: 'Al-Qahhar (الْقَهَّارُ)', arabic: 'الْقَهَّارُ', translation: "The Subduer" },
  { id: '17', title: 'Al-Wahhab (الْوَهَّابُ)', arabic: 'الْوَهَّابُ', translation: "The Bestower" },
  { id: '18', title: 'Ar-Razzaq (الرَّزَّاقُ)', arabic: 'الرَّزَّاقُ', translation: "The Provider" },
  { id: '19', title: 'Al-Fattah (الْفَتَّاحُ)', arabic: 'الْفَتَّاحُ', translation: "The Opener" },
  { id: '20', title: 'Al-\'Alim (الْعَلِيمُ)', arabic: 'الْعَلِيمُ', translation: "The All-Knowing" },
  { id: '21', title: 'Al-Qabid (الْقَابِضُ)', arabic: 'الْقَابِضُ', translation: "The Withholder" },
  { id: '22', title: 'Al-Basit (الْبَاسِطُ)', arabic: 'الْبَاسِطُ', translation: "The Expander" },
  { id: '23', title: 'Al-Khafid (الْخَافِضُ)', arabic: 'الْخَافِضُ', translation: "The Abaser" },
  { id: '24', title: 'Ar-Rafi\' (الرَّافِعُ)', arabic: 'الرَّافِعُ', translation: "The Exalter" },
  { id: '25', title: 'Al-Mu\'izz (الْمُعِزُّ)', arabic: 'الْمُعِزُّ', translation: "The Giver of Honour" },
  { id: '26', title: 'Al-Mudhill (الْمُذِلُّ)', arabic: 'الْمُذِلُّ', translation: "The Giver of Dishonour" },
  { id: '27', title: 'As-Sami\' (السَّمِيعُ)', arabic: 'السَّمِيعُ', translation: "The All-Hearing" },
  { id: '28', title: 'Al-Basir (الْبَصِيرُ)', arabic: 'الْبَصِيرُ', translation: "The All-Seeing" },
  { id: '29', title: 'Al-Hakam (الْحَكَمُ)', arabic: 'الْحَكَمُ', translation: "The Judge" },
  { id: '30', title: 'Al-\'Adl (الْعَدْلُ)', arabic: 'الْعَدْلُ', translation: "The Just" },
  { id: '31', title: 'Al-Latif (اللَّطِيفُ)', arabic: 'اللَّطِيفُ', translation: "The Subtle One" },
  { id: '32', title: 'Al-Khabir (الْخَبِيرُ)', arabic: 'الْخَبِيرُ', translation: "The All-Aware" },
  { id: '33', title: 'Al-Halim (الْحَلِيمُ)', arabic: 'الْحَلِيمُ', translation: "The Forbearing" },
  { id: '34', title: 'Al-\'Azim (الْعَظِيمُ)', arabic: 'الْعَظِيمُ', translation: "The Magnificent" },
  { id: '35', title: 'Al-Ghafur (الْغَفُورُ)', arabic: 'الْغَفُورُ', translation: "The Forgiving" },
  { id: '36', title: 'Ash-Shakur (الشَّكُورُ)', arabic: 'الشَّكُورُ', translation: "The Appreciative" },
  { id: '37', title: 'Al-\'Ali (الْعَلِيُّ)', arabic: 'الْعَلِيُّ', translation: "The Most High" },
  { id: '38', title: 'Al-Kabir (الْكَبِيرُ)', arabic: 'الْكَبِيرُ', translation: "The Most Great" },
  { id: '39', title: 'Al-Hafiz (الْحَفِيظُ)', arabic: 'الْحَفِيظُ', translation: "The Preserver" },
  { id: '40', title: 'Al-Muqit (الْمُقِيتُ)', arabic: 'الْمُقِيتُ', translation: "The Maintainer" },
  { id: '41', title: 'Al-Hasib (الْحَسِيبُ)', arabic: 'الْحَسِيبُ', translation: "The Reckoner" },
  { id: '42', title: 'Al-Jalil (الْجَلِيلُ)', arabic: 'الْجَلِيلُ', translation: "The Majestic" },
  { id: '43', title: 'Al-Karim (الْكَرِيمُ)', arabic: 'الْكَرِيمُ', translation: "The Generous" },
  { id: '44', title: 'Ar-Raqib (الرَّقِيبُ)', arabic: 'الرَّقِيبُ', translation: "The Watchful" },
  { id: '45', title: 'Al-Mujib (الْمُجِيبُ)', arabic: 'الْمُجِيبُ', translation: "The Responsive" },
  { id: '46', title: 'Al-Wasi\' (الْوَاسِعُ)', arabic: 'الْوَاسِعُ', translation: "The All-Encompassing" },
  { id: '47', title: 'Al-Hakim (الْحَكِيمُ)', arabic: 'الْحَكِيمُ', translation: "The Wise" },
  { id: '48', title: 'Al-Wadud (الْوَدُودُ)', arabic: 'الْوَدُودُ', translation: "The Loving" },
  { id: '49', title: 'Al-Majid (الْمَجِيدُ)', arabic: 'الْمَجِيدُ', translation: "The Glorious" },
  { id: '50', title: 'Al-Ba\'ith (الْبَاعِثُ)', arabic: 'الْبَاعِثُ', translation: "The Resurrector" },
  { id: '51', title: 'Ash-Shahid (الشَّهِيدُ)', arabic: 'الشَّهِيدُ', translation: "The Witness" },
  { id: '52', title: 'Al-Haqq (الْحَقُّ)', arabic: 'الْحَقُّ', translation: "The Truth" },
  { id: '53', title: 'Al-Wakil (الْوَكِيلُ)', arabic: 'الْوَكِيلُ', translation: "The Trustee" },
  { id: '54', title: 'Al-Qawiyy (الْقَوِيُّ)', arabic: 'الْقَوِيُّ', translation: "The Strong" },
  { id: '55', title: 'Al-Matin (الْمَتِينُ)', arabic: 'الْمَتِينُ', translation: "The Firm" },
  { id: '56', title: 'Al-Wali (الْوَلِيُّ)', arabic: 'الْوَلِيُّ', translation: "The Protecting Friend" },
  { id: '57', title: 'Al-Hamid (الْحَمِيدُ)', arabic: 'الْحَمِيدُ', translation: "The Praiseworthy" },
  { id: '58', title: 'Al-Muhsi (الْمُحْصِي)', arabic: 'الْمُحْصِي', translation: "The Counter" },
  { id: '59', title: 'Al-Mubdi\' (الْمُبْدِئُ)', arabic: 'الْمُبْدِئُ', translation: "The Originator" },
  { id: '60', title: 'Al-Mu\'id (الْمُعِيدُ)', arabic: 'الْمُعِيدُ', translation: "The Restorer" },
  { id: '61', title: 'Al-Muhyi (الْمُحْيِي)', arabic: 'الْمُحْيِي', translation: "The Giver of Life" },
  { id: '62', title: 'Al-Mumit (الْمُمِيتُ)', arabic: 'الْمُمِيتُ', translation: "The Taker of Life" },
  { id: '63', title: 'Al-Hayy (الْحَيُّ)', arabic: 'الْحَيُّ', translation: "The Ever Living" },
  { id: '64', title: 'Al-Qayyum (الْقَيُّومُ)', arabic: 'الْقَيُّومُ', translation: "The Self-Subsisting" },
  { id: '65', title: 'Al-Wajid (الْوَاجِدُ)', arabic: 'الْوَاجِدُ', translation: "The Finder" },
  { id: '66', title: 'Al-Majid (الْمَاجِدُ)', arabic: 'الْمَاجِدُ', translation: "The Noble" },
  { id: '67', title: 'Al-Wahid (الْوَاحِدُ)', arabic: 'الْوَاحِدُ', translation: "The One" },
  { id: '68', title: 'As-Samad (الصَّمَدُ)', arabic: 'الصَّمَدُ', translation: "The Eternal" },
  { id: '69', title: 'Al-Qadir (الْقَادِرُ)', arabic: 'الْقَادِرُ', translation: "The Able" },
  { id: '70', title: 'Al-Muqtadir (الْمُقْتَدِرُ)', arabic: 'الْمُقْتَدِرُ', translation: "The Powerful" },
  { id: '71', title: 'Al-Muqaddim (الْمُقَدِّمُ)', arabic: 'الْمُقَدِّمُ', translation: "The Expediter" },
  { id: '72', title: 'Al-Mu\'akhkhir (الْمُؤَخِّرُ)', arabic: 'الْمُؤَخِّرُ', translation: "The Delayer" },
  { id: '73', title: 'Al-Awwal (الْأَوَّلُ)', arabic: 'الْأَوَّلُ', translation: "The First" },
  { id: '74', title: 'Al-Akhir (الْآخِرُ)', arabic: 'الْآخِرُ', translation: "The Last" },
  { id: '75', title: 'Az-Zahir (الظَّاهِرُ)', arabic: 'الظَّاهِرُ', translation: "The Manifest" },
  { id: '76', title: 'Al-Batin (الْبَاطِنُ)', arabic: 'الْبَاطِنُ', translation: "The Hidden" },
  { id: '77', title: 'Al-Wali (الْوَالِي)', arabic: 'الْوَالِي', translation: "The Governor" },
  { id: '78', title: 'Al-Muta\'ali (الْمُتَعَالِي)', arabic: 'الْمُتَعَالِي', translation: "The Most Exalted" },
  { id: '79', title: 'Al-Barr (الْبَرُّ)', arabic: 'الْبَرُّ', translation: "The Source of Goodness" },
  { id: '80', title: 'At-Tawwab (التَّوَّابُ)', arabic: 'التَّوَّابُ', translation: "The Acceptor of Repentance" },
  { id: '81', title: 'Al-Muntaqim (الْمُنْتَقِمُ)', arabic: 'الْمُنْتَقِمُ', translation: "The Avenger" },
  { id: '82', title: 'Al-\'Afuww (الْعَفُوُّ)', arabic: 'الْعَفُوُّ', translation: "The Pardoner" },
  { id: '83', title: 'Ar-Ra\'uf (الرَّؤُوفُ)', arabic: 'الرَّؤُوفُ', translation: "The Compassionate" },
  { id: '84', title: 'Malik-ul-Mulk (مَالِكُ الْمُلْكِ)', arabic: 'مَالِكُ الْمُلْكِ', translation: "The Master of Sovereignty" },
  { id: '85', title: 'Dhul-Jalali wal-Ikram (ذُو الْجَلاَلِ وَالْإِكْرَامِ)', arabic: 'ذُو الْجَلاَلِ وَالْإِكْرَامِ', translation: "The Lord of Majesty and Generosity" },
  { id: '86', title: 'Al-Muqsit (الْمُقْسِطُ)', arabic: 'الْمُقْسِطُ', translation: "The Equitable" },
  { id: '87', title: 'Al-Jami\' (الْجَامِعُ)', arabic: 'الْجَامِعُ', translation: "The Gatherer" },
  { id: '88', title: 'Al-Ghani (الْغَنِيُّ)', arabic: 'الْغَنِيُّ', translation: "The Self-Sufficient" },
  { id: '89', title: 'Al-Mughni (الْمُغْنِي)', arabic: 'الْمُغْنِي', translation: "The Enricher" },
  { id: '90', title: 'Al-Mani\' (الْمَانِعُ)', arabic: 'الْمَانِعُ', translation: "The Withholder" },
  { id: '91', title: 'Ad-Darr (الضَّارُّ)', arabic: 'الضَّارُّ', translation: "The Distresser" },
  { id: '92', title: 'An-Nafi\' (النَّافِعُ)', arabic: 'النَّافِعُ', translation: "The Propitious" },
  { id: '93', title: 'An-Nur (النُّورُ)', arabic: 'النُّورُ', translation: "The Light" },
  { id: '94', title: 'Al-Hadi (الْهَادِي)', arabic: 'الْهَادِي', translation: "The Guide" },
  { id: '95', title: 'Al-Badi\' (الْبَدِيعُ)', arabic: 'الْبَدِيعُ', translation: "The Incomparable" },
  { id: '96', title: 'Al-Baqi (الْبَاقِي)', arabic: 'الْبَاقِي', translation: "The Everlasting" },
  { id: '97', title: 'Al-Warith (الْوَارِثُ)', arabic: 'الْوَارِثُ', translation: "The Inheritor" },
  { id: '98', title: 'Ar-Rashid (الرَّشِيدُ)', arabic: 'الرَّشِيدُ', translation: "The Guide to the Right Path" },
  { id: '99', title: 'As-Sabur (الصَّبُورُ)', arabic: 'الصَّبُورُ', translation: "The Patient" }
];

const AzkarModal: React.FC<AzkarModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('daily');
  const [timeMode, setTimeMode] = useState<TimeMode>('morning');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [azkarCurrentTime, setAzkarCurrentTime] = useState<number>(0);
  const [azkarDuration, setAzkarDuration] = useState<number>(0);
  const [azkarVolume, setAzkarVolume] = useState<number>(0.85);
  const [azkarIsMuted, setAzkarIsMuted] = useState<boolean>(false);
  const [azkarSpeed, setAzkarSpeed] = useState<number>(1);
  const [isAzkarLoading, setIsAzkarLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const hour = new Date().getHours();
      setTimeMode(hour >= 4 && hour < 16 ? 'morning' : 'evening');
    }
    
    return () => {
      // Cleanup audio on close
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

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
        audioRef.current.currentTime = 0; // Ensure previous audio stops completely
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

  const getCategoryData = () => {
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

  const categories: { id: Category; label: string; icon: React.ElementType }[] = [
    { id: 'daily', label: 'Daily Adhkar', icon: Sun },
    { id: 'supplications', label: 'Supplications', icon: Heart },
    { id: 'wird', label: 'Wird', icon: Hash },
    { id: 'istighfar', label: 'Istighfar', icon: Sparkles },
    { id: 'hizb', label: 'Hizb', icon: Shield },
    { id: 'names', label: '99 Names', icon: List },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-[#fdfbf7] w-full sm:max-w-4xl h-full sm:h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 bg-white">
          <div className="flex items-center gap-3">
             <Book className="text-primary-600" />
             <h3 className="text-xl font-bold font-serif text-slate-900">Adhkar & Supplications</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Categories - Top Horizontal Scroll */}
        <div className="bg-slate-50 border-b border-secondary-200 overflow-x-auto scrollbar-hide">
           <div className="flex p-3 gap-2 min-w-max">
             {categories.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                   ${activeCategory === cat.id ? 'bg-white text-primary-800 shadow-sm ring-1 ring-primary-200' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
               >
                 <cat.icon size={18} className={activeCategory === cat.id ? 'text-primary-600' : 'text-slate-400'} />
                 <span>{cat.label}</span>
               </button>
             ))}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#fdfbf7] scroll-smooth p-4 sm:p-8">
             
             {/* Time Toggle for Daily Adhkar */}
             {activeCategory === 'daily' && (
               <div className="flex justify-center mb-8">
                 <div className="bg-slate-200 p-1 rounded-full flex relative">
                    <button
                      onClick={() => setTimeMode('morning')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all z-10 ${timeMode === 'morning' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Sun size={16} /> Morning
                    </button>
                    <button
                      onClick={() => setTimeMode('evening')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all z-10 ${timeMode === 'evening' ? 'bg-slate-800 text-blue-200 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Moon size={16} /> Evening
                    </button>
                 </div>
               </div>
             )}

             <div 
               className={activeCategory === 'names' ? "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4" : "space-y-6 max-w-3xl mx-auto"}
               dir={activeCategory === 'names' ? "rtl" : "ltr"}
             >
                {getCategoryData().map((item) => {
                   // Specialized Grid Layout for 99 Names
                   if (activeCategory === 'names') {
                     // Extract English name from title "Name (Arabic)" -> "Name"
                     const englishName = item.title.split('(')[0].trim();
                     return (
                       <div key={item.id} dir="ltr" className="bg-white border border-secondary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center group h-full relative overflow-hidden">
                          <span className="text-xs font-mono text-secondary-400 mb-2 border border-secondary-100 px-2 py-0.5 rounded-full bg-secondary-50">{item.id}</span>
                          <p className="font-arabic text-3xl mb-2 text-primary-700 group-hover:scale-110 transition-transform duration-300">{item.arabic}</p>
                          <h4 className="font-bold text-slate-800 text-sm">{englishName}</h4>
                          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 line-clamp-2">{item.translation}</p>
                       </div>
                     );
                   }

                   // Standard List Layout for other categories
                   const arabicText = (activeCategory === 'daily' && timeMode === 'evening' && item.arabicEvening) 
                      ? item.arabicEvening 
                      : item.arabic;
                   const translationText = (activeCategory === 'daily' && timeMode === 'evening' && item.translationEvening)
                      ? item.translationEvening
                      : item.translation;

                   return (
                     <div key={item.id} className="bg-white border border-secondary-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4 border-b border-dashed border-secondary-100 pb-3">
                           <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="font-bold text-slate-800 text-sm sm:text-base">{item.title}</h4>
                              {item.audio && (
                                <button
                                  onClick={() => toggleAudio(item.id, item.audio)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                                    ${activeAudioId === item.id && isPlaying 
                                      ? 'bg-primary-600 text-white shadow-md ring-2 ring-primary-200 ring-offset-1' 
                                      : 'bg-primary-50 text-primary-700 border border-primary-100 hover:bg-primary-100 hover:shadow-sm'}`}
                                >
                                  {activeAudioId === item.id && isPlaying ? (
                                    <>
                                      <Pause size={12} className="fill-current" />
                                      <span>Pause</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play size={12} className="fill-current" />
                                      <span>Play Audio</span>
                                    </>
                                  )}
                                </button>
                              )}
                           </div>
                           <div className="flex items-center gap-2">
                             {item.count && (
                               <span className="text-xs font-mono bg-secondary-100 text-secondary-700 px-2 py-1 rounded-md border border-secondary-200">
                                 {item.count}x
                               </span>
                             )}
                             {item.reference && <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.reference}</span>}
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
                            {item.sections.map((sec, secIdx) => (
                              <div key={sec.id || secIdx} className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-secondary-200/70 shadow-xs space-y-4">
                                {sec.title && (
                                  <div className="flex items-center justify-between gap-2 border-b border-secondary-100/70 pb-2.5">
                                    <span className="text-xs font-bold text-primary-900 dark:text-primary-300 font-sans tracking-wide">
                                      {sec.title}
                                    </span>
                                    {sec.count && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                        {sec.count}
                                      </span>
                                    )}
                                  </div>
                                )}
                                
                                {/* Arabic Text */}
                                <div className="space-y-2" dir="rtl">
                                  {sec.arabic.split('\n').map((line, lineIdx) => {
                                    const trimmed = line.trim();
                                    const isBasmala = trimmed === 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ';
                                    return (
                                      <p 
                                        key={lineIdx} 
                                        className={`font-arabic text-xl sm:text-2xl !leading-[2.8] text-slate-900 ${
                                          isBasmala ? 'text-center font-semibold pb-1.5 border-b border-dashed border-secondary-100/50' : 'text-right'
                                        }`}
                                      >
                                        {line}
                                      </p>
                                    );
                                  })}
                                </div>

                                {/* Transliteration & Translation */}
                                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                  {sec.transliteration && (
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic font-serif leading-relaxed" dir="ltr">
                                      {sec.transliteration}
                                    </p>
                                  )}
                                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans" dir="ltr">
                                    {sec.translation}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3 mb-6" dir="rtl">
                              {arabicText.split('\n').map((line, idx) => {
                                const trimmed = line.trim();
                                const isBasmala = trimmed === 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ';
                                return (
                                  <p 
                                    key={idx} 
                                    className={`font-arabic text-2xl sm:text-3xl !leading-[3.75] text-slate-900 ${
                                      isBasmala ? 'text-center font-semibold pb-2 border-b border-dashed border-secondary-100/50' : 'text-right'
                                    }`}
                                  >
                                    {line}
                                  </p>
                                );
                              })}
                            </div>

                            <div className="space-y-2">
                               {item.transliteration && (
                                 <p className="text-sm text-slate-500 italic mb-2">{item.transliteration}</p>
                               )}
                               <p className="text-slate-700 text-sm leading-relaxed">{translationText}</p>
                            </div>
                          </>
                        )}

                        {item.note && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                             <strong>Note:</strong> {item.note}
                          </div>
                        )}
                     </div>
                   );
                })}
             </div>
             
             <div className="h-20"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};

export default AzkarModal;