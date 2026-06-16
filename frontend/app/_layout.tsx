import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../services/authContext";

function Gate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const root = segments[0];

    if (!user) {
      // Non connecté : on force l'écran de login
      if (root !== "login") router.replace("/login");
      return;
    }

    // Connecté : si on est sur login ou à la racine, on route selon le rôle
    if (root === "login" || root === undefined) {
      router.replace(user.role === "director" ? "/director/dashboard" : "/(tabs)");
    }
  }, [user, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
