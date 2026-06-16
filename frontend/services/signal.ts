// Gestion du signal d'alerte (son en boucle + vibration), partagé enseignant/directeur.
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";
import { ALERT_BY_TYPE } from "../constants/alerts";

let currentSound: Audio.Sound | null = null;
let hapticTimer: ReturnType<typeof setInterval> | null = null;
let audioConfigured = false;

async function configureAudio() {
  if (audioConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
    });
  } catch {
    // pas d'audio (ex: web restreint) — on continue sans bloquer
  }
  audioConfigured = true;
}

export async function startSignal(type: string) {
  await stopSignal();
  const cfg = ALERT_BY_TYPE[type];
  if (!cfg) return;

  // Vibration
  try {
    if (Platform.OS === "android") {
      Vibration.vibrate(cfg.vibrationPattern, true);
    } else if (Platform.OS === "ios") {
      hapticTimer = setInterval(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
        cfg.hapticInterval
      );
    }
  } catch {
    // ignore
  }

  // Son en boucle
  if (cfg.sound) {
    await configureAudio();
    try {
      const { sound } = await Audio.Sound.createAsync(cfg.sound, {
        shouldPlay: true,
        isLooping: true,
      });
      currentSound = sound;
    } catch (e) {
      console.warn("Erreur lecture son :", e);
    }
  }
}

export async function stopSignal() {
  if (hapticTimer) {
    clearInterval(hapticTimer);
    hapticTimer = null;
  }
  try {
    Vibration.cancel();
  } catch {
    // ignore
  }
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {
      // ignore
    }
    currentSound = null;
  }
}
