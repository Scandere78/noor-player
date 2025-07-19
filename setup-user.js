console.log('🧹 Nettoyage et création d\'un utilisateur de test');

async function setupTestUser() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    // 1. Créer un nouvel utilisateur
    console.log('📝 Création d\'un nouvel utilisateur...');
    
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Utilisateur Principal',
        email: 'user@noor.com',
        password: 'motdepasse123'
      })
    });

    let token;
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      token = registerData.token;
      console.log('✅ Nouvel utilisateur créé avec succès');
      console.log('🔑 Token:', token.substring(0, 20) + '...');
    } else {
      // Essayer de se connecter
      console.log('👤 Tentative de connexion...');
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@noor.com',
          password: 'motdepasse123'
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        token = loginData.token;
        console.log('✅ Connexion réussie');
        console.log('🔑 Token:', token.substring(0, 20) + '...');
      } else {
        console.error('❌ Échec de connexion et d\'inscription');
        return;
      }
    }

    // 2. Tester le dashboard
    console.log('\n📊 Test du dashboard...');
    
    const dashboardResponse = await fetch(`${baseURL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Dashboard accessible:', {
        utilisateur: dashboardData.user?.name,
        versets_aujourd_hui: dashboardData.readingStats?.todayVerses || 0,
        objectif_quotidien: dashboardData.readingStats?.dailyGoal || 0
      });
    } else {
      const error = await dashboardResponse.text();
      console.error('❌ Erreur dashboard:', error);
    }

    // 3. Enregistrer quelques versets pour tester
    console.log('\n📖 Ajout de versets de test...');
    
    const versesToAdd = [
      { surah: 1, verse: 1, name: 'Al-Fatiha' },
      { surah: 1, verse: 2, name: 'Al-Fatiha' },
      { surah: 1, verse: 3, name: 'Al-Fatiha' }
    ];

    for (const verse of versesToAdd) {
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
        console.log(`✅ Verset ${verse.surah}:${verse.verse} ajouté`);
      } else {
        console.log(`❌ Erreur verset ${verse.surah}:${verse.verse}`);
      }
    }

    // 4. Vérifier à nouveau le dashboard
    console.log('\n🔄 Vérification finale du dashboard...');
    
    const finalDashboardResponse = await fetch(`${baseURL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (finalDashboardResponse.ok) {
      const finalData = await finalDashboardResponse.json();
      console.log('✅ Dashboard final:', {
        utilisateur: finalData.user?.name,
        versets_aujourd_hui: finalData.readingStats?.todayVerses || 0,
        versets_total: finalData.readingStats?.totalVerses || 0,
        position_actuelle: finalData.readingStats?.currentPosition,
        objectif_progres: finalData.readingStats?.goalProgress || 0
      });

      console.log('\n🎉 Configuration terminée ! Utilisez ces identifiants :');
      console.log('📧 Email: user@noor.com');
      console.log('🔒 Mot de passe: motdepasse123');
      
    } else {
      const error = await finalDashboardResponse.text();
      console.error('❌ Erreur dashboard final:', error);
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

// Lancer la configuration
setupTestUser();
