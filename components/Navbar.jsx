import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-green-500 cursor-pointer">
            Noor Play ▶️
          </span>
        </Link>

        {/* Liens de navigation */}
        <div className="space-x-6">
          <Link href="/ecoute">
            <span className="hover:text-green-400 cursor-pointer">Écoute</span>
          </Link>
          <Link href="/lecture">
            <span className="hover:text-green-400 cursor-pointer">Lecture</span>
          </Link>
          <Link href="/Récitateur">
            <span className="hover:text-green-400 cursor-pointer">Récitateur</span>
          </Link>
          <Link href="/about">
            <span className="hover:text-green-400 cursor-pointer">À propos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
