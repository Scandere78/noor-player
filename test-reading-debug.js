// Test simple pour vérifier l'enregistrement des versets
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

async function testReadingProgress() {
  try {
    console.log('=== Test de la progression de lecture ===');
    
    // 1. Se connecter (vous devez adapter avec un vrai utilisateur)
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com', // Remplacez par un vrai email de test
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('Erreur de connexion:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Connexion réussie');
    
    // 2. Enregistrer un verset
    const progressResponse = await fetch(`${API_BASE}/api/reading/progress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        surahNumber: 1,
        verseNumber: 1,
        surahName: 'Al-Fatiha',
        readingTime: 30
      })
    });
    
    if (progressResponse.ok) {
      console.log('✅ Verset enregistré:', await progressResponse.json());
    } else {
      console.log('❌ Erreur enregistrement:', await progressResponse.text());
    }
    
    // 3. Récupérer les stats du dashboard
    const dashboardResponse = await fetch(`${API_BASE}/api/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('📊 Stats dashboard:');
      console.log('- Versets aujourd\'hui:', dashboardData.readingStats.todayVerses);
      console.log('- Versets cette semaine:', dashboardData.readingStats.weekVerses);
      console.log('- Total versets:', dashboardData.readingStats.totalVerses);
    } else {
      console.log('❌ Erreur dashboard:', await dashboardResponse.text());
    }
    
  } catch (error) {
    console.error('Erreur test:', error);
  }
}

// Exécuter le test
testReadingProgress();
