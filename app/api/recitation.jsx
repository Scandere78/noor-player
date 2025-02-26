export default function handler(req, res) {
    const { imam, position } = req.query;  // Récupère 'imam' et 'position' de la query string
  
    const audioLinks = {
      'abdul-basit': {
        1: "https://www.mp3quran.net/audio/abdul-basit/al_fatiha.mp3",
        2: "https://www.mp3quran.net/audio/abdul-basit/al_baqarah.mp3",
        3: "https://www.mp3quran.net/audio/abdul-basit/aal_imran.mp3", // Ajoute plus de sourates si nécessaire
      },
      'mishary': {
        1: "https://www.mp3quran.net/audio/mishary/al_fatiha.mp3",
        2: "https://www.mp3quran.net/audio/mishary/al_baqarah.mp3",
        3: "https://www.mp3quran.net/audio/mishary/aal_imran.mp3",
      },
      'saad': {
        1: "https://www.mp3quran.net/audio/saad/al_fatiha.mp3",
        2: "https://www.mp3quran.net/audio/saad/al_baqarah.mp3",
        3: "https://www.mp3quran.net/audio/saad/aal_imran.mp3",
      },
      'yasser': {
        1: "https://www.mp3quran.net/audio/yasser/al_fatiha.mp3",
        2: "https://www.mp3quran.net/audio/yasser/al_baqarah.mp3",
        3: "https://www.mp3quran.net/audio/yasser/aal_imran.mp3",
      },
    };
  
    // Vérifie si l'imam et la sourate existent
    const audioUrl = audioLinks[imam] && audioLinks[imam][position];
  
    if (audioUrl) {
      return res.status(200).json({ audio_url: audioUrl });
    } else {
      return res.status(404).json({ error: "Audio non trouvé" });
    }
  }
  