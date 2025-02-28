'use client';

import { useState, useEffect } from "react";

export default function LecturePage({ params }) {
  const [sourate, setSourate] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSourate() {
      try {
        // Récupérer les versets en arabe
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${params.id}`);
        if (!res.ok) throw new Error('Erreur lors de la récupération de la sourate');
        const data = await res.json();
        setSourate(data.data);

        // Récupérer la traduction française
        const translationRes = await fetch(`https://api.quran.com/api/v4/quran/translations/85?chapter_number=${params.id}`);
        if (!translationRes.ok) throw new Error('Erreur lors de la récupération des traductions');
        const translationData = await translationRes.json();

        console.log("Traductions reçues :", JSON.stringify(translationData, null, 2));

        // Vérifier que l'API retourne bien un tableau de traductions
        if (translationData.translations && Array.isArray(translationData.translations)) {
          setTranslations(translationData.translations.map(t => t.text)); // On récupère juste le texte des traductions
        } else {
          throw new Error("Structure des traductions inattendue");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        setError(error.message);
      }
    }

    fetchSourate();
  }, [params.id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!sourate) return <p className="text-white">Chargement...</p>;

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl text-white font-bold">
        {sourate.englishName} - {sourate.name}
      </h1>
      <p className="text-white">Révélation : {sourate.revelationType}</p>
      <p className="mt-2 mb-4 text-white">Nombre de versets : {sourate.numberOfAyahs}</p>

      <button
        onClick={toggleTranslation}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        {showTranslation ? "Masquer la traduction" : "Afficher la traduction en English"}
      </button>

      <div className="space-y-4 mt-5">
        {sourate.ayahs.map((ayah, index) => (
          <div key={ayah.number} className="border-b border-gray-600 pb-2">
            {/* Texte en arabe en doré */}
            <p className="text-lg font-semibold text-right text-green-400">
              {ayah.text}
            </p>
            <p className="text-sm text-gray-400">Verset {ayah.numberInSurah}</p>

            {/* Traduction en bleu si affichée */}
            {showTranslation && translations[index] && (
              <p className="text-md mt-2 text-left text-blue-600">
                {translations[index] || "Pas de traduction disponible"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
