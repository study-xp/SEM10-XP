import React, { useState, useEffect, useRef } from "react";

/* ============================================================================
   ADHKAR.EXE — standalone module.
   ============================================================================ */

export const ADHKAR_APP_ENTRY = { title: "Adhkar.exe", icon: "📿", w: 460, h: 600 };

const ADHKAR_SETTINGS_VERSION = "adhkar-popup-settings-v2";
function readPopupMinutes(defaultMinutes = 10) {
  const saved = localStorage.getItem("adhkar-popup-minutes");
  if (saved === null) return defaultMinutes;
  const n = Number(saved);
  if (!localStorage.getItem(ADHKAR_SETTINGS_VERSION) && n === 0) return defaultMinutes;
  return Number.isFinite(n) && n >= 0 ? n : defaultMinutes;
}

const MORNING_ADHKAR = [
  { id: "m1", count: 1, arabic: "آيَةُ الْكُرْسِيِّ: اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", virtue: "من قالها حين يصبح لم يزل في ذمة الله حتى يمسي" },
  { id: "m2", count: 3, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", virtue: "سورة الإخلاص، ثلاث مرات" },
  { id: "m3", count: 3, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", virtue: "سورة الفلق، ثلاث مرات" },
  { id: "m4", count: 3, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ", virtue: "سورة الناس، ثلاث مرات" },
  { id: "m5", count: 1, arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ", virtue: "دعاء الصباح" },
  { id: "m6", count: 1, arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", virtue: "" },
  { id: "m7", count: 4, arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", virtue: "من قالها حين يصبح أو يمسي أربع مرات أعتقه الله من النار (رواه أبو داود)" },
  { id: "m8", count: 1, arabic: "سَيِّدُ الِاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", virtue: "من قالها موقنًا بها حين يصبح فمات من يومه دخل الجنة" },
  { id: "m9", count: 7, arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", virtue: "" },
  { id: "m10", count: 3, arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", virtue: "" },
  { id: "m11", count: 3, arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", virtue: "" },
];

const EVENING_ADHKAR = [
  { id: "e1", count: 1, arabic: "آيَةُ الْكُرْسِيِّ: اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", virtue: "من قالها حين يمسي لم يزل في ذمة الله حتى يصبح" },
  { id: "e2", count: 3, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", virtue: "سورة الإخلاص، ثلاث مرات" },
  { id: "e3", count: 3, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", virtue: "سورة الفلق، ثلاث مرات" },
  { id: "e4", count: 3, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ", virtue: "سورة الناس، ثلاث مرات" },
  { id: "e5", count: 1, arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا", virtue: "دعاء المساء" },
  { id: "e6", count: 1, arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", virtue: "" },
  { id: "e7", count: 4, arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", virtue: "من قالها حين يصبح أو يمسي أربع مرات أعتقه الله من النار (رواه أبو داود)" },
  { id: "e8", count: 1, arabic: "سَيِّدُ الِاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", virtue: "من قالها موقنًا بها حين يمسي فمات من ليلته دخل الجنة" },
  { id: "e9", count: 7, arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", virtue: "" },
  { id: "e10", count: 3, arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", virtue: "" },
  { id: "e11", count: 3, arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", virtue: "" },
];

const HADITH_LIST = [
  { text: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى", source: "صحيح البخاري 1؛ صحيح مسلم 1907" },
  { text: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", source: "صحيح البخاري 13؛ صحيح مسلم 45" },
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلَا يُؤْذِ جَارَهُ", source: "صحيح البخاري 6018؛ صحيح مسلم 47" },
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ", source: "صحيح البخاري 6018؛ صحيح مسلم 47" },
  { text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", source: "صحيح البخاري 6018؛ صحيح مسلم 47" },
  { text: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", source: "صحيح البخاري 10؛ صحيح مسلم 40" },
  { text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", source: "صحيح البخاري 5027" },
  { text: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", source: "صحيح البخاري 2989؛ صحيح مسلم 1009" },
  { text: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ", source: "صحيح مسلم 2699" },
  { text: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ", source: "صحيح مسلم 2664" },
  { text: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ", source: "صحيح البخاري 5997؛ صحيح مسلم 2318" },
  { text: "لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ", source: "صحيح البخاري 7376؛ صحيح مسلم 2319" },
  { text: "الطُّهُورُ شَطْرُ الْإِيمَانِ", source: "صحيح مسلم 223" },
  { text: "الصَّلَاةُ نُورٌ", source: "صحيح مسلم 223" },
  { text: "الصَّدَقَةُ بُرْهَانٌ", source: "صحيح مسلم 223" },
  { text: "الصَّبْرُ ضِيَاءٌ", source: "صحيح مسلم 223" },
  { text: "وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ", source: "صحيح مسلم 223" },
  { text: "وَكُلُّ النَّاسِ يَغْدُو، فَبَائِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا", source: "صحيح مسلم 223" },
  { text: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ", source: "صحيح مسلم 1631" },
  { text: "مَنْ غَشَّنَا فَلَيْسَ مِنَّا", source: "صحيح مسلم 101" },
  { text: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا", source: "صحيح البخاري 69؛ صحيح مسلم 1734" },
  { text: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ", source: "صحيح مسلم 2564" },
  { text: "مَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ", source: "صحيح البخاري 2442؛ صحيح مسلم 2580" },
  { text: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ", source: "صحيح مسلم 2699" },
  { text: "مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالْآخِرَةِ", source: "صحيح مسلم 2699" },
  { text: "لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا، وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا", source: "صحيح مسلم 2564" },
  { text: "لَا تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا، وَلَا تُؤْمِنُوا حَتَّى تَحَابُّوا", source: "صحيح مسلم 54" },
  { text: "أَفْشُوا السَّلَامَ بَيْنَكُمْ", source: "صحيح مسلم 54" },
  { text: "الْمَرْءُ مَعَ مَنْ أَحَبَّ", source: "صحيح البخاري 6168؛ صحيح مسلم 2640" },
  { text: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا", source: "صحيح مسلم 408" },
  { text: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ", source: "صحيح مسلم 482" },
  { text: "اقْرَؤُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ", source: "صحيح مسلم 804" },
];

const AYAH_LIST = [
  { text: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", source: "سورة طه، 114" },
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا", source: "سورة الشرح، 5-6" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", source: "سورة الشرح، 5" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", source: "سورة الطلاق، 2" },
  { text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", source: "سورة الطلاق، 3" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", source: "سورة البقرة، 153" },
  { text: "وَبَشِّرِ الصَّابِرِينَ", source: "سورة البقرة، 155" },
  { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", source: "سورة البقرة، 286" },
  { text: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ", source: "سورة البقرة، 216" },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", source: "سورة البقرة، 152" },
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", source: "سورة الرعد، 28" },
  { text: "وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا", source: "سورة الأحزاب، 3" },
  { text: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ", source: "سورة النحل، 127" },
  { text: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", source: "سورة البقرة، 222" },
  { text: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ", source: "سورة الرعد، 11" },
  { text: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ", source: "سورة العنكبوت، 69" },
  { text: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ", source: "سورة النحل، 90" },
  { text: "وَمَن يَعْتَصِم بِاللَّهِ فَقَدْ هُدِيَ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", source: "سورة آل عمران، 101" },
  { text: "رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي", source: "سورة طه، 25-26" },
  { text: "وَقُلْ رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ", source: "سورة المؤمنون، 118" },
  { text: "وَالَّذِينَ يُؤْتُونَ مَا آتَوا وَّقُلُوبُهُمْ وَجِلَةٌ أَنَّهُمْ إِلَىٰ رَبِّهِمْ رَاجِعُونَ", source: "سورة المؤمنون، 60" },
  { text: "إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ", source: "سورة الشعراء، 62" },
  { text: "حَسْبِيَ اللَّهُ ۖ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", source: "سورة التوبة، 129" },
  { text: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ", source: "سورة هود، 88" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مِنْ أَمْرِهِ يُسْرًا", source: "سورة الطلاق، 4" },
];

const SALAWAT = "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ وَصَحْبِهِ أَجْمَعِينَ";
const SALAWAT_AUDIO_URL = "https://salawat.com/wp-content/uploads/2026/08/salat-al-nabi-al-ummi-2-audio-1.mp3";

function getSalawatAudio() {
  if (!window.__adhkarSalawatAudio) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = SALAWAT_AUDIO_URL;
    audio.volume = 0.8;
    window.__adhkarSalawatAudio = audio;
  }
  return window.__adhkarSalawatAudio;
}

async function playSalawatAudio() {
  const audio = getSalawatAudio();
  audio.currentTime = 0;
  try {
    await audio.play();
    return "audio";
  } catch (err) {
    if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(SALAWAT);
      utterance.lang = "ar";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      return "speech";
    }
    throw err;
  }
}

function dayIndex(len) {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diffMs = new Date() - start;
  const dayOfYear = Math.floor(diffMs / 86400000);
  return ((dayOfYear % len) + len) % len;
}

function AdhkarCard({ item }) {
  const [count, setCount] = useState(0);
  const target = item.count || 1;
  const done = count >= target;
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(item.arabic); } catch (e) { /* clipboard unavailable */ }
  };
  return (
    <div className={"adhkar-card" + (done ? " adhkar-card-done" : "")}>
      <div className="adhkar-text">{item.arabic}</div>
      {item.virtue ? <div className="adhkar-virtue">{item.virtue}</div> : null}
      <div className="adhkar-row">
        <button className="adhkar-share" onClick={copy} title="نسخ">⇪</button>
        <button className="adhkar-count-circle" onClick={() => setCount((c) => Math.min(target, c + 1))} title="اضغط للعد">{count}</button>
        <span className="adhkar-target-label">{target > 1 ? "× " + target : "مرة واحدة"}</span>
        {done ? <span className="adhkar-check">✓</span> : null}
      </div>
    </div>
  );
}

export function AdhkarApp() {
  const [tab, setTab] = useState("morning");
  const [hadithIndex, setHadithIndex] = useState(() => dayIndex(HADITH_LIST.length));
  const [ayahIndex, setAyahIndex] = useState(() => dayIndex(AYAH_LIST.length));
  const salawatAudioRef = useRef(null);
  const [popupMinutes, setPopupMinutes] = useState(() => readPopupMinutes(10));
  const [popupType, setPopupType] = useState(() => localStorage.getItem("adhkar-popup-type") || "salawat");
  const [popupPinned, setPopupPinned] = useState(() => localStorage.getItem("adhkar-popup-pinned") === "1");
  const [notificationEnabled, setNotificationEnabled] = useState(() => localStorage.getItem("adhkar-notifications") === "1");
  const [audioEnabled, setAudioEnabled] = useState(() => localStorage.getItem("adhkar-audio") === "1");
  const [audioStatus, setAudioStatus] = useState("");

  const enableNotifications = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    setNotificationEnabled(enabled);
    localStorage.setItem("adhkar-notifications", enabled ? "1" : "0");
    window.dispatchEvent(new CustomEvent("adhkar-popup-settings"));
  };
  const savePopupSetting = (key, value) => {
    localStorage.setItem(key, String(value));
    localStorage.setItem(ADHKAR_SETTINGS_VERSION, "1");
    window.dispatchEvent(new CustomEvent("adhkar-popup-settings"));
  };
  const hadith = HADITH_LIST[hadithIndex];
  const ayah = AYAH_LIST[ayahIndex];
  const shuffleIndex = (length, current) => {
    if (length < 2) return current;
    let next = current;
    while (next === current) next = Math.floor(Math.random() * length);
    return next;
  };
  const shuffleHadith = () => setHadithIndex((current) => shuffleIndex(HADITH_LIST.length, current));
  const shuffleAyah = () => setAyahIndex((current) => shuffleIndex(AYAH_LIST.length, current));
  return (
    <div className="adhkar-app" dir="rtl">
      <audio ref={salawatAudioRef} preload="auto" src={SALAWAT_AUDIO_URL} />
      <style>{ADHKAR_CSS}</style>
      <div className="adhkar-tabs">
        <button className={"adhkar-tab" + (tab === "morning" ? " adhkar-tab-active" : "")} onClick={() => setTab("morning")}>أذكار الصباح</button>
        <button className={"adhkar-tab" + (tab === "evening" ? " adhkar-tab-active" : "")} onClick={() => setTab("evening")}>أذكار المساء</button>
        <button className={"adhkar-tab" + (tab === "hadith" ? " adhkar-tab-active" : "")} onClick={() => setTab("hadith")}>حديث اليوم</button>
        <button className={"adhkar-tab" + (tab === "ayah" ? " adhkar-tab-active" : "")} onClick={() => setTab("ayah")}>آية اليوم</button>
      </div>
      <div className="adhkar-settings" dir="rtl">
        <div className="adhkar-settings-title">تذكير الأذكار</div>
        <label>التكرار:
          <select value={popupMinutes} onChange={e => { const v = Number(e.target.value); setPopupMinutes(v); savePopupSetting("adhkar-popup-minutes", v); }}>
            <option value="0">إيقاف</option>
            <option value="1">كل دقيقة</option>
            <option value="5">كل 5 دقائق</option>
            <option value="10">كل 10 دقائق</option>
            <option value="15">كل 15 دقيقة</option>
            <option value="30">كل 30 دقيقة</option>
            <option value="60">كل ساعة</option>
            <option value="120">كل ساعتين</option>
            <option value="240">كل 4 ساعات</option>
          </select>
        </label>
        <label className="adhkar-pin-setting">
          <input type="checkbox" checked={notificationEnabled} onChange={enableNotifications} />
          إشعارات شريط المهام
        </label>
        <label className="adhkar-pin-setting">
          <input type="checkbox" checked={audioEnabled} onChange={e => {
            const v = e.target.checked;
            setAudioEnabled(v);
            savePopupSetting("adhkar-audio", v ? "1" : "0");
            if (v) {
              playSalawatAudio()
                 .then((mode) => setAudioStatus(mode === "speech" ? "الصوت يعمل عبر النطق العربي ✓" : "يعمل الصوت ✓"))
                .catch((err) => setAudioStatus("تعذر تشغيل الصوت: " + (err?.message || "خطأ غير معروف")));
            } else {
              const a = getSalawatAudio();
              a.pause();
            }
          }} />
          صوت الصلاة على النبي
        </label>
        <button className="adhkar-audio-test" type="button" onClick={() => {
          playSalawatAudio()
            .then(() => setAudioStatus("يعمل الصوت ✓"))
            .catch((err) => setAudioStatus("تعذر تشغيل الصوت: " + (err?.message || "خطأ غير معروف")));
        }}>اختبار الصوت</button>
        {audioStatus ? <span className="adhkar-audio-status">{audioStatus}</span> : null}
        <label className="adhkar-pin-setting">
          <input type="checkbox" checked={popupPinned} onChange={e => { const v = e.target.checked; setPopupPinned(v); savePopupSetting("adhkar-popup-pinned", v ? "1" : "0"); }} />
          تثبيت النافذة
        </label>
        <label>محتوى التذكير:
          <select value={popupType} onChange={e => { setPopupType(e.target.value); savePopupSetting("adhkar-popup-type", e.target.value); }}>
            <option value="salawat">اللهم صل وسلم وبارك على نبينا محمد ﷺ</option>
            <option value="rotation">حديث وآية وصلاة على النبي</option>
          </select>
        </label>
      </div>
      <div className="adhkar-body">
        {tab === "morning" && <div className="adhkar-list">{MORNING_ADHKAR.map((it) => <AdhkarCard key={it.id} item={it} />)}</div>}
        {tab === "evening" && <div className="adhkar-list">{EVENING_ADHKAR.map((it) => <AdhkarCard key={it.id} item={it} />)}</div>}
        {tab === "hadith" && (
          <div className="adhkar-of-day">
            <div className="adhkar-of-day-label">حديث اليوم</div>
            <div className="adhkar-of-day-text">{hadith.text}</div>
            <button className="adhkar-shuffle" type="button" onClick={shuffleHadith}>🔀 تبديل الحديث</button>
            <div className="adhkar-virtue">{hadith.source}</div>
          </div>
        )}
        {tab === "ayah" && (
          <div className="adhkar-of-day">
            <div className="adhkar-of-day-label">آية اليوم</div>
            <div className="adhkar-of-day-text adhkar-ayah-text">{ayah.text}</div>
            <button className="adhkar-shuffle" type="button" onClick={shuffleAyah}>🔀 تبديل الآية</button>
            <div className="adhkar-virtue">{ayah.source}</div>
          </div>
        )}
      </div>
      <div className="adhkar-footnote">محتوى مختصر وموثوق للتذكير اليومي — وللاستزادة يُفضّل الرجوع لتطبيق أذكار متخصص أو أهل العلم.</div>
    </div>
  );
}

export function AdhkarBalloonPopup({ intervalMinutes = 10, fireImmediately = false }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(null);
  const [audioError, setAudioError] = useState("");
  const [settings, setSettings] = useState(() => ({
    minutes: (() => {
      const saved = localStorage.getItem("adhkar-popup-minutes");
      const n = saved === null ? Number(intervalMinutes || 10) : Number(saved);
      return n > 0 ? n : 10;
    })(),
    type: localStorage.getItem("adhkar-popup-type") || "salawat",
    pinned: localStorage.getItem("adhkar-popup-pinned") === "1",
    notifications: localStorage.getItem("adhkar-notifications") === "1",
    audio: localStorage.getItem("adhkar-audio") === "1"
  }));
  const rotateIndex = useRef(0);
  const dismissTimer = useRef(null);

  useEffect(() => {
    const sync = () => setSettings({
      minutes: (() => {
        const n = readPopupMinutes(Number(intervalMinutes || 10));
        return n >= 0 ? n : Number(intervalMinutes || 10);
      })(),
      type: localStorage.getItem("adhkar-popup-type") || "salawat",
      pinned: localStorage.getItem("adhkar-popup-pinned") === "1",
      notifications: localStorage.getItem("adhkar-notifications") === "1",
      audio: localStorage.getItem("adhkar-audio") === "1"
    });
    window.addEventListener("adhkar-popup-settings", sync);
    return () => window.removeEventListener("adhkar-popup-settings", sync);
  }, [intervalMinutes]);

  useEffect(() => {
    const pool = [
      { kind: "صلاة على النبي ﷺ", text: SALAWAT },
      ...HADITH_LIST.map((h) => ({ kind: "حديث", text: h.text, source: h.source })),
      ...AYAH_LIST.map((a) => ({ kind: "آية", text: a.text, source: a.source })),
    ];
    const fire = () => {
      if (!settings.minutes && !fireImmediately) return;
      const item = settings.type === "salawat"
        ? { kind: "صلاة على النبي ﷺ", text: SALAWAT }
        : pool[rotateIndex.current++ % pool.length];
      setContent(item);
      setVisible(true);
      if (settings.audio && item.kind === "صلاة على النبي ﷺ") {
        window.setTimeout(() => {
          playSalawatAudio().catch((err) => setAudioError(err?.message || "تعذر تشغيل الصوت"));
        }, 350);
      }
      if (settings.notifications && "Notification" in window && Notification.permission === "granted") {
        new Notification(item.kind, {
          body: item.text,
          tag: "adhkar-reminder",
          renotify: true,
          requireInteraction: !!settings.pinned,
          icon: "/SEM10-XP-legacy/pwa-192x192.png"
        });
      }
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      if (!settings.pinned) dismissTimer.current = setTimeout(() => setVisible(false), 30000);
    };
    if (fireImmediately) fire();
    if (!settings.minutes || fireImmediately) return;
    let iv = null;
    const firstTimer = settings.minutes > 0
      ? window.setTimeout(() => {
          fire();
          iv = window.setInterval(fire, settings.minutes * 60 * 1000);
        }, 4000)
      : null;
    return () => {
      if (firstTimer) clearTimeout(firstTimer);
      if (iv) clearInterval(iv);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [settings, fireImmediately]);

  if (!visible || !content) return null;
  return (
    <div className="adhkar-balloon" dir="rtl" role="button" tabIndex={0} onClick={() => window.dispatchEvent(new CustomEvent("sem10xp-open-app", { detail: { id: "adhkar" } }))} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") window.dispatchEvent(new CustomEvent("sem10xp-open-app", { detail: { id: "adhkar" } })); }} title="فتح Adhkar.exe">
      <style>{ADHKAR_CSS}</style>
      <div className="adhkar-balloon-head">
        <span>{content.kind}</span>
        <button className="adhkar-balloon-close" onClick={() => setVisible(false)} aria-label="إغلاق">×</button>
      </div>
      <div className="adhkar-balloon-body">{content.text}</div>
      {content.source ? <div className="adhkar-balloon-source">{content.source}</div> : null}
      <div className="adhkar-balloon-tail" />
    </div>
  );
}

const ADHKAR_CSS = `
  .adhkar-app { display:flex; flex-direction:column; height:100%; font-family: Tahoma, sans-serif; }
  .adhkar-tabs { display:flex; gap:4px; padding: 8px 8px 0; flex-wrap:wrap; }
  .adhkar-tab { flex:1; min-width:90px; font-family:Tahoma,sans-serif; font-size:11.5px; padding:6px 8px; border:1px solid #8E8E71; border-radius:3px 3px 0 0; background:#ECE9D8; cursor:pointer; }
  .adhkar-tab-active { background:#fff; border-bottom-color:#fff; font-weight:bold; color:#0A46C6; }
  .adhkar-settings { background:#ECE9D8; border:1px solid #ACA899; margin:8px 8px 0; padding:7px 8px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; font-size:11px; }
  .adhkar-settings-title { font-weight:bold; color:#0A46C6; width:100%; }
  .adhkar-settings label { display:flex; align-items:center; gap:4px; }
  .adhkar-pin-setting { cursor:pointer; }
  .adhkar-pin-setting input { margin:0; accent-color:#0A46C6; }
  .adhkar-audio-test { font-family:Tahoma,sans-serif; font-size:10.5px; border:1px solid #8E8E71; background:#fff; padding:2px 6px; cursor:pointer; }
  .adhkar-audio-test:disabled { opacity:0.5; cursor:default; }
  .adhkar-audio-status { font-size:10px; color:#555; max-width:220px; }
  .adhkar-settings select { font-family:Tahoma,sans-serif; font-size:10.5px; border:1px solid #8E8E71; background:#fff; padding:2px 4px; max-width:210px; }
  .adhkar-body { flex:1; overflow:auto; background:#fff; border:1px solid #ACA899; margin:0 8px; padding:10px; }
  .adhkar-list { display:flex; flex-direction:column; gap:10px; }
  .adhkar-card { background:#F8F7F0; border:1px solid #D8D5C4; border-radius:4px; padding:10px 12px; }
  .adhkar-card-done { background:#EAF7DE; border-color:#B9DE9C; }
  .adhkar-text { font-size:15px; line-height:2; color:#111; }
  .adhkar-virtue { font-size:11px; color:#5a6b3a; margin-top:6px; opacity:0.85; }
  .adhkar-row { display:flex; align-items:center; gap:8px; margin-top:8px; }
  .adhkar-share, .adhkar-count-circle { font-family:Tahoma,sans-serif; cursor:pointer; }
  .adhkar-share { border:1px solid #8E8E71; background:#ECE9D8; border-radius:3px; padding:3px 8px; font-size:12px; }
  .adhkar-count-circle { width:30px; height:30px; border-radius:50%; border:2px solid #0A46C6; background:#fff; color:#0A46C6; font-weight:bold; font-size:12px; }
  .adhkar-target-label { font-size:10.5px; color:#666; }
  .adhkar-check { margin-right:auto; color:#3a7a1a; font-weight:bold; }
  .adhkar-of-day { display:flex; flex-direction:column; align-items:center; text-align:center; padding:24px 12px; gap:10px; }
  .adhkar-shuffle { font-family:Tahoma,sans-serif; font-size:10.5px; border:1px solid #8E8E71; background:#ECE9D8; padding:3px 9px; border-radius:3px; cursor:pointer; }
  .adhkar-shuffle:hover { background:#DCEBFC; border-color:#3E97FF; }
  .adhkar-of-day-label { font-size:11px; color:#0A46C6; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px; }
  .adhkar-of-day-text { font-size:17px; line-height:2; color:#111; }
  .adhkar-ayah-text { color:#0A3FA0; }
  .adhkar-footnote { font-size:10px; color:#777; padding:6px 12px 10px; text-align:center; }

  .adhkar-balloon { position:fixed; cursor:pointer; right:14px; bottom:48px; width:280px; background:#FFFFE1; border:1px solid #8A8A5A; box-shadow:2px 3px 8px rgba(0,0,0,0.35); border-radius:3px; z-index:2000; font-family:Tahoma,sans-serif; animation: adhkar-balloon-in 0.25s ease-out; }
  @keyframes adhkar-balloon-in { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
  .adhkar-balloon-head { background: linear-gradient(180deg, #3E97FF, #0A46C6); color:#fff; font-size:11.5px; font-weight:bold; padding:5px 8px; display:flex; align-items:center; justify-content:space-between; border-radius:2px 2px 0 0; }
  .adhkar-balloon-close { background:none; border:none; color:#fff; cursor:pointer; font-size:13px; line-height:1; padding:0 2px; }
  .adhkar-balloon-body { padding:10px 10px 4px; font-size:13px; line-height:1.9; color:#111; }
  .adhkar-balloon-source { padding:0 10px 8px; font-size:10px; color:#666; text-align:left; }
  .adhkar-balloon-tail { position:absolute; bottom:-8px; right:26px; width:14px; height:14px; background:#FFFFE1; border-right:1px solid #8A8A5A; border-bottom:1px solid #8A8A5A; transform: rotate(45deg); }
`;
