const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Connexion à la base de données...');
    
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie à MongoDB');
    
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@noorplayer.com',
        password: hashedPassword,
        name: 'Utilisateur Test'
      }
    });
    
    console.log('✅ Utilisateur créé:', user);
      // Créer les stats utilisateur
    const userStats = await prisma.userStats.create({
      data: {
        userId: user.id,
        totalVersesRead: 0,
        dailyGoal: 10,
        readingStreak: 0,
        streakRecord: 0
      }
    });
    
    console.log('✅ Stats utilisateur créées:', userStats);
    
    // Lister tous les utilisateurs
    const allUsers = await prisma.user.findMany({
      include: {
        userStats: true,
        readingProgress: true
      }
    });
    
    console.log('👥 Tous les utilisateurs:', allUsers);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
