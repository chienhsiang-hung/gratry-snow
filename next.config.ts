import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/gratry-snow',
  
  // GitHub Pages 不支援 Next.js 預設的圖片優化 API，如果你有使用 <Image /> 元件，需要加上這個設定
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig as import('next').NextConfig);