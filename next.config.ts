import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin(
  path.resolve(__dirname, './i18n/request.ts')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gratry-snow',
    images: {
      unoptimized: true,
  }
};

export default withNextIntl(nextConfig as import('next').NextConfig);