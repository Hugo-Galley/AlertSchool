import { Stack } from "expo-router";

// Espace enseignant : un seul écran (boutons d'alerte), pas de barre d'onglets.
export default function TeacherLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
