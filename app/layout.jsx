import React from "react";
import "@/styles/globals.css"

const RootLayout = ({ children }) => {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lecture du Coran</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-green-700 text-white py-4 px-6 shadow-md">
            <h1 className="text-2xl font-bold">Lecture du Coran</h1>
          </header>

          {/* Contenu principal */}
          <main className="flex-grow container mx-auto p-4">{children}</main>

          {/* Footer */}
          <footer className="bg-green-700 text-white py-4 px-6 text-center mt-4">
            <p>© {new Date().getFullYear()} Tous droits réservés</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
