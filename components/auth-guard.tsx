'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AuthButton from '@/components/auth-button';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 初次載入時檢查 Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsChecking(false);
    });

    // 監聽登入/登出狀態改變
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isChecking) {
    return <div className="text-muted-foreground animate-pulse">Loading...</div>;
  }

  // 若未登入，顯示要求登入的畫面
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl border bg-card p-8 text-card-foreground shadow">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">請先登入</h2>
          <p className="text-sm text-muted-foreground">您需要登入帳號才能上傳動作</p>
        </div>
        <AuthButton />
      </div>
    );
  }

  // 若已登入，顯示原來的內容 (UploadTrickForm)
  return <>{children}</>;
}