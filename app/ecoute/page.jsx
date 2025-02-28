import { useState } from 'react';

const videos = [
  { id: 1, title: "Abdul Basit - Sourate Al-Fatiha", url: "https://www.youtube.com/embed/3Z1f23QVAHY" },
  { id: 2, title: "Mishary Alafasy - Sourate Al-Baqarah", url: "https://www.youtube.com/embed/tLlAvF3XyUw" },
  { id: 3, title: "Saad Al-Ghamdi - Sourate Yassin", url: "https://www.youtube.com/embed/Tc9MrS4R1O4" },
];

export default function Ecoute() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0].url);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-500">Écoute du Coran</h1>
      
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row">
        {/* Liste des vidéos */}
        <div className="md:w-1/3 space-y-4">
          {videos.map((video) => (
            <button 
              key={video.id} 
              className="block w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
              onClick={() => setSelectedVideo(video.url)}
            >
              {video.title}
            </button>
          ))}
        </div>

        {/* Lecteur vidéo */}
        <div className="md:w-2/3 mt-6 md:mt-0 flex justify-center">
          <iframe 
            width="560" 
            height="315" 
            src={selectedVideo} 
            title="Lecture du Coran"
            frameBorder="0" 
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
