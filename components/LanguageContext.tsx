import React, { createContext, useContext, useState, useEffect } from 'react';
import { SurahEntry, Theme, surahTableData, alKahfThemes, alKahfBenefits } from '../data';

export type Language = 'en' | 'ar' | 'am' | 'har';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getTranslatedSurahs: () => SurahEntry[];
  getTranslatedThemes: () => Theme[];
  getTranslatedBenefits: () => { title: string; content: string }[];
  showDuaTransliteration: boolean;
  setShowDuaTransliteration: (show: boolean) => void;
  showDuaTranslation: boolean;
  setShowDuaTranslation: (show: boolean) => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Sidebar
    'nav.title': 'An-Noor Quran Companion',
    'nav.alkahf': 'Surah Al-Kahf',
    'nav.table': 'Recommended Surahs',
    'nav.other': 'Other Prayers',
    'nav.dua': 'Dua & Supplication',
    'nav.azkar': 'Daily Azkar',
    'nav.bookmarks': 'My Bookmarks',
    'nav.journal': 'Reflection Journal',
    'nav.tajweed': 'Tajweed Rules',
    'nav.quran': '30 Juz Quran',
    'nav.qibla': 'Google Maps & Qibla',
    'nav.features': 'Features & Guide',
    'nav.khatam': 'Khatam-ul-Quran',
    'nav.salat_recitations': 'Salat Recitations Guide',
    'nav.focus': 'Focus Mode',
    'nav.night': 'Night Mode',
    'nav.size': 'Arabic Font Size',
    'nav.exitFocus': 'Exit Focus Mode',
    'nav.config': 'Config',
    
    // Sidebar explanations
    'side.salatRecitationsDesc': 'Complete guide of what to recite in every position of Salat in Arabic with translation',
    'side.nightDesc': 'Switches to an eye-friendly dark slate theme for late-night or dawn recitations.',
    'side.focusDesc': 'Hides menus, footers, and other side panels for an immersive distraction-free reading experience.',
    'side.fontDesc': 'Adjust the scale of the beautiful Arabic script for perfect readability.',
    'side.alkahfDesc': 'The main Friday recitation',
    'side.tableDesc': 'Curated Friday & daily Sunnah Surahs',
    'side.otherDesc': 'Night protections & specific times',
    'side.duaDesc': 'Friday Adhkar, Stress & Overwhelm Duas, and Tahajjud',
    'side.azkarDesc': 'Daily morning & evening protections',
    'side.bookmarksDesc': 'Saved verses and Ayats',
    'side.journalDesc': 'Save personal notes and spiritual reflections on Surahs',
    'side.tajweedDesc': 'Interactive recitation rules & examples',
    'side.quranDesc': 'Full 30 Juz reading and streaming recitation',
    'side.qiblaDesc': 'Interactive Google Maps with Geodesic Qibla flight line to Mecca',
    'side.featuresDesc': 'Explore the comprehensive feature list and export a Word Document.',
    'side.khatamDesc': 'Beautiful Dua for completing the Quran with translation and audio recitation',
    
    // Hero & Headers
    'hero.title': 'Recommended Surahs for Friday',
    'hero.desc': 'A guide to the blessed recitations of Jumu\'ah, focusing on Surah Al-Kahf and other prophetic traditions to illuminate your week.',
    'table.title': 'Recommended Surahs',
    'table.desc': 'A comprehensive, interactive list including nightly protections and specific prayer recitations. Click on any surah row to read its full text and stream recitations.',
    'search.placeholder': 'Search by Surah name or chapter...',
    'search.quickSearch': 'Global Search',
    'search.globalPlaceholder': 'Search Surahs, Duas, Azkar topics, guides...',
    'search.noResults': 'No matching results found',
    'table.col.surah': 'Surah',
    'table.col.time': 'Recommended Time',
    'table.col.level': 'Sunnah Level',
    'table.col.actions': 'Recitation',
    'table.filter.all': 'All Recitations',
    'table.filter.sunnah': 'Sunnah Only',
    'table.filter.quran': 'Quran Texts',
    'table.filter.bookmarks': 'Bookmarked',
    
    // Al Kahf Section
    'kahf.mainRec': 'The Main Recommendation: Surah Al-Kahf',
    'kahf.desc': 'Prophet Muhammad (peace be upon him) encouraged the recitation of Surah Al-Kahf on Fridays. It serves as a spiritual anchor for the week.',
    'kahf.listen': 'Listen to Surah Al-Kahf',
    'kahf.reciter': 'Recitation by Mishary Rashid Alafasy • 15:52 mins',
    'kahf.playing': 'Playing in bottom persistent player',
    'kahf.paused': 'Paused in bottom persistent player',
    'kahf.speed': 'Playback Speed:',
    'kahf.themes': 'Key Themes',
    'kahf.clickStory': 'Click on a theme to read the full story.',
    'kahf.benefits': 'Prophetic Benefits',
    
    // Prayer Times Section
    'prayer.title': 'Friday Prayer Times',
    'prayer.desc': 'Stay on schedule for Friday prayers (Jumu\'ah) and trace the blessing of the hour of response.',
    'prayer.location': 'Detecting Location...',
    'prayer.azanSetting': 'Daily Prayer Azan Alert',
    'prayer.azanSettingDesc': 'Play the beautiful Azan call automatically when the prayer time begins.',
    'prayer.selectStyle': 'Select Reciter Style',
    'prayer.makkah': 'Makkah Azan',
    'prayer.madinah': 'Madinah Azan',
    'prayer.playTest': 'Play Test Call',
    'prayer.stopTest': 'Stop Test Call',
    'prayer.azanAlertTitle': 'Al-Mu\'adhin Call',
    'prayer.azanAlertSubtitle': 'Prayer Time Alert',
    'prayer.azanAlertDismiss': 'Dismiss & Stop Azan Call',
    'prayer.dstSetting': 'Daylight Saving Time (DST)',
    'prayer.dstSettingDesc': 'Adjust calculations for summer daytime saving (+1 hr) or standard astronomical time.',
    'prayer.dstAuto': 'Auto (Detect)',
    'prayer.dstOn': 'DST Active (+1 hr)',
    'prayer.dstOff': 'Standard Time (0 hr)',
    'prayer.dstActiveBadge': 'Daylight Saving Active (+1h)',
    'prayer.dstInactiveBadge': 'Standard Time Active (+0h)',
    'prayer.fineTune': 'Mosque Sync / Fine-Tuning',
    
    // Dua & Azkar Section
    'dua.title': 'Dua & Supplication',
    'dua.desc': 'A comprehensive treasury of authentic supplications: blessed Friday prayers, prophetic shields against anxiety and family overwhelm, and the complete guide to the night vigil (Tahajjud).',
    'dua.tab.general': 'Friday Adhkar & Supplications',
    'dua.tab.stress': 'Stress & Overwhelm Duas',
    'dua.tab.tahajjud': 'Tahajjud & Night Prayer',
    'dua.tab.stressDesc': 'The Prophet’s ﷺ refuge from worry, grief, laziness, debt, and overwhelm',
    'dua.tab.tahajjudDesc': 'Step-by-step master guide and last third of the night calculator',
    'dua.subtab.duas': 'Friday Dua & Supplications',
    'dua.subtab.duasDesc': 'Salawat, General Duas & Morning Prayers',
    'dua.subtab.hizb': 'Hizb al-Bahr — حِزْبُ الْبَحْرِ',
    'dua.subtab.hizbDesc': 'Imam Shadhili\'s Protection Litany',
    'dua.subtab.myDuas': 'My Saved Duas',
    'dua.subtab.myDuasDesc': 'Your favorite supplications & custom tags',
    'dua.goldenHour': 'The Golden Hour',
    'dua.goldenHourDesc': 'Prophet Muhammad (peace be upon him) mentioned a specific time on Friday during which no Muslim asks Allah for something except that He gives it to them. Many scholars suggest this is the last hour after Asr prayer before Maghrib.',
    'dua.goldenHourHadith': '"There is an hour (opportune time) on Friday and if a Muslim gets it while praying and asks something from Allah, then Allah will definitely meet his demand."',
    'dua.goldenHourHadithRef': '— Sahih al-Bukhari',
    'dua.salawat': 'Increase Salawat',
    'dua.salawatRef': 'The Prophet (SAW) said: "Increase your supplications for me on Friday, for your supplications are presented to me."',
    'dua.generalDua': 'Best of This World & Hereafter',
    'dua.familyDua': 'Dua for Children & Family',
    'dua.familyDuaRef': 'O our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous. Make me and my descendants establishers of prayer.',
    'dua.khatamTitle': 'Dua for Khatmul Quran',
    'dua.khatamSub': 'Supplication upon Completing the Holy Quran',
    'dua.khatamDesc': 'The celebrated comprehensive prayer recited upon finishing recitation of the Noble Quran for guidance, illumination, forgiveness, and elevated ranks in Paradise.',
    'dua.khatamRef': 'Traditional Khatm Supplication recited in Makkah & Madinah',
    'dua.openFullKhatam': 'Open Full 12-Part Khatmul Quran Experience & Recitations →',
    'dua.morningTitle': 'Morning Supplications — أذكار الصباح',
    'dua.morningDesc': 'Authentic morning prayers from the booklet for security, protection, and peace. Tap the tally counter of each supplication to complete your reading.',
    'dua.resetCounters': 'Reset Counters',
    'dua.goal': 'Goal:',
    'dua.completed': 'Completed',
    'dua.tapToCount': 'Tap circle to count',
    'dua.hizbTitle': 'Hizb al-Bahr — حِزْبُ الْبَحْرِ',
    'dua.hizbDesc': 'The famous spiritual litany of Imam Shadhili for protection, safety, and overcoming obstacles. Use the interactive step-by-step guide or view the full text below.',
    
    // Daily Azkar Section
    'azkar.title': 'Azkar As-Sabah wal Masaa',
    'azkar.badge': 'Daily Protection & Blessings',
    'azkar.desc': 'Verily, in the remembrance of Allah do hearts find rest (Quran 13:28). Tap on each litany\'s checkmark to track your progress, view English translation, or play beautiful audio streams.',
    'azkar.cat.daily': 'Daily Adhkar',
    'azkar.cat.dailyDesc': 'Morning & evening protections',
    'azkar.cat.supplications': 'Supplications',
    'azkar.cat.supplicationsDesc': 'Duas from Quran & Sunnah',
    'azkar.cat.wird': 'Wird',
    'azkar.cat.wirdDesc': 'Frequent short remembrances',
    'azkar.cat.istighfar': 'Istighfar',
    'azkar.cat.istighfarDesc': 'Asking for Divine forgiveness',
    'azkar.cat.hizb': 'Protection Hizb',
    'azkar.cat.hizbDesc': 'Guardianship litanies',
    'azkar.cat.names': 'Asma-ul-Husna',
    'azkar.cat.namesDesc': '99 beautiful Names of Allah',
    'azkar.morning': 'Morning (Sabah)',
    'azkar.evening': 'Evening (Masaa)',
    'azkar.asmaTitle': 'Asma-ul-Husna — دُعَاءُ أَسْمَاءِ اللهِ الْحُسْنَى',
    'azkar.asmaDesc': 'Supplication using all of Allah\'s beautiful Names to lift grief, anxiety, and sorrow',
    'azkar.transliteration': 'Transliteration',
    'azkar.translation': 'Translation',
    'azkar.benefitReward': 'Benefit / Reward:',
    'azkar.endNote': 'End of Azkar Section',
    
    // Bookmarks Section
    'bookmarks.title': 'My Bookmarks',
    'bookmarks.desc': 'Your saved surahs and recitations for easy access during your Jumu\'ah readings. Press the bookmark icon on any Surah to save it here.',
    'bookmarks.empty': 'No Bookmarks Yet',
    'bookmarks.emptyDesc': 'You haven\'t bookmarked any surahs yet. Click the bookmark icon next to any surah in the "Recommended Surahs" section to save it for quick access.',
    'bookmarks.backButton': 'Browse Recommended Surahs',
    
    // Share feature
    'share.button': 'Share App',
    'share.copied': 'Link copied to clipboard!',
    'share.failed': 'Failed to copy or share link.',
    'share.title': 'An-Noor Quran Companion',
    'share.text': 'Discover An-Noor Quran Companion — your digital companion for blessed recitations, interactive Tajweed, Duas, and Azkar.',
  },
  ar: {
    // Navbar & Sidebar
    'nav.title': 'مساعد الأنوار القرآني والتجويد',
    'nav.alkahf': 'سورة الكهف',
    'nav.table': 'كل السور الموصى بها',
    'nav.other': 'أدعية وأعمال أخرى',
    'nav.dua': 'الدعاء والمناجاة',
    'nav.azkar': 'الأذكار اليومية',
    'nav.bookmarks': 'إشاراتي المرجعية',
    'nav.journal': 'دفتر التدبر',
    'nav.tajweed': 'أحكام التجويد',
    'nav.quran': 'القرآن الكريم ٣٠ جزءاً',
    'nav.qibla': 'خرائط جوجل والقبلة',
    'nav.features': 'دليل الميزات والخصائص',
    'nav.khatam': 'ختم القرآن الكريم',
    'nav.salat_recitations': 'أذكار وأدعية الصلاة',
    'nav.focus': 'وضع التركيز',
    'nav.night': 'الوضع الليلي',
    'nav.size': 'حجم الخط العربي',
    'nav.exitFocus': 'الخروج من وضع التركيز',
    'nav.config': 'الإعدادات',
    
    // Sidebar explanations
    'side.salatRecitationsDesc': 'الدليل الكامل لما يقال في كل ركن وموضع من الصلاة بالعربية والترجمة',
    'side.nightDesc': 'التحول إلى سمة داكنة مريحة للعين لتلاوات الليل أو الفجر.',
    'side.focusDesc': 'إخفاء القوائم والتذييلات والألواح الجانبية لتجربة قراءة غامرة وخالية من المشتتات.',
    'side.fontDesc': 'ضبط مقياس الخط العربي الجميل لضمان وضوح وقابلية ممتازة للقراءة.',
    'side.alkahfDesc': 'تلاوة يوم الجمعة الرئيسية ومحاورها القصصية',
    'side.tableDesc': 'جدول مرجعي شامل ومبسط لكل السور المباركة',
    'side.otherDesc': 'أكواد وحصن الحفظ الليلة والتلاوات المخصصة',
    'side.duaDesc': 'أذكار وأدعية الجمعة، تفريج الهم والضيق، وقيام الليل والتهجد',
    'side.azkarDesc': 'أوراد وحصن الصباح والمساء واليقظة والنوم التفاعلية',
    'side.bookmarksDesc': 'سورك وآياتك المفضلة والمحفوظة لسرعة الوصول',
    'side.journalDesc': 'احفظ ملاحظاتك الشخصية وتدبراتك الإيمانية للسور والآيات',
    'side.tajweedDesc': 'دليل تفاعلي ميسر لأحكام التجويد مع الأمثلة',
    'side.quranDesc': 'قراءة واستماع القرآن الكريم كاملاً ٣٠ جزءاً مع التراجم',
    'side.qiblaDesc': 'خريطة جوجل التفاعلية لتحديد اتجاه القبلة والمسار الكروي المباشر إلى مكة',
    'side.featuresDesc': 'اكتشف قائمة الميزات الكاملة وقم بتصدير مستند Word.',
    'side.khatamDesc': 'دعاء ختم القرآن الكريم المبارك بالتلاوة والترجمة',
    
    // Hero & Headers
    'hero.title': 'السور الموصى بها يوم الجمعة',
    'hero.desc': 'دليل لتلاوات يوم الجمعة المباركة، مع التركيز على سورة الكهف والسنن النبوية الأخرى لتنوير أسبوعك.',
    'table.title': 'كل السور الموصى بها',
    'table.desc': 'قائمة شاملة وتفاعلية تشمل الأذكار الواقية ليلاً وتلاوات الصلوات الخاصة. انقر على أي سورة لقراءة نصها والاستماع لتلاوتها.',
    'search.placeholder': 'ابحث باسم السورة أو الجزء...',
    'table.col.surah': 'السورة',
    'table.col.time': 'الوقت المستحب',
    'table.col.level': 'مرتبة السنّة',
    'table.col.actions': 'التلاوة والاستماع',
    'table.filter.all': 'كل التلاوات',
    'table.filter.sunnah': 'السنن المؤكدة فقط',
    'table.filter.quran': 'نصوص القرآن الكريم',
    'table.filter.bookmarks': 'المفضلة والمحفوظة',
    
    // Al Kahf Section
    'kahf.mainRec': 'التوصية الرئيسية: سورة الكهف',
    'kahf.desc': 'حث النبي محمد صلى الله عليه وسلم على قراءة سورة الكهف يوم الجمعة. إنها بمثابة مرساة روحية تنير لك الأسبوع.',
    'kahf.listen': 'الاستماع إلى سورة الكهف',
    'kahf.reciter': 'بصوت الشيخ مشاري راشد العفاسي • 15:52 دقيقة',
    'kahf.playing': 'يتم التشغيل الآن في المشغل السفلي المستمر',
    'kahf.paused': 'موقوف مؤقتاً في المشغل السفلي',
    'kahf.speed': 'سرعة التشغيل:',
    'kahf.themes': 'قصص ومحاور السورة الرئيسية',
    'kahf.clickStory': 'انقر على المحور لقراءة القصة والعبيرة المستفادة منها كاملة.',
    'kahf.benefits': 'الفضائل النبوية الواردة',
    
    // Prayer Times Section
    'prayer.title': 'مواقيت صلاة الجمعة',
    'prayer.desc': 'تابع مواقيت الصلاة ليوم الجمعة المبارك واغتنم بركة ساعة الاستجابة في هذا اليوم العظيم.',
    'prayer.location': 'جاري تحديد الموقع الحالي...',
    'prayer.azanSetting': 'تنبيه أذان الصلوات اليومية',
    'prayer.azanSettingDesc': 'تشغيل صوت الأذان الجميل تلقائياً عند دخول وقت كل صلاة.',
    'prayer.selectStyle': 'اختر صوت المؤذن',
    'prayer.makkah': 'أذان مكة المكرمة',
    'prayer.madinah': 'أذان المدينة المنورة',
    'prayer.playTest': 'تشغيل تجريبي',
    'prayer.stopTest': 'إيقاف التجريب',
    'prayer.azanAlertTitle': 'صوت المؤذن',
    'prayer.azanAlertSubtitle': 'تنبيه دخول وقت الصلاة',
    'prayer.azanAlertAyah': '"إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَاباً مَّوْقُوتاً"',
    'prayer.azanAlertDismiss': 'إيقاف وإغلاق صوت الأذان',
    'prayer.dstSetting': 'التوقيت الصيفي (DST)',
    'prayer.dstSettingDesc': 'تعديل الحسابات للتوقيت الصيفي (+١ ساعة) أو التوقيت القياسي الشتوي الفلكي.',
    'prayer.dstAuto': 'تلقائي (حسب المنطقة)',
    'prayer.dstOn': 'التوقيت الصيفي (+١ ساعة)',
    'prayer.dstOff': 'التوقيت القياسي (بدون زيادة)',
    'prayer.dstActiveBadge': 'التوقيت الصيفي مفعّل (+١ ساعة)',
    'prayer.dstInactiveBadge': 'التوقيت القياسي الشتوي (+٠ ساعة)',
    'prayer.fineTune': 'المعايرة الدقيقة للمسجد المحلي',
    
    // Dua & Azkar Section
    'dua.title': 'الدعاء والمناجاة',
    'dua.desc': 'خزانة شاملة من الأدعية النبوية والمأثورة: أذكار وأدعية يوم الجمعة، الحصن النبوي لتفريج الهم والضيق الأسري، والدليل العملي لقيام الليل والتهجد.',
    'dua.tab.general': 'أذكار وأدعية يوم الجمعة',
    'dua.tab.stress': 'أدعية تفريج الهم والضيق',
    'dua.tab.tahajjud': 'قيام الليل والتهجد',
    'dua.tab.stressDesc': 'الحصن النبوي الأعظم من الهم والحزن والعجز والكسل والدين وغلبة الرجال',
    'dua.tab.tahajjudDesc': 'الدليل التطبيقي الشامل لقيام الليل مع حاسبة ثلث الليل الأخير',
    'dua.subtab.duas': 'أدعية وأذكار يوم الجمعة',
    'dua.subtab.duasDesc': 'الصلاة على النبي، الأدعية العامة، وأذكار الصباح والمساء',
    'dua.subtab.hizb': 'حزب البحر — للإمام الشاذلي',
    'dua.subtab.hizbDesc': 'ورد الحماية والتحصين والأمان الروحي',
    'dua.subtab.myDuas': 'أدعيتي المحفوظة',
    'dua.subtab.myDuasDesc': 'مجموعتك الخاصة من الأدعية مع وسوم مخصصة',
    'dua.goldenHour': 'ساعة الاستجابة المباركة',
    'dua.goldenHourDesc': 'ذكر النبي صلى الله عليه وسلم ساعة في يوم الجمعة لا يوافقها عبد مسلم يسأل الله خيراً إلا أعطاه إياه. ورجح العلماء أنها الساعة الأخيرة بعد العصر وقبيل المغرب.',
    'dua.goldenHourHadith': '«فِيهِ سَاعَةٌ لَا يُوَافِقُهَا عَبْدٌ مُسْلِمٌ، وَهُوَ قَائِمٌ يُصَلِّي، يَسْأَلُ اللَّهَ تَعَالَى شَيْئاً، إِلَّا أَعْطَاهُ إِيَّاهُ»',
    'dua.goldenHourHadithRef': '— صحيح البخاري',
    'dua.salawat': 'الإكثار من الصلاة على النبي',
    'dua.salawatRef': 'قال النبي صلى الله عليه وسلم: «أكثروا الصلاة علي يوم الجمعة وليلة الجمعة، فمن صلى علي صلاة صلى الله عليه بها عشراً»',
    'dua.generalDua': 'جوامع أدعية الدنيا والآخرة',
    'dua.familyDua': 'دعاء للأبناء والأهل والذرية',
    'dua.familyDuaRef': 'ربنا هب لنا من أزواجنا وذرياتنا قرة أعين واجعلنا للمتقين إماماً. رب اجعلني مقيم الصلاة ومن ذريتي ربنا وتقبل دعاء.',
    'dua.khatamTitle': 'دعاء ختم القرآن الكريم',
    'dua.khatamSub': 'الدعاء المبارك المستجاب عند إتمام تلاوة كتاب الله',
    'dua.khatamDesc': 'الدعاء الجامع المأثور عند ختم القرآن الكريم لطلب الرحمة والنور والهداية ورفعة الدرجات في جنات النعيم.',
    'dua.khatamRef': 'دعاء ختم القرآن المأثور المتلو في الحرمين الشريفين',
    'dua.openFullKhatam': 'فتح تجربة ختم القرآن الكاملة (١٢ مقطعاً) مع كبار القراء ←',
    'dua.morningTitle': 'أذكار الصباح التفاعلية',
    'dua.morningDesc': 'أذكار الصباح المأثورة للتحصين والسلامة والتوفيق. اضغط على العداد لإتمام تلاوة كل ذكر.',
    'dua.resetCounters': 'إعادة ضبط العدادات',
    'dua.goal': 'الهدف:',
    'dua.completed': 'مكتمل بحمد الله',
    'dua.tapToCount': 'اضغط على الدائرة للمتابعة والتكرار',
    'dua.hizbTitle': 'حزب البحر — حِزْبُ الْبَحْرِ',
    'dua.hizbDesc': 'الورد الروحي الشهير للإمام أبي الحسن الشاذلي للحفظ والسلامة وتيسير الصعاب والأحوال. اتبع الخطوات التفاعلية أدناه.',
    
    // Daily Azkar Section
    'azkar.title': 'أذكار الصباح والمساء',
    'azkar.badge': 'حصن المسلم اليومي والبركات',
    'azkar.desc': '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» (الرعد: 28). اضغط على علامة الاختيار لمتابعة تقدمك اليومي وقراءة الترجمات والاستماع لتسجيلات الأذكار العذبة.',
    'azkar.cat.daily': 'الأذكار اليومية',
    'azkar.cat.dailyDesc': 'حصن الصباح والمساء واليقظة والنوم',
    'azkar.cat.supplications': 'الأدعية المأثورة',
    'azkar.cat.supplicationsDesc': 'أدعية مباركة من القرآن والسنّة',
    'azkar.cat.wird': 'الأوراد اليومية',
    'azkar.cat.wirdDesc': 'أوراد الذكر القصيرة المتكررة',
    'azkar.cat.istighfar': 'الاستغفار والطلب',
    'azkar.cat.istighfarDesc': 'أذكار الاستغفار والتوبة والطلب الروحي',
    'azkar.cat.hizb': 'أوراد التحصين',
    'azkar.cat.hizbDesc': 'أدعية وقصائد حماية للأئمة العظام',
    'azkar.cat.names': 'أسماء الله الحسنى',
    'azkar.cat.namesDesc': 'تسعة وتسعون اسماً لله جل جلاله',
    'azkar.morning': 'أذكار الصباح',
    'azkar.evening': 'أذكار المساء',
    'azkar.asmaTitle': 'أسماء الله الحسنى ودعاؤها',
    'azkar.asmaDesc': 'دعاء والتضرع بأسماء الله الحسنى لتفريج الكروب، الهموم، القلق، والأحزان والآلام الروحية',
    'azkar.transliteration': 'اللفظ الصوتي الترجمي',
    'azkar.translation': 'الترجمة والمعنى الكلي',
    'azkar.benefitReward': 'الفائدة والفضل المستحب:',
    'azkar.endNote': 'نهاية قسم الأذكار والأوراد المأثورة',
    
    // Bookmarks Section
    'bookmarks.title': 'إشاراتي المرجعية',
    'bookmarks.desc': 'السور والتلاوات المفضلة لديك للوصول إليها بسهولة خلال تلاوتك ليوم الجمعة. اضغط على رمز المفضلة بجانب السور لحفظها هنا.',
    'bookmarks.empty': 'لا توجد محفوظات حتى الآن',
    'bookmarks.emptyDesc': 'لم تقم بحفظ أي سورة حتى الآن. اضغط على رمز الإشارة المرجعية بجانب أي سورة في قسم "كل السور الموصى بها" لحفظها والوصول إليها بسرعة.',
    'bookmarks.backButton': 'تصفح السور الموصى بها يوم الجمعة',
    
    // Share feature
    'share.button': 'مشاركة التطبيق',
    'share.copied': 'تم نسخ الرابط إلى الحافظة!',
    'share.failed': 'فشل في نسخ أو مشاركة الرابط.',
    'share.title': 'مساعد الأنوار القرآني والتجويد',
    'share.text': 'اكتشف مساعد الأنوار القرآني والتجويد — رفيقك الرقمي للتلاوات العطرة، أحكام التجويد التفاعلية، والأدعية والأذكار اليومية.',
  },
  am: {
    // Navbar & Sidebar
    'nav.title': 'አን-ኑር የቁርኣን እና ተጅዊድ መመሪያ',
    'nav.alkahf': 'ሱረቱል ካህፍ',
    'nav.table': 'የተመከሩ ሱራዎች',
    'nav.other': 'ሌሎች ምክረ ሀሳቦች',
    'nav.dua': 'ዱዓእ እና ልመናዎች',
    'nav.azkar': 'ዕለታዊ አዝካር',
    'nav.bookmarks': 'የእኔ ዕልባቶች',
    'nav.journal': 'የማስተንተኛ ማስታወሻ',
    'nav.tajweed': 'የተጅዊድ ህጎች',
    'nav.qibla': 'ቂብላ አቅጣጫ',
    'nav.features': 'ባህሪያት እና መመሪያ',
    'nav.khatam': 'ኻታም-ኡል-ቁርአን',
    'nav.salat_recitations': 'የሰላት ውስጥ ዚክሮችና ዱዓዎች',
    'nav.focus': 'የትኩረት ሁኔታ',
    'nav.night': 'የሌሊት ሁኔታ',
    'nav.size': 'የአረብኛ ፊደል መጠን',
    'nav.exitFocus': 'የትኩረት ሁኔታን አቁም',
    'nav.config': 'ቅንብሮች',
    
    // Sidebar explanations
    'side.salatRecitationsDesc': 'በእያንዳንዱ የሰላት አቋም ውስጥ የሚባሉ ዚክሮች ከአረብኛና ትርጉም ጋር',
    'side.nightDesc': 'ማታ ወይም ሌሊት ለማንበብ ምቹ የሆነ የጨለማ ዳራ ቀለሞችን ይቀይራል።',
    'side.focusDesc': 'ሳይከፋፈሉ በተረጋጋ ሁኔታ ለማንበብ ሁሉንም ምናሌዎች፣ ግርጌዎች እና የጎን ፓነሎች ይደብቃል።',
    'side.fontDesc': 'አረብኛውን በሚገባ ለማንበብ የፊደሉን መጠን እዚህ ያስተካክሉ።',
    'side.alkahfDesc': 'ዋናው የዓርብ ሱራ ንባብ',
    'side.tableDesc': 'ፈጣን ማጣቀሻ ሰንጠረዥ',
    'side.otherDesc': 'የሌሊት ጥበቃ እና የተወሰኑ ወቅቶች',
    'side.duaDesc': 'የዓርብ ዱዓዎች፣ የጭንቀት ማቃለያ እና የተሃጁድ ሶላት',
    'side.azkarDesc': 'ዕለታዊ የጠዋትና ማታ ጥበቃዎች',
    'side.bookmarksDesc': 'የተቀመጡ ሱራዎችና አንቀጾች',
    'side.journalDesc': 'የሚያነቡትን ሱራዎች በሚመለከት የግል ማስታወሻዎችን እና መንፈሳዊ አስተንትኖዎችን ያስቀምጡ',
    'side.tajweedDesc': 'በይነተገናኝ የተጅዊድ ንባብ ህጎች መመሪያ',
    'side.qiblaDesc': 'የካዕባን አቅጣጫ በጂፒኤስ እና ኮምፓስ ማሳያ',
    'side.featuresDesc': 'ዝርዝር ባህሪያቱን ይመልከቱ እና የዎርድ ሰነድ (Word) ያውርዱ።',
    'side.khatamDesc': 'ቁርአን ሲያጠናቅቁ የሚደረግ በረከት የሞላበት ዱዓ በድምጽ ንባብ',
    
    // Hero & Headers
    'hero.title': 'ለዓርብ የተመከሩ ሱራዎች',
    'hero.desc': 'በጁሙዓ (በዓርብ) ቀን የሚቀሩ የተባረኩ ሱራዎች፣ በተለይም ሱረቱል ካህፍ እና ሌሎች የነቢዩ (ሰ.ዐ.ወ) አስተምህሮቶች መመሪያ።',
    'table.title': 'ሁሉም የተመከሩ ሱራዎች',
    'table.desc': 'ዕለታዊ የጥበቃ ዚክሮች እና የሶላት ላይ ንባቦችን ጨምሮ የተሟላ ዝርዝር። ማንኛውንም ሱራ በመጫን ማንበብ እና ማዳመጥ ይችላሉ።',
    'search.placeholder': 'በሱራ ስም ወይም በምዕራፍ ይፈልጉ...',
    'table.col.surah': 'ሱራ',
    'table.col.time': 'የሚመከርበት ሰዓት',
    'table.col.level': 'የሱና ደረጃ',
    'table.col.actions': 'ንባብ እና ድምጽ',
    'table.filter.all': 'ሁሉንም ንባቦች',
    'table.filter.sunnah': 'ሱናዎች ብቻ',
    'table.filter.quran': 'የቁርአን ጽሑፎች',
    'table.filter.bookmarks': 'የተመረጡ',
    
    // Al Kahf Section
    'kahf.mainRec': 'ዋናው ምክረ-ሃሳብ: ሱረቱል ካህፍ',
    'kahf.desc': 'ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) በዓርብ ዕለት ሱረቱል ካህፍን እንድንቀራ አበረታትተዋል። ይህ በሳምንቱ ውስጥ መንፈሳዊ ጥንካሬ ይለግሳል።',
    'kahf.listen': 'ሱረቱል ካህፍን ያዳምጡ',
    'kahf.reciter': 'በሚሻሪ ራሺድ አል-አፋሲ • 15:52 ደቂቃ',
    'kahf.playing': 'በታችኛው የድምጽ ማጫወቻ ላይ እየተጫወተ ነው',
    'kahf.paused': 'በታችኛው የድምጽ ማጫወቻ ላይ ቆሟል',
    'kahf.speed': 'የድምጽ ፍጥነት:',
    'kahf.themes': 'ዋና ዋና ታሪኮች (ጭብጦች)',
    'kahf.clickStory': 'ሙሉውን ታሪክ ለማንበብ ጭብጡን ይጫኑ።',
    'kahf.benefits': 'ነቢይያዊ ጥቅሞች',
    
    // Prayer Times Section
    'prayer.title': 'የዓርብ ሶላት ወቅቶች (ሰዓታት)',
    'prayer.desc': 'የዓርብ የጁሙዓ ሶላት ሰዓታትን ይከታተሉ እና የዱዓ ተቀባይነት ሰዓትን ይጠቀሙ።',
    'prayer.location': 'የአሁኑን ቦታ እየፈለገ ነው...',
    'prayer.azanSetting': 'የእለታዊ ሶላት አዛን ማስታወቂያ',
    'prayer.azanSettingDesc': 'የሶላት ሰዓት ሲደርስ የአዛን ድምጽ በራሱ እንዲጫወት ያድርጉ።',
    'prayer.selectStyle': 'የአዛን ዘይቤ ይምረጡ',
    'prayer.makkah': 'የመካ አዛን',
    'prayer.madinah': 'የመዲና አዛን',
    'prayer.playTest': 'የሙከራ ድምጽ አጫውት',
    'prayer.stopTest': 'የሙከራ ድምጽ አቁም',
    'prayer.azanAlertTitle': 'አል-ሙአዚን አዛን',
    'prayer.azanAlertSubtitle': 'የሶላት ወቅት ደርሷል',
    'prayer.azanAlertAyah': '"ሶላት በምእመናን ላይ በወቅቱ የተወሰነ ግዴታ ነውና።"',
    'prayer.azanAlertDismiss': 'አዛኑን አቁም',
    'prayer.dstSetting': 'የቀን ብርሃን ቆጣቢ ሰዓት (DST)',
    'prayer.dstSettingDesc': 'ስሌቶችን ለበጋ የቀን ብርሃን ቆጣቢ (+1 ሰዓት) ወይም ለመደበኛ የፀሐይ ሰዓት ያስተካክሉ።',
    'prayer.dstAuto': 'በራስ-አግኝ (በአካባቢ)',
    'prayer.dstOn': 'DST በርቷል (+1 ሰዓት)',
    'prayer.dstOff': 'መደበኛ ሰዓት (+0 ሰዓት)',
    'prayer.dstActiveBadge': 'የቀን ብርሃን ቆጣቢ በርቷል (+1 ሰዓት)',
    'prayer.dstInactiveBadge': 'መደበኛ ሰዓት ገብቷል (+0 ሰዓት)',
    'prayer.fineTune': 'የአካባቢ መስጂድ ማመሳሰያ (ጥቃቅን ደቂቃዎች)',
    
    // Dua & Azkar Section
    'dua.title': 'ዱዓእ እና ልመናዎች',
    'dua.desc': 'ሁለንተናዊ የዱዓዎች ማዕከል፡ የዓርብ ዱዓዎችና ዝክሮች፣ ከጭንቀትና ከቤተሰብ ሸክም መሸሸጊያ፣ እንዲሁም የተሃጁድና የሌሊት ሶላት መመሪያ።',
    'dua.tab.general': 'የዓርብ ዱዓዎች እና አዝካሮች',
    'dua.tab.stress': 'የጭንቀትና የሸክም ማቃለያ ዱዓዎች',
    'dua.tab.tahajjud': 'ተሃጁድና የሌሊት ሶላት',
    'dua.tab.stressDesc': 'ከጭንቀት፣ ከሀዘን፣ ከስንፍና፣ ከዕዳ እና ከሰው ጭቆና መጠበቂያ የነቢዩ ﷺ ታላቅ ዱዓእ',
    'dua.tab.tahajjudDesc': 'የተሃጁድ አሰጋገድ ደረጃ በደረጃ መመሪያ እና የሌሊቱ የመጨረሻ ሲሶ ሰዓት ማስያ',
    'dua.subtab.duas': 'የዓርብ ዱዓ እና ልመናዎች',
    'dua.subtab.duasDesc': 'ሰለዋት፣ አጠቃላይ ዱዓዎች እና የጥዋት ጸሎቶች',
    'dua.subtab.hizb': 'ሒዝብ አል-ባሕር — ሒዝብ አል-ባሕር',
    'dua.subtab.hizbDesc': 'የኢማም ሻዘሊ የጥበቃ ዱዓ',
    'dua.subtab.myDuas': 'የእኔ ዱዓዎች',
    'dua.subtab.myDuasDesc': 'የተቀመጡ ዱዓዎች በራስዎ መለያዎች',
    'dua.goldenHour': 'የዱዓ ተቀባይነት ሰዓት (ወርቃማው ሰዓት)',
    'dua.goldenHourDesc': 'ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) በዓርብ ቀን ሙስሊሞች የፈለጉትን ጠይቀው አላህ የሚሰጥበት አንድ ወቅት እንዳለች ተናግረዋል። ዑለማዎች ይህ ሰዓት ከዓስር ሶላት በኋላ እስከ መግሪብ ያለው የመጨረሻው ሰዓት እንደሆነ ይናገራሉ።',
    'dua.goldenHourHadith': '"በዓርብ ቀን ውስጥ አንዲት ሰዓት አለች፤ ሙስሊም ባሪያ በሷ ላይ ቆሞ እየሰገደ አላህን ነገር አይለምንም አላህ የለመነውን የሰጠው ቢሆን እንጂ።"',
    'dua.goldenHourHadithRef': '— ሳሂህ አል-ቡኻሪ',
    'dua.salawat': 'ሰለዋት ማብዛት (በነቢዩ ላይ በረከት መላክ)',
    'dua.salawatRef': 'ነቢዩ (ሰ.ዐ.ወ) እንዲህ ብለዋል፡ "በዓርብ ቀን በእኔ ላይ ሰለዋት አብዙ، ሰለዋታችሁ እኔ ዘንድ ይቀርባልና።"',
    'dua.generalDua': 'የዱንያና የአኺራ በጎ ነገር መለመኛ',
    'dua.familyDua': 'ለልጆች እና ለቤተሰብ የሚደረግ ዱዓ',
    'dua.familyDuaRef': 'ጌታችን ሆይ! ከሚስቶቻችንና ከዘሮቻችን ለዓይኖቻችን መረጋጊያን ስጠን፤ ለፈራህ አላህም መሪ አድርገን። ጌታዬ ሆይ! ሶላትን አዘውትሬ የምሰግድ አድርገኝ፤ ከዘሮቼም እንዲሁ። ጌታችን ሆይ! ጸሎቴን ተቀበልልኝ።',
    'dua.khatamTitle': 'ኻታም-ኡል-ቁርአን ዱዓ',
    'dua.khatamSub': 'የቅዱስ ቁርአን ንባብ ሲጠናቀቅ የሚደረግ ዱዓ',
    'dua.khatamDesc': 'የተከበረውን ቁርአን ካጠናቀቁ በኋላ ለአላህ እዝነት፣ መመሪያ፣ ብርሃን እና ጀነትን ለመለመን የሚደረግ ታላቅ ዱዓ።',
    'dua.khatamRef': 'በመካ እና በመዲና ኢማሞች የሚደረግ የተለመደ የኻታም ዱዓ',
    'dua.openFullKhatam': 'ሙሉውን የኻታም 12 ክፍሎች እና የድምጽ ንባቦች ክፈት →',
    'dua.morningTitle': 'የጠዋት ዱዓዎች እና አዝካሮች',
    'dua.morningDesc': 'ከመጽሐፉ የተወሰዱ እውነተኛ የጠዋት ዱዓዎች ለሰላም፣ ለጥበቃ እና ለበረከት። ለመጨረስ የክብ ቆጣሪውን ይጫኑ።',
    'dua.resetCounters': 'ቆጣሪዎችን በዜሮ ይጀምሩ',
    'dua.goal': 'ግብ:',
    'dua.completed': 'ተጠናቋል',
    'dua.tapToCount': 'ለመቁጠር ክብዋን ይጫኑ',
    'dua.hizbTitle': 'ሒዝብ አል-ባሕር — ሒዝብ አል-ባሕር',
    'dua.hizbDesc': 'የኢማም ሻዘሊ ዝነኛ የጥበቃ እና የችግር ማቅለያ መንፈሳዊ ዱዓ። በይነተገናኝ መመሪያውን ይጠቀሙ ወይም ሙሉውን ጽሑፍ ከታች ያንብቡ።',
    
    // Daily Azkar Section
    'azkar.title': 'የጠዋት እና ማታ አዝካሮች',
    'azkar.badge': 'የእለት ተእለት ጥበቃ እና በረከቶች',
    'azkar.desc': '"አዋጅ አላህን በማውሳት ልቦች ይረጋጋሉ።" (ረዕድ 13:28)። እድገትዎን ለመከታተል፣ ትርጉሙን ለማየት ወይም ድምጹን ለማዳመጥ ምልክቶቹን ይጫኑ።',
    'azkar.cat.daily': 'ዕለታዊ አዝካር',
    'azkar.cat.dailyDesc': 'የጠዋት እና የማታ ጥበቃዎች',
    'azkar.cat.supplications': 'ዱዓዎች',
    'azkar.cat.supplicationsDesc': 'ከቁርአን እና ከሱና የተወሰዱ ዱዓዎች',
    'azkar.cat.wird': 'እለታዊ አውራዶች',
    'azkar.cat.wirdDesc': 'አጫጭር ተደጋጋሚ ዚክሮች',
    'azkar.cat.istighfar': 'እስቲግፋር (ምህረት መለመን)',
    'azkar.cat.istighfarDesc': 'የአላህን ምህረት መለመኛ ዚክሮች',
    'azkar.cat.hizb': 'የጥበቃ ዱዓዎች',
    'azkar.cat.hizbDesc': 'የታላላቅ አሊሞች የጥበቃ አውራዶች',
    'azkar.cat.names': 'የአላህ ውብ ስሞች',
    'azkar.cat.namesDesc': '99 የተከበሩ የአላህ ስሞች',
    'azkar.morning': 'የጠዋት አዝካር (ሰብዓህ)',
    'azkar.evening': 'የማታ አዝካር (መሳእ)',
    'azkar.asmaTitle': 'የአላህ ስሞች ዱዓ',
    'azkar.asmaDesc': 'ሀዘንን፣ ጭንቀትንና ስቃይን ለማስወገድ በአላህ ውብ ስሞች መለመኛ ዱዓ',
    'azkar.transliteration': 'አጠራር በላቲን',
    'azkar.translation': 'ትርጉም',
    'azkar.benefitReward': 'ጥቅም / በጎ ትሩፋት:',
    'azkar.endNote': 'የአዝካሮች ክፍል ፍጻሜ',
    
    // Bookmarks Section
    'bookmarks.title': 'የእኔ ዕልባቶች',
    'bookmarks.desc': 'በዓርብ ዕለት በቀላሉ ለማግኘት የጠበቋቸው ሱራዎች እና ንባቦች። ለማስቀመጥ የዕልባት ምልክቱን ይጫኑ።',
    'bookmarks.empty': 'እስካሁን ምንም ዕልባት የለም',
    'bookmarks.emptyDesc': 'እስካሁን ምንም ሱራ አላስቀመጡም። በቀላሉ ለማግኘት በ "ሁሉም የተመከሩ" ክፍል ውስጥ የዕልባት ምልክቱን ይጫኑ።',
    'bookmarks.backButton': 'የተመከሩ ሱራዎችን ይመልከቱ',
    
    // Share feature
    'share.button': 'መተግበሪያውን ያጋሩ',
    'share.copied': 'የመተግበሪያው ሊንክ ተገልብጧል!',
    'share.failed': 'ሊንኩን ማጋራት ወይም መቅዳት አልተቻለም።',
    'share.title': 'አን-ኑር የቁርኣን እና ተጅዊድ መመሪያ',
    'share.text': 'አን-ኑር የቁርኣን እና ተጅዊድ መመሪያን ይጎብኙ — ለቁርኣን ንባቦች፣ ለተጅዊድ ትምህርቶች፣ ዱዓዎች እና አዝካሮች ምርጥ ረዳት።',
  },
  har: {
    // Navbar & Sidebar
    'nav.title': 'አን-ኑር ቁርአን ባይነተገናኝ መሪ',
    'nav.alkahf': 'ሱረቱል ካህፍ',
    'nav.table': 'ሙጡኝ ሱራእአች',
    'nav.other': 'ሌጦች ቂያማች',
    'nav.dua': 'ዱዓእ እና ልመናዎች',
    'nav.azkar': 'ኩሉዮም አዝካር',
    'nav.bookmarks': 'አን ቀረእቤ',
    'nav.journal': 'የማስተንተኛ ደፍተር',
    'nav.tajweed': 'የተጅዊድ ህጎች',
    'nav.qibla': 'ቂብላ አቅጣጫ',
    'nav.features': 'ባህሪያትና መመሪያ',
    'nav.khatam': 'ኻታም-ኡል-ቁርአን',
    'nav.salat_recitations': 'የሰላት ውስጥ ዚክርና ዱዓእ',
    'nav.focus': 'ቂልቢ መቅረእ',
    'nav.night': 'መዓልት ሌይቲ',
    'nav.size': 'አረቢ ተርቲብ ፊደል',
    'nav.exitFocus': 'ቂልቢ መቅረእ አቁም',
    'nav.config': 'ቅንብሮች',
    
    // Sidebar explanations
    'side.salatRecitationsDesc': 'በሰላት አቋም ሁሉ የሚባሉ ዚክሮች ከአረብኛና ትርጉም ጋር',
    'side.nightDesc': 'ሌይቲ ወይም ሱብሒ መቅረእሊ ኡሱል ጨለማ ዳራ ቀለማች ይቀይራልሃል።',
    'side.focusDesc': 'ሳይከፋፈሉ በተረጋጋ ሁኔታ ለማንበብ ሁሉንም ምናሌዎች፣ ግርጌዎች እና የጎን ፓነሎች ይደብቃል።',
    'side.fontDesc': 'አረብኛውን በሚገባ ለማንበብ የፊደሉን መጠን እዚህ ያስተካክሉ።',
    'side.alkahfDesc': 'ጁምዓ ኡሱል ንባብ',
    'side.tableDesc': 'ሰንጠረዥ ሰማዕ',
    'side.otherDesc': 'ሌይቲ ጥበቃና ወቅታች',
    'side.duaDesc': 'የጁምዓ ዱዓእአች፣ የጭንቀት ማቃለያ እና የተሃጁድ ሰላት',
    'side.azkarDesc': 'ኩሉዮም የጥዋትና የማታ ዚክሮች',
    'side.bookmarksDesc': 'ዘሐፈዝኩቲ ሱራእአች',
    'side.journalDesc': 'ቁርአን ተቅራእባህቲ ግል ማስታወሻና መንፈሳዊ አስተንትኖአች አሕፍዝ',
    'side.tajweedDesc': 'ተግባራዊ የተጅዊድ መመሪያ',
    'side.qiblaDesc': 'የካዕባን አቅጣጫ በጂፒኤስ እና ኮምፓስ ማሳያ',
    'side.featuresDesc': 'ባህሪያት ዚየረ ኡፍያት ዎርድ ሰነድ ያውርዱ።',
    'side.khatamDesc': 'ቁርአን ሲያጠናቅቁ የሚደረግ በረከት የሞላበት ዱዓ በድምጽ ንባብ',
    
    // Hero & Headers
    'hero.title': 'ጁምዓሊ ዘትባሀሉ ሱራእአች',
    'hero.desc': 'ጁምዓ መብሩክ ንባብ መሪሕ፣ ሱረቱል ካህፍና ሱናአች በሕረ ጠራራ በረከሊ ኡስቲ ያደርጋል።',
    'table.title': 'ኩሉ ሙጡኝ ዘትባሀሉ ሱራእአች',
    'table.desc': 'ኩሉዮም የጥበቃ ዚክሮችና የሰላት ላይ ንባቦች። ማንኛውንም ሱራ በመጫን ማንበብና ማዳመጥ ይቻላል።',
    'search.placeholder': 'በሱራ ስም ወይም በምዕራፍ ይፈልጉ...',
    'table.col.surah': 'ሱራእ',
    'table.col.time': 'ዘትባሀለ ወቅቲ',
    'table.col.level': 'የሱና ደረጀ',
    'table.col.actions': 'ንባብና ድምጺ',
    'table.filter.all': 'ኩሉ ንባባች',
    'table.filter.sunnah': 'ሱናእ ብቻ',
    'table.filter.quran': 'ቁርአን ኪታብ',
    'table.filter.bookmarks': 'ዘሐፈዝኩቲ',
    
    // Al Kahf Section
    'kahf.mainRec': 'ዋና ሙጡኝ: ሱረቱል ካህፍ',
    'kahf.desc': 'ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) ጁምዓ ዩም ሱረቱል ካህፍ መቅረእሊ አበረታቱ። ይኽ በሳምንት ውስጥ ኑርና በረከት ይሰጣል።',
    'kahf.listen': 'ሱረቱል ካህፍ ሰማዕ ባይ',
    'kahf.reciter': 'ሚሻሪ ራሺድ አል-አፋሲ • 15:52 ደቂቃ',
    'kahf.playing': 'ድምጺ ማጫወቻው ላይ እየተጫወተ ነው',
    'kahf.paused': 'ድምጺ ማጫወቻው ላይ ቆሟል',
    'kahf.speed': 'የድምጺ ፍጥነት:',
    'kahf.themes': 'ኡሱል ቂሳአች (ታሪኮች)',
    'kahf.clickStory': 'ቂሳው ጠቅ ባይ ታሪክ መሉእ መቅረእሊ።',
    'kahf.benefits': 'የነቢዩ ጥቅሞች',
    
    // Prayer Times Section
    'prayer.title': 'የጁምዓ ሰላት ወቅታች',
    'prayer.desc': 'የጁምዓ ሰላት ወቅታችን ይከታተሉና የዱዓ ተቀባይነት ወቅትን ይጠቀሙ።',
    'prayer.location': 'የአሁኑን ቦታ እየፈለገ ነው...',
    'prayer.azanSetting': 'ኩሉዮም ሰላት አዛን ቤጃሕ',
    'prayer.azanSettingDesc': 'የሰላት ሰዓት ሲደርስ የአዛን ድምጽ በራሱ እንዲጫወት ያድርጉ።',
    'prayer.selectStyle': 'የአዛን ዘይቤ ይምረጡ',
    'prayer.makkah': 'የመካ አዛን',
    'prayer.madinah': 'የመዲና አዛን',
    'prayer.playTest': 'የሙከራ አዛን አጫውት',
    'prayer.stopTest': 'የሙከራ አዛን አቁም',
    'prayer.azanAlertTitle': 'አል-ሙአዚን አዛን',
    'prayer.azanAlertSubtitle': 'የሰላት ወቅት ደርሷል',
    'prayer.azanAlertAyah': '"ሰላት በምእመናን ላይ በወቅቱ የተወሰነ ግዴታ ነው።"',
    'prayer.azanAlertDismiss': 'አዛኑን አቁም',
    'prayer.dstSetting': 'የመዓልት ብርሃን ወቅቲ (DST)',
    'prayer.dstSettingDesc': 'ስሌታችን ለመዓልት ብርሃን ቆጣቢ (+1 ሰዓት) ወይም ለመደበኛ የቢሪሕ ወቅቲ ያስተካክሉ።',
    'prayer.dstAuto': 'በራሱ-አግኝ (በአካባቢ)',
    'prayer.dstOn': 'DST በርቷል (+1 ሰዓት)',
    'prayer.dstOff': 'መደበኛ ወቅቲ (+0 ሰዓት)',
    'prayer.dstActiveBadge': 'የመዓልት ብርሃን ቆጣቢ በርቷል (+1 ሰዓት)',
    'prayer.dstInactiveBadge': 'መደበኛ ወቅቲ ገብቷል (+0 ሰዓት)',
    'prayer.fineTune': 'የመስጂድ ማመሳሰያ ደቂቃች',
    
    // Dua & Azkar Section
    'dua.title': 'ዱዓእ እና ልመናዎች',
    'dua.desc': 'የዱዓዎች ማዕከል፡ የጁምዓ ዱዓዎችና ዝክራች፣ ከጭንቀትና ከሸክም መሸሸጊያ፣ እንዲሁም የተሃጁድና የሌሊት ሰላት መመሪያ።',
    'dua.tab.general': 'የጁምዓ ዱዓዎች እና አዝካራች',
    'dua.tab.stress': 'የጭንቀትና የሸክም ማቃለያ ዱዓእአች',
    'dua.tab.tahajjud': 'ተሃጁድና የሌሊት ሰላት',
    'dua.tab.stressDesc': 'ከጭንቀት፣ ከሀዘን፣ ከስንፍና፣ ከዕዳ እና ከሰው ጭቆና መጠበቂያ የነቢዩ ﷺ ታላቅ ዱዓእ',
    'dua.tab.tahajjudDesc': 'የተሃጁድ አሰጋገድ መመሪያ እና የሌሊቱ የመጨረሻ ሲሶ ሰዓት ማስያ',
    'dua.subtab.duas': 'የጁምዓ ዱዓእና ልመናዎች',
    'dua.subtab.duasDesc': 'ሰለዋት፣ አጠቃላይ ዱዓዎች እና የጥዋት ጸሎቶች',
    'dua.subtab.hizb': 'ሒዝብ አል-ባሕር — ሒዝብ አል-ባሕር',
    'dua.subtab.hizbDesc': 'የኢማም ሻዘሊ የጥበቃ ዱዓ',
    'dua.subtab.myDuas': 'የእኔ ዱዓእአች',
    'dua.subtab.myDuasDesc': 'የተቀመጡ ዱዓእአች',
    'dua.goldenHour': 'የዱዓ ተቀባይነት ሰዓት (ወርቃማው ሰዓት)',
    'dua.goldenHourDesc': 'ነቢዩ ሙሐመድ (ሰ.ዐ.ወ) በጁምዓ ቀን ሙስሊሞች የፈለጉትን ጠይቀው አላህ የሚሰጥበት አንድ ወቅት እንዳለች ተናግረዋል። ዑለማዎች ይህ ሰዓት ከዓስር ሶላት በኋላ እስከ መግሪብ ያለው የመጨረሻው ሰዓት እንደሆነ ይናገራሉ።',
    'dua.goldenHourHadith': '"በዓርብ ቀን ውስጥ አንዲት ሰዓት አለች፤ ሙስሊም ባሪያ በሷ ላይ ቆሞ እየሰገደ አላህን ነገር አይለምንም አላህ የለመነውን የሰጠው ቢሆን እንጂ።"',
    'dua.goldenHourHadithRef': '— ሳሂህ አል-ቡኻሪ',
    'dua.salawat': 'ሰለዋት ማብዛት (በነቢዩ ላይ በረከት መላክ)',
    'dua.salawatRef': 'ነቢዩ (ሰ.ዐ.ወ) እንዲህ ብለዋል፡ "በጁምዓ ቀን በእኔ ላይ ሰለዋት አብዙ፣ ሰለዋታችሁ እኔ ዘንድ ይቀርባልና።"',
    'dua.generalDua': 'የዱንያና የአኺራ በጎ ነገር መለመኛ',
    'dua.familyDua': 'ለልጆችእና ለቤተሰብ ዱዓ',
    'dua.familyDuaRef': 'ጌታችን ሆይ! ከሚስቶቻችንና ከዘሮቻችን ለዓይኖቻችን መረጋጊያን ስጠን፤ ለፈራህ አላህም መሪ አድርገን። ጌታዬ ሆይ! ሶላትን አዘውትሬ የምሰግድ አድርገኝ፤ ከዘሮቼም እንዲሁ። ጌታችን ሆይ! ጸሎቴን ተቀበልልኝ።',
    'dua.khatamTitle': 'ኻተመ ቁርአን ዱዓእ',
    'dua.khatamSub': 'ቁርአን ሲያጠናቅቁ የሚደረግ ዱዓእ',
    'dua.khatamDesc': 'ቁርአን መቅረእ ሲጨርሱ ለራሕማት፣ ለኑር፣ ለሂዳያትና ለጀነት የሚለመን ታላቅ ዱዓእ።',
    'dua.khatamRef': 'የመካና የመዲና ኢማሞች የሚያደርጉት የኻተመ ዱዓእ',
    'dua.openFullKhatam': 'ሙሉ የኻተመ 12 ባሕቲና የድምጽ መቅረእ ክፈት →',
    'dua.morningTitle': 'የጠዋት ዱዓዎች እና አዝካሮች',
    'dua.morningDesc': 'ከመጽሐፉ የተወሰዱ እውነተኛ የጠዋት ዱዓዎች ለሰላም፣ ለጥበቃ እና ለበረከት። ለመጨረስ የክብ ቆጣሪውን ይጫኑ።',
    'dua.resetCounters': 'ቆጣሪዎችን በዜሮ ይጀምሩ',
    'dua.goal': 'ግብ:',
    'dua.completed': 'ተጠናቋል',
    'dua.tapToCount': 'ለመቁጠር ክብዋን ይጫኑ',
    'dua.hizbTitle': 'ሒዝብ አል-ባሕር — ሒዝብ አል-ባሕር',
    'dua.hizbDesc': 'የኢማም ሻዘሊ ዝነኛ የጥበቃ እና የችግር ማቅለያ መንፈሳዊ ዱዓ። በይነተገናኝ መመሪያውን ይጠቀሙ ወይም ሙሉውን ጽሑፍ ከታች ያንብቡ።',
    
    // Daily Azkar Section
    'azkar.title': 'የጠዋት እና ማታ አዝካሮች',
    'azkar.badge': 'የእለት ተእለት ጥበቃ እና በረከቶች',
    'azkar.desc': '"አዋጅ አላህን በማውሳት ልቦች ይረጋጋሉ።" (ረዕድ 13:28)። እድገትዎን ለመከታተል፣ ትርጉሙን ለማየት ወይም ድምጹን ለማዳመጥ ምልክቶቹን ይጫኑ።',
    'azkar.cat.daily': 'ዕለታዊ አዝካር',
    'azkar.cat.dailyDesc': 'የጠዋት እና የማታ ጥበቃዎች',
    'azkar.cat.supplications': 'ዱዓዎች',
    'azkar.cat.supplicationsDesc': 'ከቁርአን እና ከሱና የተወሰዱ ዱዓዎች',
    'azkar.cat.wird': 'እለታዊ አውራዶች',
    'azkar.cat.wirdDesc': 'አጫጭር ተደጋጋሚ ዚክሮች',
    'azkar.cat.istighfar': 'እስቲግፋር (ምህረት መለመን)',
    'azkar.cat.istighfarDesc': 'የአላህን ምህረት መለመኛ ዚክሮች',
    'azkar.cat.hizb': 'የጥበቃ ዱዓዎች',
    'azkar.cat.hizbDesc': 'የታላላቅ አሊሞች የጥበቃ አውራዶች',
    'azkar.cat.names': 'የአላህ ውብ ስሞች',
    'azkar.cat.namesDesc': '99 የተከበሩ የአላህ ስሞች',
    'azkar.morning': 'የጠዋት አዝካር (ሰብዓህ)',
    'azkar.evening': 'የማታ አዝካር (መሳእ)',
    'azkar.asmaTitle': 'የአላህ ስሞች ዱዓ',
    'azkar.asmaDesc': 'ሀዘንን፣ ጭንቀትንና ስቃይን ለማስወገድ በአላህ ውብ ስሞች መለመኛ ዱዓ',
    'azkar.transliteration': 'አጠራር በላቲን',
    'azkar.translation': 'ትርጉም',
    'azkar.benefitReward': 'ጥቅም / በጎ ትሩፋት:',
    'azkar.endNote': 'የአዝካሮች ክፍል ፍጻሜ',
    
    // Bookmarks Section
    'bookmarks.title': 'የእኔ ዕልባቶች',
    'bookmarks.desc': 'በጁምዓ ዕለት በቀላሉ ለማግኘት የጠበቋቸው ሱራዎች እና ንባቦች። ለማስቀመጥ የዕልባት ምልክቱን ይጫኑ።',
    'bookmarks.empty': 'እስካሁን ምንም ዕልባት የለም',
    'bookmarks.emptyDesc': 'እስካሁን ምንም ሱራ አላስቀመጡም። በቀላሉ ለማግኘት በ "ሁሉም የተመከሩ" ክፍል ውስጥ የዕልባት ምልክቱን ይጫኑ።',
    'bookmarks.backButton': 'የተመከሩ ሱራዎችን ይመልከቱ',
    
    // Share feature
    'share.button': 'መተግበሪያ ያጋሩ',
    'share.copied': 'የመተግበሪያው ሊንክ ተገልብጧል!',
    'share.failed': 'ሊንኩን ማጋራት ወይም መቅዳት አልተቻለም።',
    'share.title': 'አን-ኑር ቁርአን ባይነተገናኝ መሪ',
    'share.text': 'አን-ኑር ቁርአን ባይነተገናኝ መሪ — ለቁርአን ንባቦች، ለተጅዊድ፣ ዱዓዎች እና አዝካሮች ምርጥ ረዳት።',
  }
};

