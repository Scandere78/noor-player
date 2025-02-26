import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gray-800">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
