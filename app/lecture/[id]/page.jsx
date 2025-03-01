'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LecturePage({ params }) {
  const [sourate, setSourate] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState(null);
  const sourateId = params.id || 1;
  const router = useRouter();

  useEffect(() => {
    async function fetchSourate() {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${sourateId}`);
        if (!res.ok) throw new Error("Erreur chargement sourate");
        const data = await res.json();
        setSourate(data.data);

        const resTranslation = await fetch(`https://api.alquran.cloud/v1/surah/${sourateId}/fr.hamidullah`);
        if (!resTranslation.ok) throw new Error("Erreur chargement traduction");
        const dataTranslation = await resTranslation.json();
        setTranslation(dataTranslation.data);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchSourate();
  }, [sourateId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!sourate || !translation) return <p className="text-gray-400 text-center">Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      
      {/* 🔹 Nouveau Bouton Retour stylé */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-3 px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-all duration-300 shadow-lg border border-gray-600 hover:border-green-400 hover:text-green-400 transform hover:scale-105"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Retour
      </button>

      <h1 className="text-3xl font-extrabold text-center text-gradient bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        {sourate.englishName} - {sourate.name}
      </h1>

      <p className="text-center text-gray-300 mt-2">Nombre de versets : {sourate.numberOfAyahs}</p>

      {/* 🔹 Bouton pour afficher la traduction */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="px-6 py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          {showTranslation ? "Masquer la traduction" : "Voir la traduction"}
        </button>
      </div>

      {/* 🔹 Affichage des versets */}
      <div className="space-y-6 mt-5">
        {sourate.ayahs.map((ayah, index) => (
          <div key={ayah.number} className="border-b border-gray-700 pb-3">
            {/* Texte arabe avec glow vert */}
            <p className="text-2xl font-bold text-right text-green-400 drop-shadow-md">
              {ayah.text}
            </p>

            {/* Numéro du verset en gris clair */}
            <p className="text-sm text-gray-400">Verset {ayah.numberInSurah}</p>

            {/* Traduction en français (affichée si activée) */}
            {showTranslation && (
              <p className="text-md mt-2 text-left text-blue-400 italic">
                {translation.ayahs[index]?.text || "Traduction non disponible"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
