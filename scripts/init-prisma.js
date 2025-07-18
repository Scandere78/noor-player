#!/usr/bin/env node

// Script pour initialiser Prisma
const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Initialisation de Prisma...');

try {
  // Nettoyer le cache
  console.log('📦 Nettoyage du cache...');
  execSync('rm -rf node_modules/.prisma', { stdio: 'inherit' });
  
  // Générer le client Prisma
  console.log('⚙️  Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Pousser le schéma vers MongoDB
  console.log('🗄️  Synchronisation avec MongoDB...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Initialisation terminée avec succès!');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error.message);
  process.exit(1);
}
