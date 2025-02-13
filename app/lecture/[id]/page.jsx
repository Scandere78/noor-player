'use client';

import { useState, useEffect } from "react";

export default function LecturePage({ params }) {
  const [sourate, setSourate] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [error, setError] = useState(null); // État pour gérer les erreurs

  // Fonction pour récupérer les données de la sourate
  useEffect(() => {
    async function fetchSourate() {
      try {
        // Récupérer les données de la sourate
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${params.id}`);
        if (!res.ok) throw new Error('Erreur lors de la récupération de la sourate');
        const data = await res.json();
        setSourate(data.data);

        // Utilisation de l'API Quran.com pour récupérer les traductions en français
        const translationRes = await fetch(`https://api.quran.com/api/v4/verses/${params.id}?language=fr`);
        if (!translationRes.ok) throw new Error('Erreur lors de la récupération des traductions');
        const translationData = await translationRes.json();
        setTranslations(translationData.data.ayahs); // Stocke les traductions
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        setError(error.message); // Stocker le message d'erreur
      }
    }

    fetchSourate();
  }, [params.id]);

  if (error) return <p className="text-red-500">{error}</p>; // Affichage d'erreur
  if (!sourate) return <p>Chargement...</p>;

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{sourate.englishName} - {sourate.name}</h1>
      <p className="text-gray-600">Révélation : {sourate.revelationType}</p>
      <p className="mt-2 mb-4">Nombre de versets : {sourate.numberOfAyahs}</p>

      <button
        onClick={toggleTranslation}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        {showTranslation ? "Masquer la traduction" : "Afficher la traduction en français"}
      </button>

      <div className="space-y-4 mt-5">
        {sourate.ayahs.map((ayah, index) => (
          <div key={ayah.number} className="border-b pb-2">
            <p className="text-lg font-semibold text-right">{ayah.text}</p>
            <p className="text-sm text-gray-500">Verset {ayah.numberInSurah}</p>

            {showTranslation && translations[index] && (
              <p className="text-md mt-2 text-left text-blue-600">
                {translations[index]?.text || "Pas de traduction disponible"} {/* Si traduction inexistante */}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
