/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver le pré-rendu statique pour les API routes
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Gérer les erreurs de build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimisation des images
  images: {
    domains: ['localhost'],
  },
  // Éviter la collecte de données des pages API au build
  generateBuildId: async () => {
    return 'noor-player-build';
  },
  // Configuration pour les API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
