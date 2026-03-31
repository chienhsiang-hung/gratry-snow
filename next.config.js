import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  experimental: {
    cpus: 1, 
    memoryBasedWorkersCount: true,
  },
  allowedDevOrigins: [
    '3000-firebase-gratry-snow-1774935121198.cluster-yylgzpipxrar4v4a72liastuqy.cloudworkstations.dev'
  ],
};

export default withNextIntl(nextConfig);