// Localized versions of lists
const translatedSurahNames: Record<Language, Record<number, string>> = {
  en: {},
  ar: {
    18: 'الكهف', 32: 'السجدة', 36: 'يس', 44: 'الدخان', 55: 'الرحمن', 56: 'الواقعة', 
    62: 'الجمعة', 63: 'المنافقون', 67: 'الملك', 76: 'الإنسان', 87: 'الأعلى', 88: 'الغاشية', 
    112: 'الإخلاص', 113: 'الفلق', 114: 'الناس', 1: 'الفاتحة', 2: 'الصفحة الثانية من القرآن'
  },
  am: {
    18: 'አል-ካህፍ', 32: 'አስ-ሰጅዳህ', 36: 'ያሲን', 44: 'አድ-ዱኻን', 55: 'አር-ራሕማን', 56: 'አል-ዋቂዓህ', 
    62: 'አል-ጁሙዓህ', 63: 'አል-ሙናፊቁን', 67: 'አል-ሙልክ', 76: 'አል-ኢንሳን', 87: 'አል-አዕላ', 88: 'አል-ጋሺያህ', 
    112: 'አል-ኢኽላስ', 113: 'አል-ፈ‌లቅ', 114: 'አን-ናስ', 1: 'አል-ፋቲሐህ', 2: 'የቁርአን ሁለተኛ ገጽ (አል-በቀራህ)'
  },
  har: {
    18: 'አል-ካህፍ', 32: 'አስ-ሰጅዳህ', 36: 'ያሲን', 44: 'አድ-ዱኻን', 55: 'አር-ራሕማን', 56: 'አል-ዋቂዓህ', 
    62: 'አል-ጁሙዓህ', 63: 'አል-ሙናፊቁን', 67: 'አል-ሙልክ', 76: 'አል-ኢንሳን', 87: 'አል-አዕላ', 88: 'አል-ጋሺያህ', 
    112: 'አል-ኢኽላስ', 113: 'አል-ፈ‌లቅ', 114: 'አን-ናስ', 1: 'አል-ፋቲሐህ', 2: 'ቁርአን ሁለተኛ ገጽ (አል-በቀራህ)'
  }
};

