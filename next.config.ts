import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const i18nPath = './' + path.relative(process.cwd(), path.resolve(process.cwd(), 'i18n/request.ts'));

const withNextIntl = createNextIntlPlugin(i18nPath);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gratry-snow',
    images: {
      unoptimized: true,
  }
};

export default withNextIntl(nextConfig as import('next').NextConfig);