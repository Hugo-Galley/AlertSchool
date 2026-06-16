import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "../services/authContext";

function Gate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Notification reçue quand l'appli est au premier plan
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification reçue :", notification);
      }
    );

    // Utilisateur a tapé sur la notification (appli en arrière-plan ou fermée)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const alertType = response.notification.request.content.data?.type;
        console.log("Notification tapée, type :", alertType);
        if (user) {
          router.replace(user.role === "director" ? "/director/dashboard" : "/(tabs)");
        }
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user]);

  useEffect(() => {
    if (loading) return;
    const root = segments[0];

    if (!user) {
      if (root !== "login") router.replace("/login");
      return;
    }

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
