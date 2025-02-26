'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const recitationsMap = {
  "abdul-basit": "abdelbasset-abdessamad",
  "mishary": "mishary-rashid",
  "saad": "saad-ghamidi",
  "yasser": "yasser-dossari",
  "bandar": "bandar-balila",
  "hussary": "mahmoud-khalil-hussary",
  "afs": "afs",
  "hudhaify": "hudhaify",
  "sudais": "sudais"
};

const recitersInfo = {
  "abdul-basit": { name: "Abdul Basit", image: "/img/abdul-basit.webp" },
  "mishary": { name: "Mishary Rashid", image: "/img/mishary.webp" },
  "saad": { name: "Saad Al-Ghamidi", image: "/img/saad-al-ghamdi.jpg" },
  "yasser": { name: "Yasser Al-Dossari", image: "/img/yasser-al-dossari.png" },
  "balilah": { name: "Bandar Balila", image: "/img/bandar-balila.jpg" },
  "hussary": { name: "Mahmoud Khalil Hussary", image: "/img/mahmoud.jpg" },
  "afs": { name: "Abu Faisal", image: "/img/mishary.webp" },
  "hudhaify": { name: "Hudhaify", image: "/images/hudhaify.jpg" },
  "sudais": { name: "Abdul Rahman Al-Sudais", image: "/images/sudais.jpg" }
};

const souratesNames = [...Array(114).keys()].map(i => `Sourate ${i + 1}`);

export default function Recitations({ params }) {
  const router = useRouter();
  const { id } = params;
  const reciterFolder = recitationsMap[id];
  const reciterInfo = recitersInfo[id];
  const [sourates, setSourates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener('timeupdate', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  useEffect(() => {
    if (!reciterFolder) return;

    const allSourates = Array.from({ length: 114 }, (_, i) => {
      const sourateId = String(i + 1).padStart(3, '0');
      const audioUrl = id === "bandar" 
        ? `https://server6.mp3quran.net/balilah/${sourateId}.mp3`
        : id === "afs"
        ? `https://server8.mp3quran.net/afs/${sourateId}.mp3`
        : `https://www.al-hamdoulillah.com/coran/mp3/files/${reciterFolder}/${sourateId}.mp3`;
      return { id: sourateId, name: souratesNames[i], audioUrl };
    });

    setSourates(allSourates);
  }, [reciterFolder]);

  const playAudio = (index) => {
    if (sourates[index]) {
      audioRef.current.src = sourates[index].audioUrl;
      audioRef.current.play();
      setCurrentIndex(index);
    }
  };

  const pauseAudio = () => {
    audioRef.current.pause();
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const seekAudio = (e) => {
    const newTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const nextSourate = () => {
    if (currentIndex < sourates.length - 1) {
      playAudio(currentIndex + 1);
    }
  };

  const prevSourate = () => {
    if (currentIndex > 0) {
      playAudio(currentIndex - 1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!reciterFolder) {
    return <p className="text-center text-red-500 text-xl">Réciteur non trouvé.</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {reciterInfo && (
        <div className="text-center mb-6">
          <Image src={reciterInfo.image} alt={reciterInfo.name} width={128} height={128} className="mx-auto rounded-full" />
          <h1 className="text-3xl font-bold text-green-500 mt-2">{reciterInfo.name}</h1>
        </div>
      )}
      <h1 className="text-3xl font-bold text-green-500 text-center mb-6">Liste des Sourates</h1>
      <ul className="divide-y divide-gray-700">
        {sourates.map((sourate, index) => (
          <li key={sourate.id} className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-green-400">{sourate.id}. {sourate.name}</h2>
            <button onClick={() => playAudio(index)} className="mt-2 px-4 py-2 bg-green-500 rounded-lg">Écouter</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
