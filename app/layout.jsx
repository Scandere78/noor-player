import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-800">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 md:pt-20">
            {children}
          </main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
