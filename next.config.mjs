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
};

export default nextConfig;
