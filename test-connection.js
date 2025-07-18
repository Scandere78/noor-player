// test-connection.js
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔄 Test de connexion à MongoDB...');
    console.log('URL:', process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie !');
    
    // Test d'une requête simple
    const result = await prisma.$runCommandRaw({
      ping: 1
    });
    console.log('✅ Ping réussi:', result);
    
    // Test de création d'un utilisateur
    console.log('🔄 Test de création d\'utilisateur...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword123'
      }
    });
    console.log('✅ Utilisateur créé:', testUser);
    
    // Supprimer l'utilisateur test
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Utilisateur test supprimé');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Code d\'erreur:', error.code);
    
    if (error.message.includes('Server selection timeout')) {
      console.log('\n🔧 Solutions possibles:');
      console.log('1. Vérifiez votre connexion internet');
      console.log('2. Vérifiez les paramètres de votre cluster MongoDB Atlas');
      console.log('3. Vérifiez que votre IP est autorisée dans MongoDB Atlas');
      console.log('4. Vérifiez que votre cluster est démarré');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
