import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../services/authContext";

function MainLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
