import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const DEMO_USER = {
  email: 'demo@workspace.com',
  password: 'demo123456',
  username: 'Demo User'
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Auto-login demo user
    const initDemoUser = async () => {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false);
        return;
      }

      // Try to sign in with demo user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_USER.email,
        password: DEMO_USER.password,
      });

      if (signInError) {
        // If sign in fails, try to create the demo user
        const { error: signUpError } = await supabase.auth.signUp({
          email: DEMO_USER.email,
          password: DEMO_USER.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: DEMO_USER.username,
              display_name: DEMO_USER.username,
            },
          },
        });

        if (!signUpError) {
          // Sign in after creating account
          await supabase.auth.signInWithPassword({
            email: DEMO_USER.email,
            password: DEMO_USER.password,
          });
        }
      }
      
      setLoading(false);
    };

    initDemoUser();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Auto re-login demo user
    setTimeout(() => {
      supabase.auth.signInWithPassword({
        email: DEMO_USER.email,
        password: DEMO_USER.password,
      });
    }, 100);
  };

  return { user, session, loading, signOut };
};
