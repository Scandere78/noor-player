"use client";

import { FaInstagram, FaSnapchat, FaTiktok } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-green-500 mb-4">As Salam Aleykoom</h1>
      <p className="text-center text-gray-300 max-w-2xl">
        Bienvenue sur NoorPlay ! 🌙 Cette plateforme a été créée pour offrir un accès 
        facile et intuitif à la lecture et l'écoute du Coran. Profitez d'une interface 
        moderne et fluide pour explorer les récitations de vos imams préférés.
      </p>

      {/* Message de contact */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg text-center">
        <p className="text-gray-300">
          📩 Un problème ou une suggestion ? Contacte-moi sur mes réseaux ! 
        </p>
      </div>

      {/* Réseaux sociaux */}
      <div className="mt-6 flex gap-6">
        {/* Instagram */}
        <a href="https://www.instagram.com/al.musafiroon" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-4xl text-pink-500 hover:text-pink-400 transition" />
        </a>

        {/* Snapchat */}
        <a href="https://www.snapchat.com/add/Skahh.783" target="_blank" rel="noopener noreferrer">
          <FaSnapchat className="text-4xl text-yellow-500 hover:text-yellow-400 transition" />
        </a>
      </div>
    </div>
  );
}
