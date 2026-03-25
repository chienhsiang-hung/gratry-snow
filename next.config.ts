import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gratry-snow',
    images: {
      unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      'next-intl/config': path.resolve(process.cwd(), 'i18n/request.ts'),
    },
  }
};

export default withNextIntl(nextConfig as import('next').NextConfig);