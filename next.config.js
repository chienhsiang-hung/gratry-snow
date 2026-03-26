import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: process.env.IS_LOCAL === 'true' ? 'test/gratry-snow' : 'out',
  basePath: '/gratry-snow',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);