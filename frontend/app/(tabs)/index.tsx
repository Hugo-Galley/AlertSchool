import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERTS, ALERT_BY_TYPE, AlertType } from "../../constants/alerts";
import { api } from "../../services/api";
import { useAuth } from "../../services/authContext";
import { startSignal, stopSignal } from "../../services/signal";
import { connectAlerts } from "../../services/websocket";

export default function TeacherHome() {
  const { signOut, user } = useAuth();
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const activeIdRef = useRef<number | null>(null);

  // Connexion WebSocket : réception des alertes de l'établissement
  useEffect(() => {
    let close: (() => void) | undefined;
    connectAlerts((e) => {
      if (e.event === "new_alert") {
        activeIdRef.current = e.alert.id;
        setActiveType(e.alert.type);
        setActiveUser(e.alert.triggering_user?.full_name || null);
        startSignal(e.alert.type);
      } else if (e.event === "stop_alert") {
        activeIdRef.current = null;
        setActiveType(null);
        setActiveUser(null);
        stopSignal();
      }
    }).then((c) => (close = c));

    return () => {
      close?.();
      stopSignal();
    };
  }, []);

  // Déclenche une alerte : on POST, le son/vibration arrive via le WebSocket
  const triggerAlert = async (type: AlertType) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await api.post("/alerts", { type });
    } catch {
      Alert.alert("Erreur", "Impossible d'envoyer l'alerte (serveur injoignable ?)");
    }
  };

  const handleStop = async () => {
    const id = activeIdRef.current;
    // Arrêt local immédiat
    setActiveType(null);
    setActiveUser(null);
    stopSignal();
    if (id != null) {
      try {
        await api.post(`/alerts/${id}/stop`);
      } catch {
        // l'arrêt local a déjà eu lieu
      }
    }
  };

  const activeCfg = activeType ? ALERT_BY_TYPE[activeType] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Alerte École</Text>
      {user && <Text style={styles.subtitle}>{user.full_name}</Text>}

      {ALERTS.map((a) => (
        <TouchableOpacity
          key={a.type}
          style={[styles.button, { backgroundColor: a.color }]}
          onPress={() => triggerAlert(a.type)}
        >
          <Text style={styles.buttonText}>{a.label}</Text>
        </TouchableOpacity>
      ))}

      {activeCfg && (
        <View style={styles.activeBox}>
          <Text style={styles.alertText}>
            Alerte en cours : {activeCfg.label}
          </Text>
          {activeUser && (
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: "500", color: "#333" }}>
              Déclenchée par : {activeUser}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={handleStop}
          >
            <Text style={styles.buttonText}>🛑 Stopper l'alerte</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6c757d", marginTop: 30 }]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f1faee",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 64,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4, color: "#1d3557" },
  subtitle: { fontSize: 15, color: "#6c757d", marginBottom: 24 },
  button: {
    width: "80%",
    maxWidth: 420,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  activeBox: { marginTop: 32, width: "100%", alignItems: "center" },
  alertText: {
    marginBottom: 10,
    color: "#e63946",
    fontSize: 16,
    fontWeight: "bold",
  },
});
