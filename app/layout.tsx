// 檔案位置：app/layout.tsx
import { ReactNode } from 'react';

// 這是一個「隱形」的 Root Layout，單純用來安撫 Next.js 編譯器，
// 讓它願意編譯我們自帶 <html> 標籤的 not-found.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}