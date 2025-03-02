import Link from "next/link";

export default function Lecture() {
  // Liste des sourates (exemple simplifié)
  const sourates = [
    { "position": 1, "nom": "سورة الفاتحة", "nom_phonetique": "Al-Faatiha", "englishNameTranslation": "The Opening" },
    { "position": 2, "nom": "سورة البقرة", "nom_phonetique": "Al-Baqara", "englishNameTranslation": "The Cow" },
    { "position": 3, "nom": "سورة آل عمران", "nom_phonetique": "Al-Imran", "englishNameTranslation": "The Family of Imran" },
    { "position": 4, "nom": "سورة النساء", "nom_phonetique": "An-Nisa", "englishNameTranslation": "The Women" },
    { "position": 5, "nom": "سورة المائدة", "nom_phonetique": "Al-Ma'idah", "englishNameTranslation": "The Table Spread" },
    { "position": 6, "nom": "سورة الأنعام", "nom_phonetique": "Al-An'am", "englishNameTranslation": "The Cattle" },
    { "position": 7, "nom": "سورة الأعراف", "nom_phonetique": "Al-A'raf", "englishNameTranslation": "The Heights" },
    { "position": 8, "nom": "سورة الأنفال", "nom_phonetique": "Al-Anfal", "englishNameTranslation": "The Spoils of War" },
    { "position": 9, "nom": "سورة التوبة", "nom_phonetique": "At-Tawbah", "englishNameTranslation": "The Repentance" },
    { "position": 10, "nom": "سورة يونس", "nom_phonetique": "Yunus", "englishNameTranslation": "Jonah" },
    { "position": 11, "nom": "سورة هود", "nom_phonetique": "Hud", "englishNameTranslation": "Hud" },
    { "position": 12, "nom": "سورة يوسف", "nom_phonetique": "Yusuf", "englishNameTranslation": "Joseph" },
    { "position": 13, "nom": "سورة الرعد", "nom_phonetique": "Ar-Ra’d", "englishNameTranslation": "The Thunder" },
    { "position": 14, "nom": "سورة إبراهيم", "nom_phonetique": "Ibrahim", "englishNameTranslation": "Abraham" },
    { "position": 15, "nom": "سورة الحجر", "nom_phonetique": "Al-Hijr", "englishNameTranslation": "The Rocky Tract" },
    { "position": 16, "nom": "سورة النحل", "nom_phonetique": "An-Nahl", "englishNameTranslation": "The Bee" },
    { "position": 17, "nom": "سورة الإسراء", "nom_phonetique": "Al-Isra", "englishNameTranslation": "The Night Journey" },
    { "position": 18, "nom": "سورة الكهف", "nom_phonetique": "Al-Kahf", "englishNameTranslation": "The Cave" },
    { "position": 19, "nom": "سورة مريم", "nom_phonetique": "Maryam", "englishNameTranslation": "Mary" },
    { "position": 20, "nom": "سورة طه", "nom_phonetique": "Taha", "englishNameTranslation": "Ta-Ha" },
    { "position": 21, "nom": "سورة الأنبياء", "nom_phonetique": "Al-Anbiya", "englishNameTranslation": "The Prophets" },
    { "position": 22, "nom": "سورة الحج", "nom_phonetique": "Al-Hajj", "englishNameTranslation": "The Pilgrimage" },
    { "position": 23, "nom": "سورة المؤمنون", "nom_phonetique": "Al-Mu’minun", "englishNameTranslation": "The Believers" },
    { "position": 24, "nom": "سورة النور", "nom_phonetique": "An-Nur", "englishNameTranslation": "The Light" },
    { "position": 25, "nom": "سورة الفرقان", "nom_phonetique": "Al-Furqan", "englishNameTranslation": "The Criterion" },
    { "position": 26, "nom": "سورة الشعراء", "nom_phonetique": "Ash-Shu’ara", "englishNameTranslation": "The Poets" },
    { "position": 27, "nom": "سورة النمل", "nom_phonetique": "An-Naml", "englishNameTranslation": "The Ant" },
    { "position": 28, "nom": "سورة القصص", "nom_phonetique": "Al-Qasas", "englishNameTranslation": "The Stories" },
    { "position": 29, "nom": "سورة العنكبوت", "nom_phonetique": "Al-Ankabut", "englishNameTranslation": "The Spider" },
    { "position": 30, "nom": "سورة الروم", "nom_phonetique": "Ar-Rum", "englishNameTranslation": "The Romans" },
    { "position": 31, "nom": "سورة لقمان", "nom_phonetique": "Luqman", "englishNameTranslation": "Luqman" },
    { "position": 32, "nom": "سورة السجدة", "nom_phonetique": "As-Sajda", "englishNameTranslation": "The Prostration" },
    { "position": 33, "nom": "سورة الأحزاب", "nom_phonetique": "Al-Ahzab", "englishNameTranslation": "The Confederates" },
    { "position": 34, "nom": "سورة سبإ", "nom_phonetique": "Saba", "englishNameTranslation": "Sheba" },
    { "position": 35, "nom": "سورة فاطر", "nom_phonetique": "Fatir", "englishNameTranslation": "The Originator" },
    { "position": 36, "nom": "سورة يس", "nom_phonetique": "Ya-Sin", "englishNameTranslation": "Ya-Sin" },
    { "position": 37, "nom": "سورة الصافات", "nom_phonetique": "As-Saffat", "englishNameTranslation": "Those who set the Ranks" },
    { "position": 38, "nom": "سورة ص", "nom_phonetique": "Sad", "englishNameTranslation": "The Letter Sad" },
    { "position": 39, "nom": "سورة الزمر", "nom_phonetique": "Az-Zumar", "englishNameTranslation": "The Groups" },
    { "position": 40, "nom": "سورة غافر", "nom_phonetique": "Ghafir", "englishNameTranslation": "The Forgiver" },
    { "position": 41, "nom": "سورة فصلت", "nom_phonetique": "Fussilat", "englishNameTranslation": "Explained in Detail" },
    { "position": 42, "nom": "سورة الشورى", "nom_phonetique": "Ash-Shura", "englishNameTranslation": "The Consultation" },
    { "position": 43, "nom": "سورة الزخرف", "nom_phonetique": "Az-Zukhruf", "englishNameTranslation": "The Gold Adornments" },
    { "position": 44, "nom": "سورة الدخان", "nom_phonetique": "Ad-Dukhan", "englishNameTranslation": "The Smoke" },
    { "position": 45, "nom": "سورة الجاثية", "nom_phonetique": "Al-Jathiya", "englishNameTranslation": "The Crouching" },
    { "position": 46, "nom": "سورة الأحقاف", "nom_phonetique": "Al-Ahqaf", "englishNameTranslation": "The Wind-Curved Sandhills" },
    { "position": 47, "nom": "سورة محمد", "nom_phonetique": "Muhammad", "englishNameTranslation": "Muhammad" },
    { "position": 48, "nom": "سورة الفتح", "nom_phonetique": "Al-Fath", "englishNameTranslation": "The Victory" },
    { "position": 49, "nom": "سورة الحجرات", "nom_phonetique": "Al-Hujurat", "englishNameTranslation": "The Rooms" },
    { "position": 50, "nom": "سورة ق", "nom_phonetique": "Qaf", "englishNameTranslation": "The Letter Qaf" },
    { "position": 51, "nom": "سورة الذاريات", "nom_phonetique": "Adh-Dhariyat", "englishNameTranslation": "The Winnowing Winds" },
    { "position": 52, "nom": "سورة الطور", "nom_phonetique": "At-Tur", "englishNameTranslation": "The Mount" },
    { "position": 53, "nom": "سورة النجم", "nom_phonetique": "An-Najm", "englishNameTranslation": "The Star" },
    { "position": 54, "nom": "سورة القمر", "nom_phonetique": "Al-Qamar", "englishNameTranslation": "The Moon" },
    { "position": 55, "nom": "سورة الرحمن", "nom_phonetique": "Ar-Rahman", "englishNameTranslation": "The Beneficent" },
    { "position": 56, "nom": "سورة الواقعة", "nom_phonetique": "Al-Waqi'a", "englishNameTranslation": "The Inevitable" },
    { "position": 57, "nom": "سورة الحديد", "nom_phonetique": "Al-Hadid", "englishNameTranslation": "The Iron" },
    { "position": 58, "nom": "سورة المجادلة", "nom_phonetique": "Al-Mujadila", "englishNameTranslation": "The Pleading Woman" },
    { "position": 59, "nom": "سورة الحشر", "nom_phonetique": "Al-Hashr", "englishNameTranslation": "The Exile" },
    { "position": 60, "nom": "سورة الممتحنة", "nom_phonetique": "Al-Mumtahina", "englishNameTranslation": "She that is to be examined" },
    { "position": 61, "nom": "سورة الصف", "nom_phonetique": "As-Saff", "englishNameTranslation": "The Ranks" },
    { "position": 62, "nom": "سورة الجمعة", "nom_phonetique": "Al-Jumu'a", "englishNameTranslation": "The Congregation" },
    { "position": 63, "nom": "سورة المنافقون", "nom_phonetique": "Al-Munafiqun", "englishNameTranslation": "The Hypocrites" },
    { "position": 64, "nom": "سورة التغابن", "nom_phonetique": "At-Taghabun", "englishNameTranslation": "The Mutual Disillusion" },
    { "position": 65, "nom": "سورة الطلاق", "nom_phonetique": "At-Talaq", "englishNameTranslation": "The Divorce" },
    { "position": 66, "nom": "سورة التحريم", "nom_phonetique": "At-Tahrim", "englishNameTranslation": "The Prohibition" },
    { "position": 67, "nom": "سورة الملك", "nom_phonetique": "Al-Mulk", "englishNameTranslation": "The Sovereignty" },
    { "position": 68, "nom": "سورة القلم", "nom_phonetique": "Al-Qalam", "englishNameTranslation": "The Pen" },
    { "position": 69, "nom": "سورة الحاقة", "nom_phonetique": "Al-Haaqqa", "englishNameTranslation": "The Reality" },
    { "position": 70, "nom": "سورة المعارج", "nom_phonetique": "Al-Ma'arij", "englishNameTranslation": "The Ascending Stairways" },
    { "position": 71, "nom": "سورة نوح", "nom_phonetique": "Nuh", "englishNameTranslation": "Noah" },
    { "position": 72, "nom": "سورة الجن", "nom_phonetique": "Al-Jinn", "englishNameTranslation": "The Jinn" },
    { "position": 73, "nom": "سورة المزمل", "nom_phonetique": "Al-Muzzammil", "englishNameTranslation": "The Enshrouded One" },
    { "position": 74, "nom": "سورة المدثر", "nom_phonetique": "Al-Muddathir", "englishNameTranslation": "The Cloaked One" },
    { "position": 75, "nom": "سورة القيامة", "nom_phonetique": "Al-Qiyama", "englishNameTranslation": "The Resurrection" },
    { "position": 76, "nom": "سورة الإنسان", "nom_phonetique": "Al-Insan", "englishNameTranslation": "Man" },
    { "position": 77, "nom": "سورة المرسلات", "nom_phonetique": "Al-Mursalat", "englishNameTranslation": "The Emissaries" },
    { "position": 78, "nom": "سورة النبأ", "nom_phonetique": "An-Naba", "englishNameTranslation": "The Tidings" },
    { "position": 79, "nom": "سورة النازعات", "nom_phonetique": "An-Nazi'at", "englishNameTranslation": "Those who drag forth" },
    { "position": 80, "nom": "سورة عبس", "nom_phonetique": "Abasa", "englishNameTranslation": "He frowned" },
    { "position": 81, "nom": "سورة التكوير", "nom_phonetique": "At-Takwir", "englishNameTranslation": "The Overthrowing" },
    { "position": 82, "nom": "سورة الإنفطار", "nom_phonetique": "Al-Infitar", "englishNameTranslation": "The Cleaving" },
    { "position": 83, "nom": "سورة المطففين", "nom_phonetique": "Al-Mutaffifin", "englishNameTranslation": "Defrauding" },
    { "position": 84, "nom": "سورة الإنشقاق", "nom_phonetique": "Al-Inshiqaq", "englishNameTranslation": "The Splitting Open" },
    { "position": 85, "nom": "سورة البروج", "nom_phonetique": "Al-Buruj", "englishNameTranslation": "The Mansions of the Stars" },
    { "position": 86, "nom": "سورة الطارق", "nom_phonetique": "At-Tariq", "englishNameTranslation": "The Morning Star" },
    { "position": 87, "nom": "سورة الأعلى", "nom_phonetique": "Al-Ala", "englishNameTranslation": "The Most High" },
    { "position": 88, "nom": "سورة الغاشية", "nom_phonetique": "Al-Ghashiya", "englishNameTranslation": "The Overwhelming" },
    { "position": 89, "nom": "سورة الفجر", "nom_phonetique": "Al-Fajr", "englishNameTranslation": "The Dawn" },
    { "position": 90, "nom": "سورة البلد", "nom_phonetique": "Al-Balad", "englishNameTranslation": "The City" },
    { "position": 91, "nom": "سورة الشمس", "nom_phonetique": "Ash-Shams", "englishNameTranslation": "The Sun" },
    { "position": 92, "nom": "سورة الليل", "nom_phonetique": "Al-Lail", "englishNameTranslation": "The Night" },
    { "position": 93, "nom": "سورة الضحى", "nom_phonetique": "Ad-Duha", "englishNameTranslation": "The Morning Brightness" },
    { "position": 94, "nom": "سورة الشرح", "nom_phonetique": "Ash-Sharh", "englishNameTranslation": "The Relief" },
    { "position": 95, "nom": "سورة التين", "nom_phonetique": "At-Tin", "englishNameTranslation": "The Fig" },
    { "position": 96, "nom": "سورة العلق", "nom_phonetique": "Al-Alaq", "englishNameTranslation": "The Clot" },
    { "position": 97, "nom": "سورة القدر", "nom_phonetique": "Al-Qadr", "englishNameTranslation": "The Power" },
    { "position": 98, "nom": "سورة البينة", "nom_phonetique": "Al-Bayyina", "englishNameTranslation": "The Clear Proof" },
    { "position": 99, "nom": "سورة الزلزلة", "nom_phonetique": "Az-Zalzalah", "englishNameTranslation": "The Earthquake" },
    { "position": 100, "nom": "سورة العاديات", "nom_phonetique": "Al-Adiyat", "englishNameTranslation": "The Chargers" },
    { "position": 101, "nom": "سورة القارعة", "nom_phonetique": "Al-Qari'a", "englishNameTranslation": "The Calamity" },
    { "position": 102, "nom": "سورة التكاثر", "nom_phonetique": "At-Takathur", "englishNameTranslation": "The Rivalry in world increase" },
    { "position": 103, "nom": "سورة العصر", "nom_phonetique": "Al-Asr", "englishNameTranslation": "The Declining Day" },
    { "position": 104, "nom": "سورة الهمزة", "nom_phonetique": "Al-Humazah", "englishNameTranslation": "The Traducer" },
    { "position": 105, "nom": "سورة الفيل", "nom_phonetique": "Al-Fil", "englishNameTranslation": "The Elephant" },
    { "position": 106, "nom": "سورة قريش", "nom_phonetique": "Quraish", "englishNameTranslation": "Quraysh" },
    { "position": 107, "nom": "سورة الماعون", "nom_phonetique": "Al-Ma'un", "englishNameTranslation": "The Small Kindnesses" },
    { "position": 108, "nom": "سورة الكوثر", "nom_phonetique": "Al-Kawthar", "englishNameTranslation": "The Abundance" },
    { "position": 109, "nom": "سورة الكافرون", "nom_phonetique": "Al-Kafiroon", "englishNameTranslation": "The Disbelievers" },
    { "position": 110, "nom": "سورة النصر", "nom_phonetique": "An-Nasr", "englishNameTranslation": "The Divine Support" },
    { "position": 111, "nom": "سورة المسد", "nom_phonetique": "Al-Masad", "englishNameTranslation": "The Palm Fiber" },
    { "position": 112, "nom": "سورة الإخلاص", "nom_phonetique": "Al-Ikhlas", "englishNameTranslation": "The Sincerity" },
    { "position": 113, "nom": "سورة الفلق", "nom_phonetique": "Al-Falaq", "englishNameTranslation": "The Daybreak" },
    { "position": 114, "nom": "سورة الناس", "nom_phonetique": "An-Nas", "englishNameTranslation": "Mankind" }

]

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-green-500 text-center">Liste des Sourates</h1>
      <div className="mt-6">
        <ul>
          {sourates.map((sourate) => (
            <li
              key={sourate.position}
              className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/lecture/${sourate.position}`} passHref>
                <div className="cursor-pointer">
                  <h2 className="text-xl font-bold text-green-400">
                    <span className="text-green-300 text-lg">{sourate.position}. </span>
                    {sourate.nom}
                  </h2>
                  <p className="text-lg text-gray-300">{sourate.nom_phonetique}</p>
                  <span className="text-green-500 hover:text-green-300 transition-all duration-300 inline-block mt-2">
                    Voir les détails
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
