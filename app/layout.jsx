import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-800">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
