import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <h1 className="text-4xl font-bold">Snowboard Tricks Hub</h1>
      <p className="text-muted-foreground">我的專屬滑雪平花筆記與影片庫</p>
      
      {/* 這裡放入我們剛剛做好的明暗模式切換按鈕 */}
      <ThemeToggle />
    </main>
  );
}