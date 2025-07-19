console.log('🔧 Test des APIs de lecture - Noor Player');

// Script pour tester l'enregistrement et l'affichage des versets lus
async function testReadingSystem() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    // 1. Créer un utilisateur test s'il n'existe pas
    console.log('📝 Création d\'un utilisateur test...');
    
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@noor.com',
        password: 'test123'
      })
    });

    let token;
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      token = registerData.token;
      console.log('✅ Utilisateur créé avec succès');
    } else {
      // Essayer de se connecter
      console.log('👤 Tentative de connexion...');
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@noor.com',
          password: 'test123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        token = loginData.token;
        console.log('✅ Connexion réussie');
      } else {
        console.error('❌ Échec de connexion');
        return;
      }
    }

    // 2. Enregistrer quelques versets
    console.log('\n📖 Enregistrement de versets...');
    
    const versesToRead = [
      { surah: 1, verse: 1, name: 'Al-Fatiha' },
      { surah: 1, verse: 2, name: 'Al-Fatiha' },
      { surah: 1, verse: 3, name: 'Al-Fatiha' },
      { surah: 2, verse: 1, name: 'Al-Baqara' },
      { surah: 2, verse: 2, name: 'Al-Baqara' }
    ];

    for (const verse of versesToRead) {
      const progressResponse = await fetch(`${baseURL}/reading/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          surahNumber: verse.surah,
          verseNumber: verse.verse,
          surahName: verse.name,
          readingTime: 30
        })
      });

      if (progressResponse.ok) {
        console.log(`✅ Verset ${verse.surah}:${verse.verse} enregistré`);
      } else {
        const error = await progressResponse.text();
        console.error(`❌ Erreur verset ${verse.surah}:${verse.verse}:`, error);
      }
    }

    // 3. Vérifier les statistiques du dashboard
    console.log('\n📊 Vérification des statistiques...');
    
    const dashboardResponse = await fetch(`${baseURL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Dashboard récupéré:', {
        versets_aujourd_hui: dashboardData.readingStats?.todayVerses || 0,
        versets_total: dashboardData.readingStats?.totalVerses || 0,
        position_actuelle: dashboardData.readingStats?.currentPosition || 'Aucune',
        objectif_quotidien: dashboardData.readingStats?.dailyGoal || 0
      });
    } else {
      const error = await dashboardResponse.text();
      console.error('❌ Erreur dashboard:', error);
    }

    // 4. Tester la récupération de la progression
    console.log('\n📈 Vérification de la progression...');
    
    const progressResponse = await fetch(`${baseURL}/reading/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ Progression récupérée:', {
        statistiques_utilisateur: progressData.userStats || 'Aucune',
        nombre_de_progres: progressData.recentProgress?.length || 0
      });
    } else {
      const error = await progressResponse.text();
      console.error('❌ Erreur progression:', error);
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Lancer le test
testReadingSystem();
