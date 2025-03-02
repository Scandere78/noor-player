// app/sourates/page.jsx
'use client';
import { useRouter } from 'next/navigation';

const recitateurs = [
  { id: 'abdul-basit', name: 'Abdul Basit', image: '/img/abdul-basit.webp' },
  { id: 'hussary', name: 'Mahmoud Al Hussary', image: '/img/mahmoud.jpg' },
  { id: 'saad', name: 'Saad Al Ghamidi', image: '/img/saad-al-ghamdi.jpg' },
  { id: 'yasser', name: 'Yasser Al Dossari', image: '/img/yasser-al-dossari.png' },
  { id: 'afs', name: 'Mishary Al Afasi', image: '/img/mishary.webp' },
  { id: 'balilah', name: 'Bandar Balila', image: '/img/bandar-balila.jpg' },
  { id: 'sds', name: "Abdul Rahman Al-Sudais", image: "/img/sudais.jpg"},
  { id: 'maher', name: "Maher Al Meaqli - Rewayat Hafs A'n Assem", image: "/img/Maher.png"},
];

export default function Recitateurs() {
  const router = useRouter();

  const goToReciter = (id) => {
    router.push(`/sourates/${id}`);
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Choisissez un réciteur</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {recitateurs.map((reciter) => (
          <div
            key={reciter.id}
            className="relative cursor-pointer flex items-center justify-center w-48 h-48 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full shadow-xl hover:scale-110 transition-transform duration-300"
            onClick={() => goToReciter(reciter.id)}
          >
            <img 
              src={reciter.image} 
              alt={reciter.name} 
              className="w-44 h-44 object-cover rounded-full border-4 border-white" 
            />
            <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-lg font-semibold text-center py-2 rounded-b-full">
              {reciter.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
