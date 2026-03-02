import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: AppRole;
  department_id: string | null;
  department_name?: string;
  mobile_number: string | null;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, departments(name)')
      .eq('user_id', userId)
      .maybeSingle();

    if (data && !error) {
      setProfile({
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
        department_id: data.department_id,
        department_name: (data.departments as any)?.name ?? null,
        mobile_number: data.mobile_number,
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, profile, session, login, logout, 
      isAuthenticated: !!session, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role label helper
export const getRoleLabel = (role: AppRole): string => {
  const labels: Record<AppRole, string> = {
    superadmin: 'Central Admin (Dean)',
    admin: 'Department Admin (HOD)',
    pi: 'Principal Investigator',
    co_pi: 'Co-Principal Investigator',
    assistant: 'Assistant',
    jrf: 'JRF',
    student: 'Student',
  };
  return labels[role] || 'User';
};
