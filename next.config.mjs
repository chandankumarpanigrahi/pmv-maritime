/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.170'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', 'driver.js', 'motion', 'react-hot-toast'],
  },
  async redirects() {
    return [
      {
        source: '/services/consultancy',
        destination: '/services/marine-consultancy',
        permanent: true,
      },
      {
        source: '/services/training',
        destination: '/services/maritime-training',
        permanent: true,
      },
      {
        source: '/services/fleet',
        destination: '/services/fleet-management',
        permanent: true,
      },
      {
        source: '/services/crew',
        destination: '/services/crew-management',
        permanent: true,
      },
      {
        source: '/services/shipbuilding',
        destination: '/services/ship-building',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
