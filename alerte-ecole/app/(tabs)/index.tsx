import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Vibration,
  Platform,
} from "react-native";
import { auth } from "../../services/firebase";

export default function App() {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);
  const vibrationInterval = useRef<NodeJS.Timer | null>(null);
  const currentSound = useRef<Audio.Sound | null>(null);

  // 🔊 Fichiers sons (.wav)
  const soundFiles: Record<string, any> = {
    incendie: require("../../assets/sounds/incendie.wav"),
    confinement: require("../../assets/sounds/confinement.wav"),
    medical: require("../../assets/sounds/medical.wav"),
    exercise: require("../../assets/sounds/exercise.wav"),
  };

  // 🎧 Configuration audio
  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
      });
    })();
  }, []);

  // 🔊 Jouer un son en boucle
  const playSound = async (key: string) => {
    try {
      await stopAll();
      const { sound } = await Audio.Sound.createAsync(soundFiles[key], {
        shouldPlay: true,
        isLooping: true,
      });
      currentSound.current = sound;
      setIsAlertActive(true);
    } catch (e) {
      console.warn("Erreur lecture son :", e);
    }
  };

  // 🛑 Stopper tout
  const stopAll = async () => {
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }
    Vibration.cancel();

    if (currentSound.current) {
      await currentSound.current.stopAsync();
      await currentSound.current.unloadAsync();
      currentSound.current = null;
    }

    setIsAlertActive(false);
    setCurrentAlert(null);
  };

  // 💥 Vibration continue (simulée pour iPhone)
  const startVibration = (type: string) => {
    if (vibrationInterval.current) return;

    let pattern: number[] = [0, 500, 500]; // Android pattern
    let interval = 300;

    switch (type) {
      case "intrusion":
        pattern = [0, 200, 200]; // plus discret
        interval = 200;
        break;
      case "incendie":
        pattern = [0, 700, 300];
        interval = 100;
        break;
      case "confinement":
        pattern = [0, 500, 200];
        interval = 150;
        break;
      case "medical":
        pattern = [0, 600, 300];
        interval = 120;
        break;
      case "exercise":
        pattern = [0, 400, 300];
        interval = 180;
        break;
    }

    if (Platform.OS === "android") {
      // Android gère le vrai mode "vibration infinie"
      Vibration.vibrate(pattern, true);
    } else {
      // iPhone → on répète manuellement via un intervalle court
      vibrationInterval.current = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, interval);
    }

    setIsAlertActive(true);
  };

  // 🚨 Déclenche une alerte
  const handlePress = async (type: string, soundKey?: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await stopAll();
    setCurrentAlert(type);
    startVibration(soundKey || type);

    if (soundKey) {
      await playSound(soundKey);
    }

    Alert.alert("Alerte envoyée", type);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚨 Alerte École</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e63946" }]}
        onPress={() => handlePress("🔥 Incendie", "incendie")}
      >
        <Text style={styles.buttonText}>🔥 Incendie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#1d3557" }]}
        onPress={() => handlePress("🚷 Intrusion (PPMS)")}
      >
        <Text style={styles.buttonText}>🚷 Intrusion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#457b9d" }]}
        onPress={() => handlePress("🏫 Confinement", "confinement")}
      >
        <Text style={styles.buttonText}>🏫 Confinement</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#2a9d8f" }]}
        onPress={() => handlePress("💊 Médicale", "medical")}
      >
        <Text style={styles.buttonText}>💊 Médicale</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#f4a261" }]}
        onPress={() => handlePress("🟢 Exercice", "exercise")}
      >
        <Text style={styles.buttonText}>🟢 Exercice</Text>
      </TouchableOpacity>

      {isAlertActive && (
        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={stopAll}
          >
            <Text style={styles.buttonText}>🛑 Stopper l’Alerte</Text>
          </TouchableOpacity>

          {currentAlert && (
            <Text style={styles.alertText}>
              Alerte en cours : {currentAlert}
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6c757d", marginTop: 30 }]}
        onPress={handleLogout}
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
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1d3557",
  },
  button: {
    width: "80%",
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  alertText: {
    marginTop: 10,
    color: "#e63946",
    fontSize: 16,
    fontWeight: "bold",
  },
});
