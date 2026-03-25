'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

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
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
            Hi, {user.user_metadata.full_name || user.email}!
        </span>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={handleLogin}>
      Login with Google
    </Button>
  );
}