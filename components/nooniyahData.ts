export interface Verse {
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

export const nooniyahVerses: Verse[] = [
  {
    number: 1,
    arabic: "يا منزل الآيات والفرقان ... بيني وبينك حرمة القرآن",
    transliteration: "Yā munzila l-āyāti wa-l-Furqān ... Baynī wa-baynaka ḥurmatu l-Qur'ān",
    translation: {
      en: "Oh Revealer of the Verses and the Criterion, Between You and I is the sanctity of the Quran",
      ar: "يا منزل الآيات والفرقان... بيني وبينك حرمة القرآن",
      am: "የቁርኣን አንቀጾችንና ፉርቃንን ያወረድክ ሆይ! በአንተና በእኔ መካከል የቁርኣን ቅድስና አለ።",
      har: "የቁርኣን አንቀጾችንና ፉርቃንን ያወረድክ ሆይ! በአንተና በእኔ መካከል የቁርኣን ቅድስና አለ።"
    }
  },
  {
    number: 2,
    arabic: "اشرح به صدري لمعرفة الهدى ... واعصم به قلبي من الشيطان",
    transliteration: "Ishraḥ bihi ṣadrī li-ma'rifati l-hudā ... Wa-'ṣim bihi qalbī mina sh-shayṭān",
    translation: {
      en: "Open my chest with it to understand the guidance, And protect my heart with it from the Satan",
      ar: "اشرح به صدري لمعرفة الهدى... واعصم به قلبي من الشيطان",
      am: "በእርሱም መሪነትን ለማወቅ ደረቴን ክፈትልኝ፤ ልቤንም ከሰይጣን በእርሱ ጠብቅልኝ።",
      har: "በእርሱም መሪነትን ለማወቅ ደረቴን ክፈትልኝ፤ ልቤንም ከሰይጣን በእርሱ ጠብቅልኝ።"
    }
  },
  {
    number: 3,
    arabic: "يسر به أمري وأقض مآربي ... وأجر به جسدي من النيران",
    transliteration: "Yassir bihi amrī wa-qḍi ma'āribī ... Wa-ajir bihi jasadī mina n-nīrān",
    translation: {
      en: "Ease my affairs with it and settle my needs, And save my body with it from the fires",
      ar: "يسر به أمري واقض مآربي... وأجر به جسدي من النيران",
      am: "በእርሱም ጉዳዬን አቅልልኝ፣ ፍላጎቶቼንም ፈጽምልኝ፤ አካሌንም ከእሳት በእርሱ ጠብቅልኝ።",
      har: "በእርሱም ጉዳዬን አቅልልኝ፣ ፍላጎቶቼንም ፈጽምልኝ፤ አካሌንም ከእሳት በእርሱ ጠብቅልኝ።"
    }
  },
  {
    number: 4,
    arabic: "واحطط به وزري وأخلص نيتي ... واشدد به أزري وأصلح شأني",
    transliteration: "Wa-ḥṭuṭ bihi wizrī wa-akhliṣ niyyatī ... Wa-shdud bihi azrī wa-aṣliḥ sha'nī",
    translation: {
      en: "Lighten with it my load and purify my intention, And increase with it my strength and rectify my state",
      ar: "واحطط به وزري وأخلص نيتي... واشدد به أزري وأصلح شأني",
      am: "ኃጢአቴን በእርሱ አውርድልኝ፣ ኒያዬንም (ሀሳቤን) አጥርልኝ፤ በእርሱም ጀርባዬን አጠንክርልኝ፣ ሁኔታዬንም አስተካክልልኝ።",
      har: "ኃጢአቴን በእርሱ አውርድልኝ... ኒያዬንም አጥርልኝ"
    }
  },
  {
    number: 5,
    arabic: "واكشف به ضري وحقق توبتي ... واربح به بيعي بلا خسران",
    transliteration: "Wa-kshif bihi ḍurrī wa-ḥaqqiq tawbatī ... Wa-rbaḥ bihi bay'ī bilā khusrān",
    translation: {
      en: "And remove with it my harm and confirm my repentance, And make me profit from my pledge with it without any loss",
      ar: "واكشف به ضري وحقق توبتي... واربح به بيعي بلا خسران",
      am: "በእርሱም ጉዳቴን አስወግድልኝ፣ ተውባቴንም እውን አድርግልኝ፤ በእርሱም ንግዴን ያለ ኪሳራ አትርፍልኝ።",
      har: "በእርሱም ጉዳቴን አስወግድልኝ... ተውባቴንም እውን አድርግልኝ"
    }
  },
  {
    number: 6,
    arabic: "طهر به قلبي وصف سريرتي ... أجمل به ذكري وأعل مكاني",
    transliteration: "Ṭahhir bihi qalbī wa-ṣaffi sarīratī ... Ajmil bihi dhikrī wa-a'li makānī",
    translation: {
      en: "Cleanse my heart with it and purify my mind, Beautify my reputation with it and raise my rank",
      ar: "طهر به قلبي وصف سريرتي... أجمل به ذكري وأعل مكاني",
      am: "ልቤን በእርሱ አንጻልኝ፣ ውስጤንም አጥራልኝ፤ በእርሱም ዝናዬን አሳምርልኝ፣ ደረጃዬንም ከፍ አድርግልኝ።",
      har: "ልቤን በእርሱ አንጻልኝ... ውስጤንም አጥራልኝ"
    }
  },
  {
    number: 7,
    arabic: "واقطع به طمعي وشرف همتي ... كثر به ورعي وأحي جناني",
    transliteration: "Wa-qṭa' bihi ṭama'ī wa-sharrif himmatī ... Kaththir bihi wara'ī wa-aḥyi janānī",
    translation: {
      en: "Cut off my greed with it, and honour my ambitions, And increase my piety with it and give life to my heart",
      ar: "واقطع به طمعي وشرف همتي... كثر به ورعي وأحي جناني",
      am: "በእርሱም ስግብግብነቴን ቁረጥልኝ፣ ምኞቴንም አክብርልኝ፤ በእርሱም ጥንቃቄዬን አብዛልኝ፣ ልቤንም ሕያው አድርግልኝ።",
      har: "በእርሱም ስግብግብነቴን ቁረጥልኝ... ልቤንም ሕያው አድርግልኝ"
    }
  },
  {
    number: 8,
    arabic: "أسهر به ليلي وأظم جوارحي ... أسبل بفيض دموعها أجفاني",
    transliteration: "Ashir bihi laylī wa-aḍmi jawāriḥī ... Asbil bi-fayḍi dumū'ihā ajfānī",
    translation: {
      en: "Pass my night with it and make my limbs thirsty, And soak my eyelids with the flowing of its tears",
      ar: "أسهر به ليلي وأظم جوارحي... أسبل بفيض دموعها أجفاني",
      am: "ሌሊቴን በእርሱ አሳልፍልኝ፣ አካላቶቼንም አስጠማልኝ፤ የዓይን ሽፋኖቼንም በእንባዋ ጎርፍ አርጥብልኝ።",
      har: "ሌሊቴን በእርሱ አሳልፍልኝ... አካላቶቼንም አስጠማልኝ"
    }
  },
  {
    number: 9,
    arabic: "وامزجه يا رب بلحمي مع دمي ... واغسل به قلبي من الأضغان",
    transliteration: "Wa-mzug'hu yā Rabbi bi-laḥmī ma'a damī ... Wa-gsil bihi qalbī mina l-aḍghān",
    translation: {
      en: "Mix it, oh my Lord, with my flesh and blood, And wash my heart with it from grudges",
      ar: "وامزجه يا رب بلحمي مع دمي... واغسل به قلبي من الأضغان",
      am: "ጌታዬ ሆይ! ከስጋዬና ከደሜ ጋር አዋህደው፤ ልቤንም ከቂምና ከጥላቻ እጠበው።",
      har: "ጌታዬ ሆይ! ከስጋዬና ከደሜ ጋር አዋህደው... ልቤንም ከቂም እጠበው"
    }
  },
  {
    number: 10,
    arabic: "أنت الذي صورتني وخلقتني ... وهديتني لشرائع الإيمان",
    transliteration: "Anta l-ladhī ṣawwartanī wa-khalaqtanī ... Wa-hadaytanī li-sharā'i'i l-īmān",
    translation: {
      en: "You are the one who fashioned me and created me, And guided me to the laws of faith",
      ar: "أنت الذي صورتني وخَلَقْتَنِي... وهديتني لشرائع الإيمان",
      am: "አንተ የሳልከኝና የፈጠርከኝ ነህ፤ ወደ እምነትም ህጎች የመራኸኝ።",
      har: "አንተ የሳልከኝና የፈጠርከኝ ነህ... ወደ እምነትም የመራኸኝ"
    }
  },
  {
    number: 11,
    arabic: "أنت الذي علمتني ورحمتني ... وجعلت صدري واعي القرآن",
    transliteration: "Anta l-ladhī 'allamtanī wa-raḥimtanī ... Wa-ja'alta ṣadrī wā'iya l-Qur'ān",
    translation: {
      en: "You are the one who taught me and had mercy on me, And made my chest conscious of the Quran",
      ar: "أنت الذي علمتني ورحمتني... وجعلت صدري واعي القرآن",
      am: "አንተ ያስተማርከኝና ያዘንክለኝ ነህ፤ ደረቴንም የቁርኣን መያዣ ያደረግከው።",
      har: "አንተ ያስተማርከኝና ያዘንክለኝ ነህ... ደረቴንም የቁርኣን መያዣ ያደረግከው"
    }
  },
  {
    number: 12,
    arabic: "أنت الذي أطعمتني وسقيتني ... من غير كسب يد ولا دكان",
    transliteration: "Anta l-ladhī aṭ'amtanī wa-saqaytanī ... Min ghayri kasbi yadin walā dukkān",
    translation: {
      en: "You are the one who fed me and gave me drink, Without me earning it by hand or via trade",
      ar: "أنت الذي أطعمتني وسقيتني... من غير كسب يد ولا دكان",
      am: "አንተ ያበላኸኝና ያጠጣኸኝ ነህ፤ ያላንዳች የእጅ ልፋትም ሆነ ሱቅ ሳይኖረኝ።",
      har: "አንተ ያበላኸኝና ያጠጣኸኝ ነህ... ያላንዳች ልፋት"
    }
  },
  {
    number: 13,
    arabic: "وجبرتني وسترتني ونصرتني ... وغمرتني بالفضل والإحسان",
    transliteration: "Wa-jablartanī wa-satartanī wa-naṣartanī ... Wa-ghamartanī bil-faḍli wal-iḥsān",
    translation: {
      en: "And You restored me, covered me and aided me, And enveloped me in Grace and Goodness",
      ar: "وجبرتني وسترتني ونصرتني... وغمرتني بالفضل والإحسان",
      am: "አንተ የጠገንከኝ፣ የሸፈንከኝና የረዳኸኝ ነህ፤ በቸርነትህና በደግነትህ ያጥለቀለቅከኝ።",
      har: "አንተ የጠገንከኝ... በቸርነትህ ያጥለቀለቅከኝ"
    }
  },
  {
    number: 14,
    arabic: "أنت الذي آويتني وحبوتني ... وهديتني من حيرة الخذلان",
    transliteration: "Anta l-ladhī āwaytanī wa-ḥabaytanī ... Wa-hadaytanī min ḥayrati l-khidhlān",
    translation: {
      en: "You are the one who gave me refuge and awarded me, And guided me from the confusion of disappointment",
      ar: "أنت الذي آويتني وحبوتني... وهديتني من حيرة الخذلان",
      am: "አንተ መጠለያ የሰጠኸኝና የረዳኸኝ ነህ፤ ከውርደት ግራ መጋባትም የመራኸኝ።",
      har: "አንተ መጠለያ የሰጠኸኝ... የመራኸኝ"
    }
  },
  {
    number: 15,
    arabic: "وزرعت لي بين القلوب مودة ... والعطف منك برحمة وحنان",
    transliteration: "Wa-zara'ta lī bayna l-qulūbi mawaddatan ... Wa-l-'aṭfu minka bi-raḥmatin wa-ḥanān",
    translation: {
      en: "And you have planted love for me between the hearts, And the grace from you is by way of mercy and affection",
      ar: "وزرعت لي بين القلوب مودة... والعطف منك برحمة وحنان",
      am: "በልቦች መካከል ለእኔ ፍቅርን የዘራህ ነህ፤ ርኅራኄህና ደግነትህም የአንተ ችሮታ ነው።",
      har: "በልቦች መካከል ለእኔ ፍቅርን የዘራህ ነህ"
    }
  },
  {
    number: 16,
    arabic: "ونشرت لي في العالمين محاسنا ... وسترت عن أبصارهم عصياني",
    transliteration: "Wa-nasharta lī fī l-'ālamīna maḥāsinan ... Wa-satarta 'an abṣārihim 'iṣyānī",
    translation: {
      en: "And you have spread goodness out for me amongst the people, And you have hidden my disobedience from their eyes",
      ar: "ونشرت لي في العالمين محاسنا... وسترت عن أبصارهم عصياني",
      am: "በአለማት ውስጥ መልካም ዝናን የዘረጋህልኝ ነህ፤ ማመፄንም ከዓይኖቻቸው የደበቅክልኝ።",
      har: "በአለማት ውስጥ መልካም ዝናን የዘረጋህልኝ... ማመፄንም የደበቅክልኝ"
    }
  },
  {
    number: 17,
    arabic: "وجعلت ذكري في البرية شائعا ... حتى جعلت جميعهم إخواني",
    transliteration: "Wa-ja'alta dhikrī fī l-bariyyati shā'i'an ... Ḥattā ja'alta jamī'ahum ikhwānī",
    translation: {
      en: "And you have made my reputation amongst the people widespread, Until you made them all my brothers",
      ar: "وجعلت ذكري في البرية شائعا... حتى جعلت جميعهم إخواني",
      am: "በፍጥረታት መካከል ዝናዬን የተስፋፋ ያደረግክ ነህ፤ እንዲያውም ሁሉንም ወንድሞቼ ያደረግክ።",
      har: "በፍጥረታት መካከል ዝናዬን የተስፋፋ ያደረግክ"
    }
  },
  {
    number: 18,
    arabic: "والله لو علموا قبيح سريرتي ... لأبى السلام علي من يلقاني",
    transliteration: "Wa-llāhi law 'alimū qabīḥa sarīratī ... La-abā s-salāma 'alayya man yalqānī",
    translation: {
      en: "By Allah, if they knew the ugliness of my inner self, Whoever met me would refuse to greet me",
      ar: "والله لو علموا قبيح سريرتي... لأبى السلام علي من يلقاني",
      am: "በአላህ እምላለሁ! የውስጤን መጥፎ ምኞትና ሀሳብ ሰዎች ቢያውቁ ኖሮ፣ ያገኘኝ ሰው ሁሉ ሰላምታ ለመስጠት እምቢ ባለ ነበር!",
      har: "በአላህ እምላለሁ! የውስጤን መጥፎ ምኞትና ሀሳብ ሰዎች ቢያውቁ ኖሮ"
    }
  },
  {
    number: 19,
    arabic: "ولأعرضوا عني وملوا صحبتي ... ولبؤت بعد كرامة بهوان",
    transliteration: "Wa-la-a'raḍū 'annī wa-mallū ṣuḥbatī ... Wa-labu'tu ba'da karāmatin bi-hawāni",
    translation: {
      en: "And they would turn away from me and be fed up with my friendship, And I would draw disgrace on myself after honour",
      ar: "ولأعرضوا عني وملوا صحبتي... ولبؤت بعد كرامة بهوان",
      am: "ከእኔም ፊታቸውን ባዞሩ፣ ጓደኝነቴንም በሰለቹ ነበር፤ ከተከበርኩኝም በኋላ በውርደት እመለስ ነበር።",
      har: "ከእኔም ፊታቸውን ባዞሩ፣ ጓደኝነቴንም በሰለቹ ነበር"
    }
  },
  {
    number: 20,
    arabic: "لكن سترت معايبي ومثالبي ... وحلمت عن سقطي وعن طغياني",
    transliteration: "Lākin satarta ma'āyibī wa-mathālibī ... Wa-ḥalimta 'an saqṭī wa-'an ṭughyānī",
    translation: {
      en: "But you covered my flaws and defects, And you bore my sins and my tyranny",
      ar: "لكن سترت معايبي ومثالبي... وحلمت عن سقطي وعن طغياني",
      am: "ነገር ግን ጉድለቶቼንና ስህተቶቼን ሸፈንክልኝ፤ ከጥፋቴና ከመተላለፌም ታገስከኝ።",
      har: "ነገር ግን ጉድለቶቼን ሸፈንክልኝ... ታገስከኝ"
    }
  },
  {
    number: 21,
    arabic: "فلك المحامد والمدائح كلها ... بخواطري وجوارحي ولساني",
    transliteration: "Fa-laka l-maḥāmidu wa-l-madā'iḥu kulluhā ... Bi-khawāṭirī wa-jawāriḥī wa-lisānī",
    translation: {
      en: "So all Praises and thanks belong to you, With my thoughts, my limbs and my tongue",
      ar: "فلك المحامد والمدائح كلها... بخواطري وجوارحي ولساني",
      am: "ምስጋናና ውዳሴ ሁሉ ለአንተ ይገባሃል፤ በሀሳቤ፣ በአካላቶቼ እና በምላሴ።",
      har: "ምስጋናና ውዳሴ ሁሉ ለአንተ ይገባሃል"
    }
  },
  {
    number: 22,
    arabic: "ولقد مننت علي رب بأنعم ... مالي بشكر أقلهن يدان",
    transliteration: "Wa-laqad mananta 'alayya Rabbi bi-an'umin ... Mā lī bi-shukri aqallihinna yadān",
    translation: {
      en: "You have indeed, oh Lord, bestowed upon me blessings, The smallest of which I am unable give thanks for",
      ar: "ولقد مننت علي رب بأنعم... مالي بشكر أقلهن يدان",
      am: "ጌታዬ ሆይ! በእርግጥም በጸጋዎችህ ላይ ችሮታ አደረግክልኝ፤ ከእነሱም ትንሿን እንኳ ለማመስገን አቅም የለኝም።",
      har: "ጌታዬ ሆይ! በጸጋዎችህ ላይ ችሮታ አደረግክልኝ"
    }
  },
  {
    number: 23,
    arabic: "فوحق حكمتك التي آتيتني ... حتى شددت بنورها برهاني",
    transliteration: "Fa-wa-ḥaqqi ḥikmatika l-latī ātaytanī ... Ḥattā shadadta bi-nūrihā burhānī",
    translation: {
      en: "So by the truth of your wisdom which you have given me, Until You strengthened my argument by its light",
      ar: "فوحق حكمتك التي آتيتني... حتى شددت بنورها برهاني",
      am: "በሰጠኸኝ ጥበብህ እምላለሁ፤ በብርሃኗም ማረጋገጫዬን እስክታጠነክርልኝ ድረስ።",
      har: "በሰጠኸኝ ጥበብህ እምላለሁ"
    }
  },
  {
    number: 24,
    arabic: "لئن اجتبتني من رضاك معونة ... حتى تقوي أيدها إيماني",
    transliteration: "La'in ijtabatnī min riḍāka ma'ūnatan ... Ḥattā tuqawwiya ayduhā īmānī",
    translation: {
      en: "If, from Your Pleasure, I were to be selected by Your Aid, Until its power strengthened my faith",
      ar: "لئن اجتبتني من رضاك معونة... حتى تقوي أيدها إيماني",
      am: "ከውዴታህ እርዳታን ብትመርጥልኝ፤ ኃይሏም እምነቴን እስክታጠናክርልኝ ድረስ።",
      har: "ከውዴታህ እርዳታን ብትመርጥልኝ"
    }
  },
  {
    number: 25,
    arabic: "لأسبحنك بكرة وعشية ... ولتخدمنك في الدجى أركاني",
    transliteration: "La-usabbiḥannaka bukratan wa-'ashiyyatan ... Wa-la-takhdumannaka fī d-dujā arkānī",
    translation: {
      en: "[Then] surely, I will praise you day and night, And my limbs will serve you in the darkest parts of the night",
      ar: "لأسبحنك بكرة وعشية... ولتخدمنك في الدجى أركاني",
      am: "በእርግጥም ጠዋትና ማታ አመሰግንሃለሁ፤ በጨለማም አካላቶቼ ያገለግሉሃል።",
      har: "በእርግጥም ጠዋትና ማታ አመሰግንሃለሁ"
    }
  },
  {
    number: 26,
    arabic: "ولأذكرنك قائما أو قاعدا ... ولأشكرنك سائر الأحيان",
    transliteration: "Wa-la-adhkurannaka qā'iman aw qā'idan ... Wa-la-ashkurannaka sā'ira l-aḥyān",
    translation: {
      en: "I will indeed remember you whether I'm standing or sitting, And I will be thanking you the rest of the time",
      ar: "ولأذكرنك قائما أو قاعدا... ولأشكرنك سائر الأحيان",
      am: "ቆሜም ሆነ ተቀምጬ በእርግጥ አስብሃለሁ፤ በሁሉም ጊዜያትም በእርግጥ አመሰግንሃለሁ።",
      har: "ቆሜም ሆነ ተቀምጬ በእርግጥ አስብሃለሁ"
    }
  },
  {
    number: 27,
    arabic: "ولأكتمن عن البرية خلتي ... ولا شكون إليك جهد زماني",
    transliteration: "Wa-la-aktumannaka 'ani l-bariyyati khullatī ... Wa-la-ashkuwannaka ilayka jahda zamānī",
    translation: {
      en: "I shall hide my dire needs from the people, And I shall complain to you of my troubled times",
      ar: "ولأكتمن عن البرية خلتي... ولا شكون إليك جهد زماني",
      am: "ፍላጎቴን ከሰዎች በእርግጥ እደብቃለሁ፤ ለጊዜዬም አስቸጋሪነት ለአንተ ብቻ አቤት እላለሁ።",
      har: "ፍላጎቴን ከሰዎች በእርግጥ እደብቃለሁ"
    }
  },
  {
    number: 28,
    arabic: "ولأقصدنك في جميع حوائجي ... من دون قصد فلانة وفلان",
    transliteration: "Wa-la-aqṣidannaka fī jamī'i ḥawā'ijī ... Min dūni qaṣdi fulānatin wa-fulān",
    translation: {
      en: "And I shall seek you in all of my needs, Without seeking so-and-so",
      ar: "ولأقصدنك في جميع حوائجي... من دون قصد فلانة وفلان",
      am: "በሁሉም ፍላጎቶቼ ወደ አንተ ብቻ እመጣለሁ፤ እከሌንና እከሊትን ሳልፈልግ።",
      har: "በሁሉም ፍላጎቶቼ ወደ አንተ ብቻ እመጣለሁ"
    }
  },
  {
    number: 29,
    arabic: "ولأحسمن عن الأنام مطامعي ... بحسام يأس لم تشبه بنان",
    transliteration: "Wa-la-aḥsimanna 'ani l-anāmi maṭāmi'ī ... Bi-ḥusāmi ya'sin lam tushabbi'hu banān",
    translation: {
      en: "And I will surely sever my hopes from people, With the severance of despair not seen before",
      ar: "ولأحسمن عن الأنام مطامعي... بحسام يأس لم تشبه بنان",
      am: "ምኞቶቼን ከሰዎች በእርግጥ እቆርጣለሁ፤ ያላንዳች ጥርጣሬ በሆነ ተስፋ መቁረጥ ሰይፍ።",
      har: "ምኞቶቼን ከሰዎች በእርግጥ እቆርጣለሁ"
    }
  },
  {
    number: 30,
    arabic: "ولأجعلن رضاك أكبر همتي ... ولأضربن من الهوى شيطاني",
    transliteration: "Wa-la-aj'alanna riḍāka akbara himmatī ... Wa-la-aḍribanna mina l-hawā shayṭānī",
    translation: {
      en: "I shall make Your Pleasure to be my greatest ambition, And I shall indeed strike the devil out from my desires",
      ar: "ولأجعلن رضاك أكبر همتي... ولأضربن من الهوى شيطاني",
      am: "ውዴታህን ትልቁ ምኞቴ አደርገዋለሁ፤ ሰይጣኔንም ከስሜቴ አባርረዋለሁ።",
      har: "ውዴታህን ትልቁ ምኞቴ አደርገዋለሁ"
    }
  },
  {
    number: 31,
    arabic: "ولأكسون عيوب نفسي بالتقى ... ولأقبضن عن الفجور عناني",
    transliteration: "Wa-la-aksuwanna 'uyūba nafsī bit-tuqā ... Wa-la-aqbiḍanna 'ani l-fujūri 'inānī",
    translation: {
      en: "I will surely clothe the defects of my soul with the Taqwa (piety), And I will indeed hold my reins from wickedness",
      ar: "ولأكسون عيوب نفسي بالتقى... ولأقبضن عن الفجور عناني",
      am: "የነፍሴን ጉድለቶች በእርግጥ በፍራቻ እሸፍናለሁ፤ ልጓሜንም ከጥፋት በእርግጥ እይዛለሁ።",
      har: "የነፍሴን ጉድለቶች በእርግጥ እሸፍናለሁ"
    }
  },
  {
    number: 32,
    arabic: "ولأمنعن النفس عن شهواتها ... ولأجعلن الزهد من أعواني",
    transliteration: "Wa-la-amna'anna n-nafsa 'an shahawātihā ... Wa-la-aj'alanna z-zuhda min a'wānī",
    translation: {
      en: "And I will prevent my soul from its desires, And I will make Zuhd (asceticism) to be my supporter",
      ar: "ولأمنعن النفس عن شهواتها... ولأجعلن الزهد من أعواني",
      am: "ነፍሴን ከምኞቷ በእርግጥ እከለክላለሁ፤ ዝቅተኛ ኑሮንም ከረዳቶቼ አደርገዋለሁ።",
      har: "ነፍሴን ከምኞቷ በእርግጥ እከለክላለሁ"
    }
  },
  {
    number: 33,
    arabic: "ولأتلون حروف وحيك في الدجى ... ولأحرقن بنوره شيطاني",
    transliteration: "Wa-la-atluwanna ḥurūfa waḥyika fī d-dujā ... Wa-la-uḥriqanna bi-nūrihi shayṭānī",
    translation: {
      en: "I shall indeed recite the letters of your revelation in the depths of the dark, And I will burn the Shaytan (devil) with its light",
      ar: "ولأتلون حروف وحيك في الدجى... ولأحرقن بنوره شيطاني",
      am: "በጨለማ ውስጥ የወሕይህን (የራዕይህን) ቃላት በእርግጥ አነባለሁ፤ በብርሃኑም ሰይጣኔን አቃጥላለሁ።",
      har: "በጨለማ ውስጥ የወሕይህን ቃላት አነባለሁ"
    }
  },
  {
    number: 34,
    arabic: "أنت الذي يا رب قلت حروفه ... ووصفته بالوعظ والتبيان",
    transliteration: "Anta l-ladhī yā Rabbi qulta ḥurūfahu ... Wa-waṣaftahu bil-wa'ẓi wat-tibyān",
    translation: {
      en: "Oh my Lord, you are the one who uttered its letters, And you described it as an admonition and clarification",
      ar: "أنت الذي يا رب قلت حروفه... ووصفته بالوعظ والتبيان",
      am: "ጌታዬ ሆይ! ቃላቱን የተናገርከው አንተ ነህ፤ በምክርና በማብራሪያም የገለጽከው።",
      har: "ጌታዬ ሆይ! ቃላቱን የተናገርከው አንተ ነህ"
    }
  },
  {
    number: 35,
    arabic: "ونظمته ببلاغة أزلية ... تكييفها يخفى على الأذهان",
    transliteration: "Wa-na⁄amtahu bi-balāghatin azaliyyatin ... Takyīfuhā yakhfā 'alā l-adhhān",
    translation: {
      en: "And you have constructed it with eternal eloquence, The manner of which is hidden from the minds",
      ar: "ونظمته ببلاغة أزلية... تكييفها يخفى على الأذهان",
      am: "በዘላለማዊ ቅልጥፍና የደረደርከው፤ ሁኔታውም ከአእምሮ በላይ የሆነ።",
      har: "በዘላለማዊ ቅልጥፍና የደረደርከው"
    }
  },
  {
    number: 36,
    arabic: "وكتبت في اللوح الحفيظ حروفه ... من قبل خلق الخلق في أزمان",
    transliteration: "Wa-katabta fī l-lawḥi l-ḥafī⁄i ḥurūfahu ... Min qabli khalqi l-khalqi fī azmān",
    translation: {
      en: "And you have written its letters in the preserved Tablet, Before creating the creation aforetime",
      ar: "وكتبت في اللوح الحفيظ حروفه... من قبل خلق الخلق في أزمان",
      am: "ከፍጥረታት መፈጠር በፊት በሉውሐል መሕፉዝ (በተጠበቀው ሰሌዳ) ላይ ቃላቱን የጻፍከው።",
      har: "በሉውሐል መሕፉዝ ላይ የጻፍከው"
    }
  },
  {
    number: 37,
    arabic: "فالله ربي لم يزل متكلما ... حقا إذا ما شاء ذو إحسان",
    transliteration: "Fa-llāhu Rabbī lam yazal mutakalliman ... Ḥaqqan idhā mā shā'a dhū iḥsān",
    translation: {
      en: "So Allah, my Lord, has not ceased to speak, Indeed if he wills; owner of Great Generosity",
      ar: "فالله ربي لم يزل متكلما... حقا إذا ما شاء ذو إحسان",
      am: "ጌታዬ አላህ ሁልጊዜም ተናጋሪ ነው፤ በፈለገ ጊዜ በእውነት ደግነትን የሚያደርግ።",
      har: "ጌታዬ አላህ ሁልጊዜም ተናጋሪ ነው"
    }
  },
  {
    number: 38,
    arabic: "نادى بصوت حين كلم عبده ... موسى فأسمعه بلا كتمان",
    transliteration: "Nādā bi-ṣawtin ḥīna kallama 'abdahu ... Mūsā fa-asma'ahu bilā kitmān",
    translation: {
      en: "He called out with his Voice when he called his servant, Moses; and so he caused him to hear without any obscurity",
      ar: "نادى بصوت حين كلم عبده... موسى فأسمعه بلا كتمان",
      am: "ባሪያውን ሙሳን ባናገረው ጊዜ በድምፅ ጠራው፤ ያላንዳች መደበቅም እንዲሰማው አደረገው።",
      har: "ባሪያውን ሙሳን ባናገረው ጊዜ ጠራው"
    }
  },
  {
    number: 39,
    arabic: "وكذا ينادي في القيامة ربنا ... جهرا فيسمع صوته الثقلان",
    transliteration: "Wa-kadhā yunādī fī l-qiyāmati Rabbunā ... Jahran fa-yasma'u ṣawtahu th-thaqalān",
    translation: {
      en: "And likewise our Lord shall call on the day of Resurrection, Loudly, and the two weighty beings [Mankind and Jinnkind] shall hear his voice",
      ar: "وكذا ينادي في القيامة ربنا... جهرا فيسمع صوته الثقلان",
      am: "እንዲሁም በትንሳኤ ቀን ጌታችን በይፋ ይጠራል፤ ድምጹንም የሰውና የጂን ወገኖች ይሰማሉ።",
      har: "እንዲሁም በትንሳኤ ቀን ይጠራል"
    }
  },
  {
    number: 40,
    arabic: "أن يا عبادي أنصتوا لي واسمعوا ... قول الإله المالك الديان",
    transliteration: "An yā 'ibādī anṣitū lī wa-sma'ū ... Qawla l-ilāhi l-Māliki d-Dayyān",
    translation: {
      en: "That 'Oh my servants, pay attention to me and listen, To the Word of God, the King and Judge!'",
      ar: "أن يا عبادي أنصتوا لي واسمعوا... قول الإله المالك الديان",
      am: "«ባሮቼ ሆይ! አዳምጡኝ፣ ስሙኝም፤ የንጉሡና የፈራጁን የአምላክን ቃል» በማለት።",
      har: "ባሮቼ ሆይ! አዳምጡኝ፣ ስሙኝም"
    }
  },
  {
    number: 41,
    arabic: "هذا حديث نبينا عن ربه ... صدقا بلا كذب ولا بهتان",
    transliteration: "Hādhā ḥadīthu nabiyyinā 'an Rabbihi ... Ṣidqan bilā kadhibin walā buhtān",
    translation: {
      en: "This is the speech of our Prophet about his Lord, In truth, without any lie or falsehood",
      ar: "هذا حديث نبينا عن ربه... صدقا بلا كذب ولا بهتان",
      am: "ይህ የነቢያችን ንግግር ነው ከጌታቸው የዘገቡት፤ በእውነት፣ ያለ ውሸትና ያለ ቅጥፈት።",
      har: "ይህ የነቢያችን ንግግር ነው"
    }
  },
  {
    number: 42,
    arabic: "لسنا نشبه صوته بكلامنا ... إذ ليس يدرك وصفه بعيان",
    transliteration: "Lasnā nushabbihu ṣawtahu bi-kalāminā ... Idh laysa yudraku waṣfuhu bi-'iyān",
    translation: {
      en: "We do not liken His voice to our speech, For his description can not be understood by sight",
      ar: "لسنا نشبه صوته بكلامنا... إذ ليس يدرك وصفه بعيان",
      am: "ድምፁን ከንግግራችን ጋር አናመሳስለውም፤ ባህሪው በአይን አይታወቅምና።",
      har: "ድምፁን ከንግግራችን ጋር አናመሳስለውም"
    }
  },
  {
    number: 43,
    arabic: "لا تحصر الأوهام مبلغ ذاته ... أبدا ولا يحويه قطر مكان",
    transliteration: "Lā taḥṣuru l-awhāmu mablagha dhātihi ... Abadan walā yaḥwīhi quṭru makān",
    translation: {
      en: "Minds can never encompass the extent of his being, And no diameter of any place can contain him",
      ar: "لا تحصر الأوهام مبلغ ذاته... أبدا ولا يحويه قطر مكان",
      am: "ሀሳቦች የባህሪውን ጥልቀት በፍፁም ሊያውቁ አይችሉም፤ የትኛውም ቦታም ሊይዘው አይችልም።",
      har: "የትኛውም ቦታም ሊይዘው አይችልም"
    }
  },
  {
    number: 44,
    arabic: "وهو المحيط بكل شيء علمه ... من غير إغفال ولا نسيان",
    transliteration: "Wa-huwa l-muḥīṭu bi-kulli shay'in 'ilmuhu ... Min ghayri ighfālin walā nisyān",
    translation: {
      en: "He is the one whose knowledge encompasses all things, Without heedlessness or any forgetfulness",
      ar: "وهو المحيط بكل شيء علمه... من غير إغفال ولا نسيان",
      am: "እርሱ እውቀቱ ሁሉንም ነገር ያካበበ ነው፤ ያላንዳች መርሳትና መዘንጋት።",
      har: "እርሱ እውቀቱ ሁሉንም ነገር ያካበበ ነው"
    }
  },
  {
    number: 45,
    arabic: "من ذا يكيف ذاته وصفاته ... وهو القديم مكون الأكوان",
    transliteration: "Man dhā yukayyifu dhātahu wa-ṣifātahu ... Wa-huwa l-qadīmu mukawwinu l-akwān",
    translation: {
      en: "And who can attempt to describe his essence or his attributes, When he is the Pre-eternal, creator of all existence?",
      ar: "من ذا يكيف ذاته وصفاته... وهو القديم مكون الأكوان",
      am: "እርሱ ቀዳሚና የአለማት ፈጣሪ ሆኖ ሳለ፣ ማን ነው ባህሪውን ለመግለጽ የሚሞክረው?",
      har: "ማን ነው ባህሪውን ለመግለጽ የሚሞክረው?"
    }
  },
  {
    number: 46,
    arabic: "سبحانه ملكا على العرش استوى ... وحوى جميع الملك والسلطان",
    transliteration: "Subḥānahu malikan 'alā l-'arshi stawā ... Wa-ḥawā jamī'a l-mulki was-sulṭān",
    translation: {
      en: "Glory be to him, a King who rose over his Throne, And who has gathered all the dominion and authority",
      ar: "سبحانه ملكا على العرش استوى... وحوى جميع الملك والسلطان",
      am: "ጥራት ይገባው! በዐርሹ ላይ ከፍ ያለ ንጉሥ፤ ግዛትንና ስልጣንን ሁሉ የያዘ።",
      har: "በዐرሹ ላይ ከፍ ያለ ንጉሥ"
    }
  },
  {
    number: 47,
    arabic: "وكلامه القرآن أنزل آيه ... وحيا على المبعوث من عدنان",
    transliteration: "Wa-kalāmuhu l-Qur'ānu anzala āyahu ... Waḥyan 'alā l-mab'ūthi min 'Adnān",
    translation: {
      en: "His Speech is the Qur'an whose verses He has revealed, As a revelation to the one sent from Adnan",
      ar: "وكلامه القرآن أنزل آيه... وحيا على المبعوث من عدنان",
      am: "ቃሉ ቁርኣን ነው፣ አንቀጾቹን ያወረደው፤ ከዓድናን ወገን ለተላኩት ነቢይ በወሕይ (በራዕይ)።",
      har: "ቃሉ ቁርኣን ነው"
    }
  },
  {
    number: 48,
    arabic: "صلى عليه الله خير صلاته ... ما لاح في فلكيهما القمران",
    transliteration: "Ṣallā 'alayhi llāhu khayra ṣalātihi ... Mā lāḥa fī falakayhimā l-qamarān",
    translation: {
      en: "May Allah send him his best blessings, So long as the sun and the moon are present in their orbits",
      ar: "صلى عليه الله خير صلاته... ما لاح في فلكيهما القمران",
      am: "የአላህ ሰላትና ሰላም በእርሱ ላይ ይሁን፤ ፀሐይና ጨረቃ በምህዋራቸው ውስጥ እስካሉ ድረስ።",
      har: "የአላህ ሰላትና ሰላም በእርሱ ላይ ይሁን"
    }
  },
  {
    number: 49,
    arabic: "هو جاء بالقرآن من عند الذي ... لا تعتريه نوائب الحدثان",
    transliteration: "Huwa jā'a bil-Qur'āni min 'indi l-ladhī ... Lā ta'tarīhi nawā'ibu l-hadathān",
    translation: {
      en: "He came with the Qur'an from the one who, Cannot be affected by the misfortunes of time",
      ar: "هو جاء بالقرآن من عند الذي... لا تعتريه نوائب الحدثان",
      am: "እርሱ ቁርኣንን ይዞ የመጣው ከእርሱ ዘንድ ነው፤ የጊዜ መለዋወጥ ከማይነካው ጌታ።",
      har: "እርሱ ቁርኣንን ይዞ የመጣው ከእርሱ ዘንድ ነው"
    }
  },
  {
    number: 50,
    arabic: "تنزيل رب العالمين ووحيه ... بشهادة الأخبار والرهبان",
    transliteration: "Tanzīlu Rabbi l-'ālamīna wa-waḥyuhu ... Bi-shahādati l-akhbāri war-ruhbān",
    translation: {
      en: "It is the Revelation of the Lord of the Worlds and His revelation, With the testimony of the Rabbis and the Priests",
      ar: "تنزيل رب العالمين ووحيه... بشهادة الأخبار والرهبان",
      am: "እርሱ የአለማቱ ጌታ መውረድና ወሕይ ነው፤ በሊቃውንትና በረባናን ምስክርነት።",
      har: "እርሱ የአለማቱ ጌታ መውረድና ወሕይ ነው"
    }
  },
  {
    number: 51,
    arabic: "وكلام ربي لا يجيء بمثله ... أحد ولو جمعت له الثقلان",
    transliteration: "Wa-kalāmu Rabbī lā yajī'u bi-mithlihi ... Aḥadun walaw jumi'at lahu th-thaqalān",
    translation: {
      en: "And the speech of my Lord, none can bring like it, Even if the two weighty beings [Mankind and Jinnkind] were to come together to achieve that",
      ar: "وكلام ربي لا يجيء بمثله... أحد ولو جمعت له الثقلان",
      am: "የጌታዬን ቃል የሚመስል ማንም ሊያመጣ አይችልም፤ የሰውና የጂን ወገን ቢሰበሰቡ እንኳ።",
      har: "የጌታዬን ቃል የሚመስል ማንም ሊያመጣ አይችልም"
    }
  },
  {
    number: 52,
    arabic: "وهو المصون من الأباطيل كلها ... ومن الزيادة فيه والنقصان",
    transliteration: "Wa-huwa l-maṣūnu mina l-abāṭīli kullihā ... Wa-mina z-ziyādati fīhi wan-nuqṣān",
    translation: {
      en: "And it is protected from every single falsehood, And from addition to it and subtraction from it",
      ar: "وهو المصون من الأباطيل كلها... ومن الزيادة فيه والنقصان",
      am: "እርሱ ከጥፋት ሁሉ የተጠበቀ ነው፤ ከመጨመርም ሆነ ከመቀነስ።",
      har: "እርሱ ከጥፋት ሁሉ የተጠበቀ ነው"
    }
  },
  {
    number: 53,
    arabic: "من كان يزعم أن يباري نظمه ... ويراه مثل الشعر والهذيان",
    transliteration: "Man kāna yaz'umu an yubāriya na⁄mahu ... Wa-yarāhu mithla sh-shi'ri wal-hadayān",
    translation: {
      en: "Whoever claims that he can challenge its construction, And sees it to be like poetry or senseless chatter",
      ar: "من كان يزعم أن يباري نظمه... ويراه مثل الشعر والهذيان",
      am: "አወራረዱን እወዳደራለሁ የሚል፤ እንደ ግጥምና ቅዠት የሚመለከተው።",
      har: "እንደ ግጥምና ቅዠት የሚመለከተው"
    }
  },
  {
    number: 54,
    arabic: "فليأت منه بسورة أو آية ... فإذا رأى النظمين يشتبهان",
    transliteration: "Fal-ya'ti minhu bi-sūratin aw āyatin ... Fa-idhā ra'ā n-na⁄mayni yashtabihān",
    translation: {
      en: "Then let him bring a single chapter or verse from himself, And if he sees the two constructions to be the similar",
      ar: "فليأت منه بسورة أو آية... فإذا رأى النظمين يشتبهان",
      am: "ከእርሱ ዘንድ አንዲትን ምዕራፍ ወይም አንቀጽ ያምጣ፤ ሁለቱ አገላለጾች ይመሳሰላሉ ብሎ ካሰበ።",
      har: "አንዲትን ምዕራፍ ወይም አንቀጽ ያምጣ"
    }
  },
  {
    number: 55,
    arabic: "فليتفرد باسم الألوهة وليكن ... رب البرية وليقل سبحاني",
    transliteration: "Fal-yanfarid bi-smi l-ulūhati wal-yakun ... Rabba l-bariyyati wal-yaqul subḥānī",
    translation: {
      en: "Then let him single himself out with the divine name and let him be, The Lord of people, and let him say: 'Glory to me!'",
      ar: "فليتفرد باسم الألوهة وليكن... رب البرية وليقل سبحاني",
      am: "በአምላክነት ስም ብቻውን ይሁን፣ የፍጥረታትም ጌታ ይሁን፤ «ክብር ለእኔ ይሁን» ይበል።",
      har: "«ክብር ለእኔ ይሁን» ይበል"
    }
  },
  {
    number: 56,
    arabic: "فإذا تناقض نظمه فليلبسن ... ثوب النقيصة صاغرا بهوان",
    transliteration: "Fa-idhā tanāqaḍa na⁄muhu fal-yalbasan ... Thawba n-naqīṣati ṣāghiran bi-hawān",
    translation: {
      en: "But if his construction is different, then let him wear, The garments of failure, belittled by humiliation",
      ar: "فإذا تناقض نظمه فليلبسن... ثوب النقيصة صاغرا بهوان",
      am: "ነገር ግን ንግግሩ ከተቃረነ፤ የውርደትን ልብስ ተዋርዶ ይልበስ።",
      har: "የውርደትን ልብስ ተዋርዶ ይልበስ"
    }
  },
  {
    number: 57,
    arabic: "أو فليقر بأنه تنزيل من ... سماه في نص الكتاب مثاني",
    transliteration: "Aw fal-yuqirra bi-annahu tanzīlu man ... Sammāhu fī naṣṣi l-kitābi mathānī",
    translation: {
      en: "Or let him admit that it is a Revelation of the one who, Named it 'Mathani' (Oft-repeated) in His Book",
      ar: "أو فليقر بأنه تنزيل من... سماه في نص الكتاب مثاني",
      am: "ወይም ደግሞ በቁርኣን ውስጥ «መጣኒ» (ተደጋጋሚ) ብሎ የሰየመው ጌታ መውረዱን ያረጋግጥ።",
      har: "የሰየመው ጌታ መውረዱን ያረጋግጥ"
    }
  },
  {
    number: 58,
    arabic: "لا ريب فيه بأنه تنزيله ... وبداية التنزيل في رمضان",
    transliteration: "Lā rayba fīhi bi-annahu tanzīluhu ... Wa-bidāyatu t-tanzīli fī Ramaḍān",
    translation: {
      en: "There is no doubt that it is his Revelation, And the start of the Revelation was in Ramadan",
      ar: "لا ريب فيه بأنه تنزيله... وبداية التنزيل في رمضان",
      am: "እርሱ መውረዱ መሆኑን ጥርጥር የለውም፤ የመውረዱም መጀመሪያ በረመዳን ወር ነበር።",
      har: "የመውረዱም መጀመሪያ በረመዳን ወር ነበር"
    }
  },
  {
    number: 59,
    arabic: "الله فضله وأحكم آيه ... وتلاه تنزيلا بلا ألحان",
    transliteration: "Allāhu faḍḍalahu wa-aḥkama āyahu ... Wa-talāhu tanzīlan bilā alḥān",
    translation: {
      en: "Allah explained it in detail and clarified its verses, And recited it as a Revelation without any mistakes",
      ar: "الله فضله وأحكم آيه... وتلاه تنزيلا بلا ألحان",
      am: "አላህ አበላለጠው፣ አንቀጾቹንም አረጋገጠ፤ ያላንዳች ስህተትም አወረደው።",
      har: "አላህ አበላለጠው... ያላንዳች ስህተትም አወረደው"
    }
  },
  {
    number: 60,
    arabic: "هو قوله وكلامه وخطابه ... بفصاحة وبلاغة وبيان",
    transliteration: "Huwa qawluhu wa-kalāmuhu wa-khiṭābuhu ... Bi-faṣāḥatin wa-balāghatin wa-bayān",
    translation: {
      en: "It is his word, and his speech, and his addressing, With eloquence, articulacy, and clarity",
      ar: "هو قوله وكلامه وخطابه... بفصاحة وبلاغة وبيان",
      am: "እርሱ ቃሉ፣ ንግግሩና መልእክቱ ነው፤ በግልጽነት፣ በቅልጥፍናና በማብራሪያ።",
      har: "እርሱ ቃሉ፣ ንግግሩና መልእክቱ ነው"
    }
  },
  {
    number: 61,
    arabic: "هو حكمه هو علمه هو نوره ... وصراطه الهادي إلى الرضوان",
    transliteration: "Huwa ḥukmuhu huwa 'ilmuhu huwa nūruhu ... Wa-ṣirāṭuhu l-hādī ila r-riḍwān",
    translation: {
      en: "It is his Judgement, it is his Knowledge, it is his Light, And it is his Path which guides to his approval",
      ar: "هو حكمه هو علمه هو نوره... وصراطه الهادي إلى الرضوان",
      am: "እርሱ ፍርዱ ነው፣ እውቀቱ ነው፣ ብርሃኑ ነው፤ ወደ ውዴታው የሚመራው ቀጥተኛው መንገድ።",
      har: "እርሱ ፍርዱ ነው፣ እውቀቱ ነው"
    }
  },
  {
    number: 62,
    arabic: "جمع العلوم دقيقها وجليلها ... فيه يصول العالم الرباني",
    transliteration: "Jama'a l-'ulūma daqīqahā wa-jalīlahā ... Fīhi yaṣūlu l-'ālimu r-rabbānī",
    translation: {
      en: "[In it] He gathered all Sciences; the subtle and the great, And [hence] the righteous scholar delves into them",
      ar: "جمع العلوم دقيقها وجليلها... فيه يصول العالم الرباني",
      am: "እውቀቶችን ሁሉ ሰበሰበ፤ ረቂቁንና ታላቁን፤ በእርሱም ውስጥ ረባኒይ ሊቅ ይመራመራል።",
      har: "እውቀቶችን ሁሉ ሰበሰበ"
    }
  },
  {
    number: 63,
    arabic: "قصص على خير البرية قصه ... ربي فأحسن أيما إحسان",
    transliteration: "Qaṣaṣun 'alā khayri l-bariyyati qaṣṣahu ... Rabbī fa-aḥsana ayyamā iḥsān",
    translation: {
      en: "[What great] Stories he narrated to the best of creation (Prophet), My Lord [narrated them] and in perfection did He do so",
      ar: "قصص على خير البرية قصه... ربي فأحسن أيما إحسان",
      am: "በፍጥረታት ሁሉ በላጭ ላይ ታሪኮችን ተረከ፤ ጌታዬ እጅግ በጣም መልካም አድርጎ።",
      har: "በፍጥረታት ሁሉ በላጭ ላይ ታሪኮችን ተረከ"
    }
  },
  {
    number: 64,
    arabic: "وأبان فيه حلاله وحرامه ... ونهى عن الآثام والعصيان",
    transliteration: "Wa-abāna fīhi ḥalālahu wa-ḥarāmahu ... Wa-nahā 'ani l-āthāmi wal-'iṣyān",
    translation: {
      en: "And He clarified his halal and his haram in it, And he forbade from all sins and disobedience",
      ar: "وأبان فيه حلاله وحرامه... ونهى عن الآثام والعصيان",
      am: "በእርሱም ውስጥ ሐላሉንና ሐራሙን ግልጽ አደረገ፤ ከወንጀልና ከማመፅም ከለከለ።",
      har: "በእርሱም ውስጥ ሐላሉንና ሐራሙን ግልጽ አደረገ"
    }
  },
  {
    number: 65,
    arabic: "من قال إن الله خالق قوله ... فقد استحل عبادة الأوثان",
    transliteration: "Man qāla inna llāha khāliqu qawlihi ... Fa-qadi staḥalla 'ibādata l-awthān",
    translation: {
      en: "Whoever says that Allah is the creator of his word, Then he has made worshiping idols lawful",
      ar: "من قال إن الله خالق قوله... فقد استحل عبادة الأوثان",
      am: "«አላህ ንግግሩን ፈጣሪ ነው» ያለ ሰው፤ ጣኦታትን ማምለክን እንደ መፍቀድ ተቆጥሯል።",
      har: "ጣኦታትን ማምለክን እንደ መፍቀድ ተቆጥሯል"
    }
  },
  {
    number: 66,
    arabic: "من قال فيه عبارة وحكاية ... فغدا يجرع من حميم آن",
    transliteration: "Man qāla fīhi 'ibāratun wa-ḥikāyatun ... Fa-ghadan yujarra'u min ḥamīmin āni",
    translation: {
      en: "Whoever says [the Quran] is a narration or expression [of what he said], Then tomorrow, he will be forced to drink from the boiling water",
      ar: "من قال فيه عبارة وحكاية... فغدا يجرع من حميم آن",
      am: "ቁርኣን ተረትና ታሪክ ነው ያለ ሰው፤ ነገ በጀሀነም የፈላውን ውሃ እንዲጠጣ ይገደዳል።",
      har: "ነገ በጀሀነም የፈላውን ውሃ እንዲጠጣ ይገደዳል"
    }
  },
  {
    number: 67,
    arabic: "من قال إن حروفه مخلوقة ... فالعنه ثم اهجره كل أوان",
    transliteration: "Man qāla inna ḥurūfahu makhlūqatun ... Fa-l'anhu thumma hgurhu kulla awān",
    translation: {
      en: "Whoever says that its letters are created, Then curse him and abandon him at all times",
      ar: "من قال إن حروفه مخلوقة... فالعنه ثم اهجره كل أوان",
      am: "«ፊደላቱ የተፈጠሩ ናቸው» ያለ ሰው፤ እርገመው፣ በሁሉም ጊዜያትም ራቀው።",
      har: "እርገመው... ራቀው"
    }
  },
  {
    number: 68,
    arabic: "لا تلق مبتدعا ولا متزندقا ... إلا بعبسة مالك الغضبان",
    transliteration: "Lā talqa mubtadi'an walā mutazandiqan ... Illā bi-'absati Māliki l-ghaḍbān",
    translation: {
      en: "Do not meet any innovator or a heretic, Except with the frown of the angry Maalik (Guardian of Hell-fire)",
      ar: "لا تلق مبتدعا ولا متزندقا... إلا بعبسة مالك الغضبان",
      am: "ቢድዐ አድራጊን ወይም ከሃዲን አትገናኝ፤ በቁጣ በተሞላው የቀብሩ ጠባቂ ማሊክ ፊት እንጂ።",
      har: "ቢድዐ አድራጊን ወይም ከሃዲን አትገናኝ"
    }
  },
  {
    number: 69,
    arabic: "والوقف في القرآن خبث باطل ... وخداع كل مذبذب حيران",
    transliteration: "Wal-waqfu fī l-Qur'āni khubthun bāṭilun ... Wa-khidā'u kulli mudhabdhabin ḥayrān",
    translation: {
      en: "And waqf (skepticism about it being created or uncreated) about the Quran is a false wickedness, And it is the deception of every confused skeptic",
      ar: "والوقف في القرآن خبث باطل... وخداع كل مذبذب حيران",
      am: "በቁርኣን ጉዳይ ላይ ማመንታት ፍጹም ከንቱነት ነው፤ የግራ የተጋባ ተጠራጣሪ ማታለያ።",
      har: "የግራ የተጋባ ተጠራጣሪ ማታለያ"
    }
  },
  {
    number: 70,
    arabic: "قل غير مخلوق كلام إلهنا ... واعجل ولا تك في الإجابة واني",
    transliteration: "Qul ghayra makhlūqin kalāmu ilāhinā ... Wa-'jal walā taku fī l-ijābati wānī",
    translation: {
      en: "Say uncreated is the speech of our God, Hasten and do not be slack in answering",
      ar: "قل غير مخلوق كلام إلهنا... واعجل ولا تك في الإجابة واني",
      am: "«የአምላካችን ቃል ያልተፈጠረ ነው» በል፤ ፍጠን፣ ለመመለስም አትታክት።",
      har: "«የአምላካችን ቃል ያልተፈጠረ ነው» በል"
    }
  },
  {
    number: 71,
    arabic: "أهل الشريعة أيقنوا بنزوله ... والقائلون بخلقه شكلان",
    transliteration: "Ahlu sh-shari'ati ayqanū bi-nuzūlihi ... Wal-qā'ilūna bi-khalqihi shiklān",
    translation: {
      en: "The people of Sharia gained certainty of its revelation, And those who say that it's created are two types",
      ar: "أهل الشريعة أيقنوا بنزوله... والقائلون بخلقه شكلان",
      am: "የሸሪዓው ሰዎች መውረዱን በእርግጠኝነት ያውቃሉ፤ «ተፈጥሯል» የሚሉት ግን ሁለት አይነት ናቸው።",
      har: "«ተፈጥሯል» የሚሉት ግን ሁለት አይነት ናቸው"
    }
  },
  {
    number: 72,
    arabic: "وتجنب اللفظين إن كليهما ... ومقال جهم عندنا سيان",
    transliteration: "Wa-tajannabi l-laf⁄ayni inna kilayhimā ... Wa-maqālu Jahmin 'indanā siyān",
    translation: {
      en: "And stay away from both of the terms for both of them, And the statement of the Jahmis is the same to us",
      ar: "وتجنب اللفظين إن كليهما... ومقال جهم عندنا سيان",
      am: "ሁለቱንም ቃላት አስወግድ፤ የጀህሚያዎችም አባባል በእኛ ዘንድ አንድ አይነት ነው።",
      har: "ሁለቱንም ቃላት አስወግድ"
    }
  },
  {
    number: 73,
    arabic: "يا أيها السني خذ بوصيتي ... واخصص بذلك جملة الإخوان",
    transliteration: "Yā ayyuhā s-Sunniyyu khudh bi-waṣiyyatī ... Wa-khṣuṣ bi-dhālika jumlata l-ikhwān",
    translation: {
      en: "Oh sunni, take my advice, And dedicate this to a group of your brothers",
      ar: "يا أيها السني خذ بوصيتي... واخصص بذلك جملة الإخوان",
      am: "አንተ የሱና ተከታይ ሆይ! ምክሬን ያዝ፤ ይህንንም ለወንድሞችህ ሁሉ አስተላልፍ።",
      har: "አንተ የሱና ተከታይ ሆይ! ምክሬን ያዝ"
    }
  },
  {
    number: 74,
    arabic: "واقبل وصية مشفق متودد ... واسمع بفهم حاضر يقظان",
    transliteration: "Wa-qbal waṣiyyata mushfiqin mutawaddidin ... Wa-sma' bi-fahmin ḥā⁄irin yaq⁄ān",
    translation: {
      en: "Accept the advice of a kind-hearted and compassionate one, And listen with a present and awake understanding",
      ar: "واقبل وصية مشفق متودد... واسمع بفهم حاضر يقظان",
      am: "የአዛኝና አሳቢን ሰው ምክር ተቀበል፤ በተዘጋጀና በነቃ አእምሮ ስማ።",
      har: "የአዛኝና አሳቢን ሰው ምክር ተቀበል"
    }
  },
  {
    number: 75,
    arabic: "كن في أمورك كلها متوسطا ... عدلا بلا نقص ولا رجحان",
    transliteration: "Kun fī umūrika kullihā mutawassiṭan ... 'Adlan bilā naqṣin walā rujḥān",
    translation: {
      en: "Be in all of your matters, moderate, Just, without any shortage or bias",
      ar: "كن في أمورك كلها متوسطا... عدلا بلا نقص ولا رجحان",
      am: "በሁሉም ጉዳዮችህ ላይ መካከለኛ ሁን፤ ፍትሃዊ፣ ያላንዳች ጉድለት ወይም መብለጥ።",
      har: "በሁሉም ጉዳዮችህ ላይ መካከለኛ ሁን"
    }
  },
  {
    number: 76,
    arabic: "واعلم بأن الله رب واحد ... منزه عن ثالث أو ثان",
    transliteration: "Wa-l'am bi-anna llāha Rabbun wāḥidun ... Mutanazzihun 'an thālithin aw thānī",
    translation: {
      en: "And know that Allah is a single Lord, Transcendent from being three or two",
      ar: "واعلم بأن الله رب واحد... منزه عن ثالث أو ثان",
      am: "አላህ አንድ ጌታ መሆኑን እወቅ፤ ከሶስተኛም ሆነ ከሁለተኛ የጠራ።",
      har: "አላህ አንድ ጌታ መሆኑን እወቅ"
    }
  },
  {
    number: 77,
    arabic: "الأول المبدي بغير بداية ... والآخر المفني وليس بفان",
    transliteration: "Al-awwalu l-mubdī bi-ghayri bidāyatin ... Wa-l-ākhiru l-mufnī wa-laysa bi-fānī",
    translation: {
      en: "The first, the Originator without any beginning, The last, the Annihilator, yet he does not perish",
      ar: "الأول المبدي بغير بداية... والآخر المفني وليس بفان",
      am: "ቀዳሚው ያለ ጅምር የጀመረው፤ መጨረሻውም የሚያጠፋው ነገር ግን የማይጠፋው።",
      har: "ቀዳሚው ያለ ጅምር የጀመረው"
    }
  },
  {
    number: 78,
    arabic: "وكلامه صفة له وجلاله ... منه بلا أمد ولا حدثان",
    transliteration: "Wa-kalāmuhu ṣifatun lahu wa-jalāluhu ... Minhu bilā amadin walā ḥadathān",
    translation: {
      en: "And his speech is an attribute to him and his glory, From him without any duration or occurrence",
      ar: "وكلامه صفة له وجلاله... منه بلا أمد ولا حدثان",
      am: "ንግግሩ ለእርሱ ባህሪና ልዕልናው ነው፤ ከእርሱ ዘንድ ያለ ወሰንና ያለ ጅማሬ።",
      har: "ንግግሩ ለእርሱ ባህሪና ልዕልናው ነው"
    }
  },
  {
    number: 79,
    arabic: "ركن الديانة أن تصدق بالقضا ... لا خير في بيت بلا أركان",
    transliteration: "Ruknu d-diyānati an tuṣaddiqa bil-qaḍā ... Lā khayra fī baytin bilā arkān",
    translation: {
      en: "A pillar of religion is to believe in Qadha (fate), There is no good in a house without pillars",
      ar: "ركن الديانة أن تصدق بالقضا... لا خير في بيت بلا أركان",
      am: "የእምነት ዋልታ በቀደር (በአላህ ውሳኔ) ማመን ነው፤ ዋልታ በሌለው ቤት ውስጥ ምንም መልካም ነገር የለም።",
      har: "የእምነት ዋልታ በቀደር ማመን ነው"
    }
  },
  {
    number: 80,
    arabic: "الله قد علم السعادة والشقاء ... وهما ومنزلتاهما ضدان",
    transliteration: "Allāhu qad 'alima s-sa'ādata wash-shaqā ... Wa-humā wa-manzilatāhumā ḍiddān",
    translation: {
      en: "Allah already knows the happiness or misery, And they both and their positions are opposites",
      ar: "الله قد علم السعادة والشقاء... وهما ومنزلتاهما ضدان",
      am: "አላህ ደስታንና ስቃይን አስቀድሞ ያውቃል፤ እነሱም ሆኑ ደረጃቸው ተቃራኒዎች ናቸው።",
      har: "አላህ ደስታንና ስቃይን አስቀድሞ ያውቃል"
    }
  }
];
