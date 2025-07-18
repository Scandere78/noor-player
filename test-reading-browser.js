// Test simple des APIs de lecture avec un script browser
// Pour tester: Ouvrir la console du navigateur sur http://localhost:3000 et coller ce code

async function testReadingAPIs() {
  console.log('🧪 Test des APIs de lecture');
  
  // Simuler une connexion utilisateur (remplacez par un vrai token)
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ Aucun token d\'authentification trouvé. Veuillez vous connecter d\'abord.');
    return;
  }
  
  try {
    // Test 1: Récupérer la progression actuelle
    console.log('📖 Test récupération progression...');
    const progressResponse = await fetch('/api/reading/progress', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ Progression récupérée:', progressData);
    } else {
      console.log('❌ Erreur récupération progression:', await progressResponse.text());
    }
    
    // Test 2: Enregistrer une progression
    console.log('📝 Test enregistrement progression...');
    const recordResponse = await fetch('/api/reading/progress', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        surahNumber: 1,
        verseNumber: 5,
        surahName: 'Al-Fatiha',
        readingTime: 30
      })
    });
    
    if (recordResponse.ok) {
      const recordData = await recordResponse.json();
      console.log('✅ Progression enregistrée:', recordData);
    } else {
      console.log('❌ Erreur enregistrement progression:', await recordResponse.text());
    }
    
    // Test 3: Mettre à jour l'objectif quotidien
    console.log('🎯 Test mise à jour objectif...');
    const goalResponse = await fetch('/api/reading/goal', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dailyGoal: 15 })
    });
    
    if (goalResponse.ok) {
      const goalData = await goalResponse.json();
      console.log('✅ Objectif mis à jour:', goalData);
    } else {
      console.log('❌ Erreur mise à jour objectif:', await goalResponse.text());
    }
    
    // Test 4: Récupérer les stats du dashboard
    console.log('📊 Test récupération dashboard...');
    const dashboardResponse = await fetch('/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Stats dashboard récupérées:', dashboardData);
    } else {
      console.log('❌ Erreur récupération dashboard:', await dashboardResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter les tests
testReadingAPIs();
