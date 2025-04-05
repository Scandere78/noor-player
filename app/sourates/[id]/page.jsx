'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const recitationsMap = {
  "abdul-basit": "abdelbasset-abdessamad",
  "mishary": "mishary-rashid",
  "saad": "saad-ghamidi",
  "yasser": "yasser-dossari",
  "balilah": "bandar-balila",
  "hussary": "mahmoud-khalil-hussary",
  "afs": "afs",
  "hudhaify": "hudhaify",
  "sds": "sudais",
  "maher": "maher",
  "h_dukhain": "h_dukhain",
  "soufi-1": "soufi-1",
  "jhn": "jhn",
  "aabd-lrhmn-lshh-t": "abdulrahman-al-shahat",
  "islam": "islam-subhi",


};

const recitersInfo = {
  "abdul-basit": { name: "Abdul Basit", image: "/img/abdul-basit.webp" },
  "saad": { name: "Saad Al-Ghamidi", image: "/img/saad-al-ghamdi.jpg" },
  "yasser": { name: "Yasser Al-Dossari", image: "/img/yasser-al-dossari.png" },
  "balilah": { name: "Bandar Balila", image: "/img/bandar-balila.jpg" },
  "hussary": { name: "Mahmoud Khalil Hussary", image: "/img/mahmoud.jpg" },
  "afs": { name: "Abu Faisal", image: "/img/mishary.webp" },
  "hudhaify": { name: "Hudhaify", image: "/images/hudhaify.jpg" },
  "sds": { name: "Abdul Rahman Al-Sudais", image: "/img/sudais.jpg" },
  'maher': { name: "Maher Al Meaqli", image: "/img/Maher.png" },
  "h_dukhain": { name: "Haitham Aldukhain", image: "/img/haitham.webp" },
  "soufi-1": { name: "Abderrashed Sofy", image: "/img/abdul-rashid-ali-sufi.png" },
  "jhn": { name: "Abdellah Al-Johany", image: "/img/al.jpg" },
  "aabd-lrhmn-lshh-t": { name: "Abdulrahman Al Shahat", image: "/img/abderrahman-shahat.jpg" },
  "islam": { name: "Islam Subhi", image: "/img/islam.png" },

};

const souratesNames = [
  "Al-Fatiha", "Al-Baqarah", "Aali Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Muminun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqia", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahina",
  "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqa", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyama", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Lail", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-Adiyat",
  "Al-Qari'a", "At-Takathur", "Al-Asr", "Al-Humaza", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export default function Recitations({ params }) {
  const router = useRouter();
  const { id } = params;
  const reciterFolder = recitationsMap[id];
  const reciterInfo = recitersInfo[id];
  const [sourates, setSourates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false); // Track if we're on the client side
  const audioRef = useRef(null);

  // Ensure Audio is initialized on the client side
  useEffect(() => {
    setIsClient(true); // Set state when the component is mounted on the client
  }, []);

  useEffect(() => {
    if (isClient) {
      audioRef.current = new Audio(); // Initialize the Audio object only on the client side
    }
  }, [isClient]);

  // Stop et réinitialise l'audio lorsque le récitateur change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      console.log(audioRef)
      setCurrentIndex(null);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Réinitialiser la source audio
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!reciterFolder) return;
    const allSourates = souratesNames.map((name, i) => {
      const sourateId = String(i + 1).padStart(3, '0');
      const audioUrl =
        id === "balilah"
          ? `https://server6.mp3quran.net/balilah/${sourateId}.mp3`
          : id === "jhn"
            ? `https://server13.mp3quran.net/jhn/${sourateId}.mp3`
            : id === "aabd-lrhmn-lshh-t"
              ? `https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem/${sourateId}.mp3`
              : id === "afs"
                ? `https://server8.mp3quran.net/afs/${sourateId}.mp3`
                : id === "maher"
                  ? `https://server12.mp3quran.net/maher/${sourateId}.mp3`
                  : id === "h_dukhain"
                    ? `https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/${sourateId}.mp3`
                    : id === "islam"
                      ? `https://server8.mp3quran.net/islam/${sourateId}.mp3`
                      : id === "soufi-1"
                        ? `https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/${sourateId}.mp3`
                        : id === "sds"
                          ? `https://server11.mp3quran.net/sds/${sourateId}.mp3`
                          : `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterFolder}/${sourateId}.mp3`;
      return { id: sourateId, name, audioUrl };
    });
    setSourates(allSourates);
  }, [reciterFolder]);

  const playAudio = (index) => {
    if (!sourates[index]) return;
    const newAudioUrl = sourates[index].audioUrl;

    // Pause et reset l'ancien audio avant de changer
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = newAudioUrl;
      audioRef.current.load();
      audioRef.current.play();
    }

    setCurrentIndex(index);
    setIsPlaying(true);

    // Gérer la progression et la durée de l'audio
    audioRef.current.onloadedmetadata = () => setDuration(audioRef.current.duration);
    audioRef.current.ontimeupdate = () => {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    };
    audioRef.current.onended = () => setIsPlaying(false);
  };

  if (!isClient) return null; // Avoid rendering anything until we're on the client

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-900 text-white">
      {reciterInfo && (
        <div className="text-center mb-6">
          <Image src={reciterInfo.image} alt={reciterInfo.name} width={120} height={128} className="mx-auto rounded-full" />
          <h1 className="text-3xl font-bold text-green-500 mt-2">{reciterInfo.name}</h1>
        </div>
      )}
      <div className="w-full max-w-2xl mx-auto text-left">
        {sourates.map((sourate, index) => (
          <div key={sourate.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-2 hover:bg-gray-700" onClick={() => playAudio(index)}>
            <span className="text-lg font-medium">{sourate.id}. {sourate.name}</span>
            <FaPlay className="text-green-400" />
          </div>
        ))}
      </div>
      {currentIndex !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between shadow-lg w-full h-20">
          <Image src={reciterInfo.image} alt={reciterInfo.name} width={50} height={50} className="rounded-full" />
          <div className="flex flex-col text-center">
            <span className="text-base font-medium">{sourates[currentIndex].name}</span>
            <span className="text-sm text-gray-400">{(duration / 60).toFixed(2)} min</span>
          </div>
          <input type="range" min="0" max="100" value={progress} onChange={(e) => {
            const newTime = (e.target.value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(e.target.value);
          }} className="w-40 mx-4" />
          <div className="flex space-x-2">
            <FaStepBackward className="text-white text-2xl cursor-pointer" onClick={() => playAudio(Math.max(0, currentIndex - 1))} />
            {isPlaying ? (
              <FaPause className="text-green-400 text-3xl cursor-pointer" onClick={() => { audioRef.current.pause(); setIsPlaying(false); }} />
            ) : (
              <FaPlay className="text-green-400 text-3xl cursor-pointer" onClick={() => playAudio(currentIndex)} />
            )}
            <FaStepForward className="text-white text-2xl cursor-pointer" onClick={() => playAudio(Math.min(sourates.length - 1, currentIndex + 1))} />
          </div>
        </div>
      )}
    </div>
  );
}
