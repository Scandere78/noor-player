"use client";

import Link from 'next/link';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function Home() {
  const recitateurs = [
    { name: "Abdul Basit", image: "/img/abdul-basit.webp" },
    { name: "Mishary Rashid", image: "/img/mishary.webp" },
    { name: "Saad Al Ghamdi", image: "/img/saad-al-ghamdi.jpg" },
    { name: "Yasser Al Dosari", image: "/img/yasser-al-dossari.png" },
  ];

  return (
    <div className="py-10 bg-gray-900 text-white min-h-screen">
      {/* Présentation */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-green-500">Bienvenue sur NoorPlay</h1>
        <p className="mt-2 text-lg text-gray-300">
          Écoutez et lisez le Coran facilement avec une interface intuitive.
        </p>
      </div>

      {/* Cartes de fonctionnalités */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-6">
        <Link href="/lecture">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer">
            <h2 className="text-2xl font-bold text-green-400">📖 Lecture du Coran</h2>
            <p className="mt-2 text-gray-300">Lisez le Coran avec traduction.</p>
          </div>
        </Link>
        <Link href="/sourates" passHref>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer">
            <h2 className="text-2xl font-bold text-green-400">🎧 Écoute du Coran</h2>
            <p className="mt-2 text-gray-300">Écoutez le Coran récité par différents imams.</p>
          </div>
        </Link>
        <Link href="/quizz" passHref>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer">
            <h2 className="text-2xl font-bold text-green-400">🎯 Quizz</h2>
            <p className="mt-2 text-gray-300">Testez vos connaissances sur différents thèmes</p>
          </div>
        </Link>
      </div>

      {/* Carrousel des récitateurs */}
      <div className="mt-16 px-6">
        <h2 className="text-3xl font-bold text-green-500 text-center">🎙️ Récitateurs</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 2500 }}
          pagination={{ clickable: true }}
          className="mt-6 h-full"
        >
          {recitateurs.map((recitateur, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <Link href={`/sourates`} passHref>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-700 transition">
                  <img
                    src={recitateur.image}
                    alt={recitateur.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover"
                  />
                  <h3 className="mt-2 text-xl font-bold">{recitateur.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
