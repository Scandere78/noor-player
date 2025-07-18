// Test de connexion à la base de données
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Test de connexion à la base de données...');
    
    // Test simple de connexion
    const result = await prisma.$connect();
    console.log('✅ Connexion réussie !');
    
    // Test de lecture
    const userCount = await prisma.user.count();
    console.log(`📊 Nombre d'utilisateurs: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