const translatedTimes: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    'Anytime (Day/Eve)': 'في أي وقت (ليلاً أو نهاراً)',
    'Friday Fajr': 'فجر الجمعة',
    'Thursday Night': 'ليلة الجمعة (الخميس مساءً)',
    'Jumu\'ah': 'يوم الجمعة',
    'Jumu\'ah Prayer': 'صلاة الجمعة'
  },
  am: {
    'Anytime (Day/Eve)': 'በማንኛውም ጊዜ (ቀን/ማታ)',
    'Friday Fajr': 'የዓርብ ሱብሒ',
    'Thursday Night': 'የሐሙስ ማታ',
    'Jumu\'ah': 'ጁሙዓ',
    'Jumu\'ah Prayer': 'የጁሙዓ ሶላት'
  },
  har: {
    'Anytime (Day/Eve)': 'ወቅቲ ኩሉ (መዓልት/ሌይቲ)',
    'Friday Fajr': 'የጁምዓ ሱብሒ',
    'Thursday Night': 'የሐሙስ ሌይቲ',
    'Jumu\'ah': 'ጁምዓ',
    'Jumu\'ah Prayer': 'የጁምዓ ሰላት'
  }
};

const translatedLevels: Record<Language, Record<string, string>> = {
  en: {},
  ar: {
    'Strong Sunnah': 'سنة مؤكدة',
    'Popular (Weak Hadith)': 'حديث ضعيف (مشهور)',
    'General': 'عام',
    'Nightly': 'كل ليلة',
    'Every Night (Authentic)': 'كل ليلة (صحيح)',
    'Morning/Evening/Sleep': 'أذكار الصباح والمساء والنوم',
    'Core Remembrance': 'ذكر أساسي ورئيسي',
    'Recommended Reading': 'قراءة مستحبة وموصى بها'
  },
  am: {
    'Strong Sunnah': 'የጠነከረ ሱና',
    'Popular (Weak Hadith)': 'ታዋቂ (ደዒፍ ሐዲስ)',
    'General': 'አጠቃላይ',
    'Nightly': 'በየምሽቱ',
    'Every Night (Authentic)': 'በየምሽቱ (ሶሒሕ)',
    'Morning/Evening/Sleep': 'ጥዋት/ማታ/መኝታ',
    'Core Remembrance': 'ዋና ዚክር',
    'Recommended Reading': 'የሚመከር ንባብ'
  },
  har: {
    'Strong Sunnah': 'ቁጭት ሱናእ',
    'Popular (Weak Hadith)': 'ማዕሩፍ (ደዒፍ ሐዲስ)',
    'General': 'ኩሉዮም',
    'Nightly': 'ኩሉ ሌይቲ',
    'Every Night (Authentic)': 'ኩሉ ሌይቲ (ሶሒሕ)',
    'Morning/Evening/Sleep': 'ሱብሒ/አሲር/መኝታ',
    'Core Remembrance': 'ዋና ዚክር',
    'Recommended Reading': 'መቅረእ ዘትባሐላ'
  }
};

