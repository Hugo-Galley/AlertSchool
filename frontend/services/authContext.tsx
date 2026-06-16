// Contexte d'authentification (sans Firebase) : charge le profil stocké au démarrage.
import React, { createContext, useContext, useEffect, useState } from "react";
import * as auth from "./auth";
import { registerForPushNotificationsAsync } from "./notifications";

type AuthContextType = {
  user: auth.AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<auth.AppUser>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<auth.AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await auth.getStoredUser();
      setUser(u);
      if (u) {
        registerForPushNotificationsAsync();
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const u = await auth.login(email, password);
    setUser(u);
    registerForPushNotificationsAsync();
    return u;
  };

  const signOut = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used in AuthProvider");
  return c;
};
