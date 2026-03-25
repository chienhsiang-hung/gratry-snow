'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
          <UserIcon className="h-4 w-4" />
          <span>{user.user_metadata.full_name}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
          title="Log Out"
        >
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Log Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogin}
      className="group flex items-center gap-2 rounded-full px-4 transition-all"
    >
      <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span className="hidden text-sm font-medium sm:inline-block">Log In</span>
      <span className="sr-only sm:hidden">Sign in with Google</span>
    </Button>
  );
}