const translatedDescriptions: Record<Language, Record<number, string>> = {
  en: {},
  ar: {
    1: 'فاتحة الكتاب والسبع المثاني، أساس كل صلاة وشفاء ودعاء.',
    2: 'أوائل سورة البقرة (الآيات 1-5)، تصف سمات المؤمنين المتقين المفلحين.'
  },
  am: {
    1: 'የቁርአን መክፈቻ ምዕራፍ፣ ለእያንዳንዱ ሶላትና እለታዊ ህይወት መሰረት የሆነው።',
    2: 'የሱረቱል በቀራህ መጀመሪያ (ከአንቀጽ 1-5)፣ የምእመናንን ባህሪያት የሚገልጽ።'
  },
  har: {
    1: 'የቁርአን መክፈቻ ምዕራፍ፣ ለእያንዳንዱ ሶላትና እለታዊ ህይወት መሰረት የሆነው።',
    2: 'የሱረቱል በቀራህ መጀመሪያ (ከአንቀጽ 1-5)፣ የምእመናንን ባህሪያት የሚገልጽ።'
  }
};

// Localized Themes for Surah Al-Kahf
const localizedThemes: Record<Language, Theme[]> = {
  en: [],
  ar: [
    {
      title: 'أصحاب الكهف',
      description: 'قصة فتية مؤمنين فروا بدينهم واعتزلوا في كهف لحماية إيمانهم من اضطهاد الملك، فناموا مئات السنين برعاية الله ولطفه.',
      fullStory: 'تتحدث هذه القصة عن مجموعة من الفتية الذين آمنوا بالله الواحد في مجتمع يعبد الأوثان. خوفاً من الفتنة والاضطهاد والقتل، فروا بدينهم والتجأوا إلى كهف. فضرب الله على آذانهم فيه ثلاثمائة سنين وازدادوا تسعاً. ولما استيقظوا وجدوا أن مجتمعهم قد تغير وأصبح مؤمناً. هذه المعجزة دليل على قدرة الله على البعث، وحفظه لمن لجأ إليه وتوكل عليه.'
    },
    {
      title: 'صاحب الجنتين',
      description: 'قصة تضرب مثلاً لرجلين؛ أحدهما غني شاكّ شاخص بعجبه وكبره، والآخر فقير شاكر متوكل على ربه، تبين فتنة المال وزوال النعم بالعجب.',
      fullStory: 'مثال لرجل آتاه الله جنتين من أعناب ونخل وزرع، فأثمرت ولم تظلم منه شيئاً. أصابه الغرور والكبر، ودخل جنته قائلاً ما أظن أن تبيد هذه أبداً، وشك في قيام الساعة. واجهه صاحبه الفقير المؤمن ناصحاً ومذكراً بفضل الله ودعاه لقول (ما شاء الله لا قوة إلا بالله). في النهاية، أرسل الله حسباناً من السماء فأصبحت صعيداً زلقاً وأحيط بثمره فأصبح يقلب كفيه على ما أنفق فيها وهي خاوية على عروشها، نادماً على كفره وإشراكه.'
    },
    {
      title: 'موسى والخضر عليهما السلام',
      description: 'رحلة علمية عظيمة خاضها نبي الله موسى مع العبد الصالح الخضر، تعلمنا أن الفهم البشري محدود وأن أقدار الله مبنية على حكم بالغة.',
      fullStory: 'سافر نبي الله موسى للقاء الخضر، العبد الصالح الذي آتاه الله من لدنه رحمة وعلماً. اشترط الخضر على موسى الصبر وعدم السؤال حتى يحدث له منه ذكراً. قام الخضر بأفعال بدت غريبة في ظاهرها: خرق سفينة المساكين، وقتل الغلام الجاني، وبناء الجدار في قرية بخل أهلها. اعترض موسى في كل مرة لعدم صبره. وفي النهاية كشف الخضر الحكمة الغيبية: السفينة حفظت من ملك يغتصبها، والغلام استبدل بولد صالح بار، والجدار حفظ كنز يتيمين تحت رعاية أبيهما الصالح.'
    },
    {
      title: 'ذو القرنين',
      description: 'قصة الملك الصالح العادل الذي طاف الأرض شرقاً وغرباً، مستخدماً قوته لإقامة العدل، ونصرة الضعفاء وحماية البشر من الفساد.',
      fullStory: 'ذو القرنين كان ملكاً صالحاً مكن الله له في الأرض وآتاه من كل شيء سبباً. طاف الأرض شرقاً وغرباً حتى وصل بين السدين، فوجد قوماً يعانون من طغيان وإفساد قبيلتي يأجوج ومأجوج. طلبوا منه بناء سد مقابل أجر، فرفض الأخذ قائلاً (ما مكني فيه ربي خير) وطلب مساعدتهم بالقوة والحديد والنحاس المذاب. فبنى ردماً عظيماً منيعاً. قصة ذي القرنين نموذج للحاكم العادل الصالح الذي يسخر القوة والتمكين لخدمة الخلق ونشر الخير وحفظ الحقوق.'
    }
  ],
  am: [
    {
      title: 'የዋሻው ሰዎች (አስሐቡል ካህፍ)',
      description: 'እምነታቸውን ከክህደትና ከስቃይ ለመጠበቅ ወደ ዋሻ የተጠጉ ወጣቶች ታሪክ፤ በአላህ ላይ ሙሉ እምነትና ጥገኝነት ማሳደርን ያስተምራል።',
      fullStory: 'ይህ ታሪክ በአንድ አምላክ ያመኑ ነገር ግን ጣዖት በሚያመልኩ ማህበረሰብ ውስጥ ስለኖሩ ወጣቶች ነው። ከእምነታቸው የተነሳ ሊደርስባቸው ከሚችለው መገደልና ስቃይ በመሸሽ ወደ ዋሻ ተጠጉ። አላህም በዋሻው ውስጥ ለ 309 ዓመታት እንዲተኙ አደረጋቸው። ሲነቁ ለአንድ ቀን ወይም ለግማሽ ቀን ብቻ የተኙ መሰላቸው። ይህ ተአምር እምነታቸውን የጠበቀላቸው ሲሆን በአላህ ላይ ለሚመኩ ሰዎች አላህ ከለላ መሆኑን ያስተምራል።'
    },
    {
      title: 'የሁለቱ አትክልቶች ባለቤት ታሪክ',
      description: 'ባለጸጋና ትዕቢተኛ በሆነ ሰው እና በትሑት ምእመን መካከል የተደረገን ንፅፅር የሚያሳይ ምሳሌ፤ የቁሳቁስና የትዕቢት አደገኛነትን ያስተምራል።',
      fullStory: 'ሁለት ውብ የአትክልት ስፍራዎች የነበሩት የአንድ ባለጸጋ ሰው ታሪክ ነው። በሀብቱ በመታበይ ይህ ሀብት መቼም አይጠፋም እያለ ከአኺራም ተጠራጠረ። ድሃና ምእመን የሆነው ጓደኛው ግን ለአላህ አመስጋኝ እንዲሆንና ትዕቢትን እንዲተው መከረው። በመጨረሻም አውሎ ነፋስ መጥቶ አትክልቶቹን አወደማቸው፣ ትዕቢተኛውም ሰው በቁጭትና በፀፀት ቀረ። ይህ ታሪክ ሀብት ፈተና መሆኑንና ትዕቢት ወደ ኪሳራ እንደሚመራ ያስተምራል።'
    },
    {
      title: 'ነቢዩ ሙሳ እና ኸድር (ዐ.ሰ)',
      description: 'የሰው ልጅ እውቀት ውስን መሆኑንና በአላህ ጥበብ ላይ ትዕግስት ማድረግ እንደሚያስፈልግ የሚያስተምር የእውቀት ፍለጋ ጉዞ።',
      fullStory: 'ነቢዩ ሙሳ ከአላህ ዘንድ ልዩ እውቀት የተሰጠውን የአላህን ባሪያ ኸድርን ለመገናኘት ተጓዙ። ሙሳ እውቀትን ሊማሩ እንደሚፈልጉ ሲነግሩት ኸድር ግን በትዕግስት መከተልና ምንም ጥያቄ አለመጠየቅን አስቀመጠ። ኸድር በመንገዳቸው ላይ እንግዳ የሆኑ ነገሮችን አደረገ፡ መርከቧን ቀደዳት፣ አንድ ወጣት ገደለ፣ እና ለማያስተናግዱ ሰዎች ግንብ ገነባ። ሙሳ በትዕግስት ማጣት በእያንዳንዱ ድርጊት ጠየቀው። በመጨረሻም ኸድር ከድርጊቶቹ ጀርባ የነበሩትን ድብቅ ጥበቦች ገለጸላቸው። ይህ ታሪክ የአላህ እውቀት ከሰው ልጅ እውቀት እጅግ የላቀ መሆኑን ያስተምራል።'
    },
    {
      title: 'ዙልቀርናይን',
      description: 'ስልጣኑንና ኃይሉን ፍትህን ለማስፈንና ደካሞችን ከጥቃት ለመጠበቅ የተጠቀመበት የአንድ ፃድቅ ንጉስ ታሪክ።',
      fullStory: 'ዙልቀርናይን በምድር ላይ ስልጣንና ኃይል የተሰጠው ፃድቅ ንጉስ ነበር። በምስራቅና በምዕራብ በሚያደርገው ጉዞ ከያእጁጅና ማእጁጅ ጥቃትና መከራ የሚደርስባቸውን ሰዎች አገኘ። እርዳታ ሲጠይቁት ምንም አይነት ክፍያ ሳይቀበል በአይረንና በናስ ታላቅ ግንብ በመገንባት ከጥቃት ጠበቃቸው። ታሪኩ ፍትሃዊ መሪነትንና የተሰጠንን ኃይል ለደካሞች ጥበቃ ማዋል እንደሚገባ ያስተምራል።'
    }
  ],
  har: [
    {
      title: 'ገራድ ጋሪኛች (አስሐቡል ካህፍ)',
      description: 'ኢማንዞ መቆያሊ ገራድ ጋሪኛች ኡስቲ ዘገቡ እልማጃች ቂሳ፤ አላህሊ አመን ባይነትና ኡሱል ተወኩል ያስተምራል።',
      fullStory: 'ይኽ ቂሳ አላህ አንድነትሊ ዘአመኑ ግን ጣኦት ዘአመልኩ ጀመአ ኡስቲ ዘነበሩ እልማጃች ባይነት። ቃቲ አሚን መሻና ቀትሊቢ ፈሪሀ ገራድ ጋሪ ኡስቲ ገቡ። አላህም ገራድ ጋሪ ኡስቲ 309 አመት እንዲተኙ አደረጋቸው። ሲነቁ ለአንድ ቀን ብቻ የተኙ መሰላቸው። ይኽ ተአምር እምነታቸውን የጠበቀላቸው ሲሆን በአላህ ላይ ለሚመኩ ሰዎች አላህ ከለላ መሆኑን ያስተምራል።'
    },
    {
      title: 'ሁሉት በስቲን ሶሕባ',
      description: 'ባለሀብትና ኩሩ በሆነ ሰው እና በትሑት ምእመን መካከል የተደረገን ንፅፅር የሚያሳይ ምሳሌ፤ የትዕቢት አደገኛነትን ያስተምራል።',
      fullStory: 'ሁለት ውብ የአትክልት ስፍራዎች የነበሩት የአንድ ባለጸጋ ሰው ታሪክ ነው። በሀብቱ በመታበይ ይህ ሀብት መቼም አይጠፋም እያለ ከአኺራም ተጠራጠረ። ድሃና ምእመን የሆነው ጓደኛው ግን ለአላህ አመስጋኝ እንዲሆንና ትዕቢትን እንዲተው መከረው። በመጨረሻም አውሎ ነፋስ መጥቶ አትክልቶቹን አወደማቸው፣ ትዕቢተኛውም ሰው በቁጭትና በፀፀት ቀረ። ይህ ታሪክ ሀብት ፈተና መሆኑንና ትዕቢት ወደ ኪሳራ እንደሚመራ ያስተምራል።'
    },
    {
      title: 'ነቢዩ ሙሳና ኸድር (ዐ.ሰ)',
      description: 'የሰው ልጅ እውቀት ውስን መሆኑንና በአላህ ጥበብ ላይ ትዕግስት ማድረግ እንደሚያስፈልግ የሚያስተምር የእውቀት ፍለጋ ጉዞ።',
      fullStory: 'ነቢዩ ሙሳ ከአላህ ዘንድ ልዩ እውቀት የተሰጠውን የአላህን ባሪያ ኸድርን ለመገናኘት ተጓዙ። ሙሳ እውቀትን ሊማሩ እንደሚፈልጉ ሲነግሩት ኸድር ግን በትዕግስት መከተልና ምንም ጥያቄ አለመጠየቅን አስቀመጠ። ኸድር በመንገዳቸው ላይ እንግዳ የሆኑ ነገሮችን አደረገ፡ መርከቧን ቀደዳት፣ አንድ ወጣት ገደለ፣ እና ለማያስተናግዱ ሰዎች ግንብ ገነባ። ሙሳ በትዕግስት ማጣት በእያንዳንዱ ድርጊት ጠየቀው። በመጨረሻም ኸድር ከድርጊቶቹ ጀርባ የነበሩትን ድብቅ ጥበቦች ገለጸላቸው። ይህ ታሪክ የአላህ እውቀት ከሰው ልጅ እውቀት እጅግ የላቀ መሆኑን ያስተምራል።'
    },
    {
      title: 'ዙልቀርናይን',
      description: 'ስልጣኑንና ኃይሉን ፍትህን ለማስፈንና ደካሞችን ከጥቃት ለመጠበቅ የተጠቀመበት የአንድ ፃድቅ ንጉስ ታሪክ።',
      fullStory: 'ዙልቀርናይን በምድር ላይ ስልጣንና ኃይል የተሰጠው ፃድቅ ንጉስ ነበር። በምስራቅና በምዕራብ በሚያደርገው ጉዞ ከያእጁጅና ማእጁጅ ጥቃትና መከራ የሚደርስባቸውን ሰዎች አገኘ። እርዳታ ሲጠይቁት ምንም አይነት ክፍያ ሳይቀበል በአይረንና በናስ ታላቅ ግንብ በመገንባት ከጥቃት ጠበቃቸው። ታሪኩ ፍትሃዊ መሪነትንና የተሰጠንን ኃይል ለደካሞች ጥበቃ ማዋል እንደሚገባ ያስተምራል።'
    }
  ]
};

