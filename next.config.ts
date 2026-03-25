import createNextIntlPlugin from 'next-intl/plugin';

// Pass the correct path to your request.ts file here
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gratry-snow',
    images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {} 
  }
};

export default withNextIntl(nextConfig as import('next').NextConfig);