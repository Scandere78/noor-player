"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-green-500 cursor-pointer">
            Noor Play ▶️
          </span>
        </Link>

        {/* Bouton Menu Hamburger (Mobile) */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Liens de navigation (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link href="/lecture">
            <span className="hover:text-green-400 cursor-pointer">Lecture</span>
          </Link>
          <Link href="/sourates">
            <span className="hover:text-green-400 cursor-pointer">Écoute</span>
          </Link>
          <Link href="/dourous">
            <span className="hover:text-green-400 cursor-pointer">Dourous</span>
          </Link>
          <Link href="/about">
            <span className="hover:text-green-400 cursor-pointer">À propos</span>
          </Link>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center space-y-6 transition-transform duration-300 z-[1000] backdrop-blur-md">
          <button
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>

          <Link href="/lecture">
            <span className="text-xl hover:text-green-400 cursor-pointer" onClick={() => setIsOpen(false)}>Lecture</span>
          </Link>
          <Link href="/sourates">
            <span className="text-xl hover:text-green-400 cursor-pointer" onClick={() => setIsOpen(false)}>Écoute</span>
          </Link>
          <Link href="/dourous">
            <span className="text-xl hover:text-green-400 cursor-pointer" onClick={() => setIsOpen(false)}>Dourous</span>
          </Link>
          <Link href="/about">
            <span className="text-xl hover:text-green-400 cursor-pointer" onClick={() => setIsOpen(false)}>À propos</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