// Localized Benefits for Surah Al-Kahf
const localizedBenefits: Record<Language, { title: string; content: string }[]> = {
  en: [],
  ar: [
    {
      title: 'نور بين الجمعتين',
      content: 'ورد في الأحاديث النبوية أن قراءة سورة الكهف يوم الجمعة تضيء للمؤمن نوراً يسطع له ما بينه وبين الجمعة الأخرى.'
    },
    {
      title: 'عصمة من فتنة الدجال',
      content: 'حفظ وقراءة أول عشر آيات (أو أواخرها) من سورة الكهف يعصم المسلم من أعظم فتن الأرض؛ فتنة المسيح الدجال.'
    },
    {
      title: 'وقت قراءتها المبارك',
      content: 'يبتدئ وقت قراءة سورة الكهف من غروب شمس يوم الخميس (ليلة الجمعة) وحتى غروب شمس يوم الجمعة.'
    }
  ],
  am: [
    {
      title: 'መንፈሳዊ ብርሃን (ኑር)',
      content: 'በሁለቱ የዓርብ ቀናት መካከል ለሚቀራው አማኝ መንፈሳዊ "ብርሃን" እንደሚሰጠው ተገልጿል።'
    },
    {
      title: 'ከደጃል ጥበቃ',
      content: 'የመጀመሪያዎቹን አስር አንቀጾች (ወይም የመጨረሻዎቹን አስር) መሀፈዝ ከደጃል (አንቲ ክራይስት) ፈተና ጥበቃን ይሰጣል።'
    },
    {
      title: 'የማንበቢያ ሰዓት',
      content: 'ከሐሙስ ምሽት (ከመግሪብ በኋላ) ጀምሮ እስከ ዓርብ ምሽት (ከመግሪብ በፊት) ባለው በማንኛውም ሰዓት ማንበብ ይቻላል።'
    }
  ],
  har: [
    {
      title: 'መንፈሳዊ ኑር (ብርሃን)',
      content: 'በሁለቱ የዓርብ ቀናት መካከል ለሚቀራው አማኝ መንፈሳዊ "ብርሃን" እንደሚሰጠው ተገልጿል።'
    },
    {
      title: 'ከደጃል ጥበቃ',
      content: 'የመጀመሪያዎቹን አስር አንቀጾች (ወይም የመጨረሻዎቹን አስር) መሀፈዝ ከደጃል (አንቲ ክራይስት) ፈተና ጥበቃን ይሰጣል።'
    },
    {
      title: 'የማንበቢያ ሰዓት',
      content: 'ከሐሙስ ምሽት (ከመግሪብ በኋላ) ጀምሮ እስከ ዓርብ ምሽት (ከመግሪብ በፊት) ባለው በማንኛውም ሰዓት ማንበብ ይቻላል።'
    }
  ]
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('friday-surah-language');
      if (saved === 'ar' || saved === 'am' || saved === 'har') return saved;
    } catch {}
    return 'en';
  });

  const [showDuaTransliteration, setShowDuaTransliterationState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dua-show-transliteration');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [showDuaTranslation, setShowDuaTranslationState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('dua-show-translation');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('friday-surah-language', lang);
      // Dispatch event to notify others
      window.dispatchEvent(new Event('language-changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const setShowDuaTransliteration = (show: boolean) => {
    setShowDuaTransliterationState(show);
    try {
      localStorage.setItem('dua-show-transliteration', String(show));
      window.dispatchEvent(new CustomEvent('dua-settings-changed', { detail: { showDuaTransliteration: show } }));
    } catch (e) {
      console.error(e);
    }
  };

  const setShowDuaTranslation = (show: boolean) => {
    setShowDuaTranslationState(show);
    try {
      localStorage.setItem('dua-show-translation', String(show));
      window.dispatchEvent(new CustomEvent('dua-settings-changed', { detail: { showDuaTranslation: show } }));
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string): string => {
    const text = translations[language]?.[key] || translations['en']?.[key] || key;
    return text;
  };

  const getTranslatedSurahs = (): SurahEntry[] => {
    if (language === 'en') return surahTableData;
    
    return surahTableData.map((surah: SurahEntry) => {
      const name = translatedSurahNames[language]?.[surah.chapter] || surah.name;
      const time = translatedTimes[language]?.[surah.time] || surah.time;
      const level = translatedLevels[language]?.[surah.level] || surah.level;
      const description = translatedDescriptions[language]?.[surah.chapter] || surah.description;
      return {
        ...surah,
        name,
        time,
        level,
        description
      };
    });
  };

  const getTranslatedThemes = (): Theme[] => {
    if (language === 'en' || !localizedThemes[language]?.length) return alKahfThemes;
    return localizedThemes[language];
  };

  const getTranslatedBenefits = () => {
    if (language === 'en' || !localizedBenefits[language]?.length) return alKahfBenefits;
    return localizedBenefits[language];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      getTranslatedSurahs, 
      getTranslatedThemes, 
      getTranslatedBenefits,
      showDuaTransliteration,
      setShowDuaTransliteration,
      showDuaTranslation,
      setShowDuaTranslation
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
