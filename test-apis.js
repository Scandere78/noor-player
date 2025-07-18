// test-apis.js
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Test des APIs de lecture...');
    
    // Test avec un token fictif (vous devrez utiliser un vrai token)
    const token = 'your-jwt-token-here';
    
    // Test 1: Récupérer les stats du dashboard
    console.log('\n📊 Test dashboard stats...');
    const statsResponse = await fetch('http://localhost:3000/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Dashboard stats récupérées:', JSON.stringify(stats, null, 2));
    } else {
      console.log('❌ Erreur dashboard:', statsResponse.status, await statsResponse.text());
    }
    
    // Test 2: Enregistrer un progrès de lecture
    console.log('\n📖 Test enregistrement lecture...');
    const progressResponse = await fetch('http://localhost:3000/api/reading/progress', {
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
      const progress = await progressResponse.json();
      console.log('✅ Progrès enregistré:', progress);
    } else {
      console.log('❌ Erreur enregistrement:', progressResponse.status, await progressResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Pour lancer le test, décommentez la ligne suivante et ajoutez un vrai token
// testAPI();

console.log('📝 Pour tester les APIs:');
console.log('1. Connectez-vous sur l\'application');
console.log('2. Récupérez votre token JWT depuis localStorage');
console.log('3. Remplacez "your-jwt-token-here" par votre token');
console.log('4. Décommentez la ligne testAPI() et lancez: node test-apis.js');
