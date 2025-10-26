'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getKeycloakInstance, initKeycloak, loginWithKeycloak, logoutKeycloak, getKeycloakUserInfo, isKeycloakConfigured } from '../lib/keycloak';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [authMethod, setAuthMethod] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const kcConfigured = isKeycloakConfigured();

      if (kcConfigured) {
        const authenticated = await initKeycloak((keycloak) => {
          const userInfo = getKeycloakUserInfo();
          if (userInfo) {
            setUser(userInfo);
            setAuthMethod('keycloak');
          }
        });

        if (!authenticated) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            setAuthMethod(session ? 'supabase' : null);
          }
        }
      } else {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setAuthMethod(session ? 'supabase' : null);
        }
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const keycloak = getKeycloakInstance();
        if (!keycloak?.authenticated) {
          setSession(session);
          setUser(session?.user ?? null);
          setAuthMethod(session ? 'supabase' : null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithKeycloak = async () => {
    try {
      if (!isKeycloakConfigured()) {
        return { error: { message: 'Keycloak not configured' } };
      }
      loginWithKeycloak();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (authMethod === 'keycloak') {
        logoutKeycloak();
        setUser(null);
        setAuthMethod(null);
        return { error: null };
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
      }
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInAsDemo = async () => {
    try {
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: 'demo@salesmind.app',
        user_metadata: {
          name: 'demo',
          full_name: 'Demo User'
        }
      };

      setUser(demoUser);
      setAuthMethod('demo');

      return { data: { user: demoUser }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    authMethod,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithKeycloak,
    signInAsDemo,
    signOut,
    resetPassword,
    isKeycloakConfigured: isKeycloakConfigured()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}