import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// 建立 next-intl 外掛並指定 request 檔案位置
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);