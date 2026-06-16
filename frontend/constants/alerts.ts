// Définition centralisée des 5 types d'alerte (label, couleur, son, vibration).
export type AlertType =
  | "incendie"
  | "intrusion"
  | "confinement"
  | "medical"
  | "exercice";

export type AlertConfig = {
  type: AlertType;
  label: string;
  color: string;
  sound: any | null; // require(...) du .wav, ou null (vibration seule)
  vibrationPattern: number[]; // pattern Android / intervalle haptique iOS
  hapticInterval: number; // ms entre impacts haptiques (iOS / web)
};

export const ALERTS: AlertConfig[] = [
  {
    type: "incendie",
    label: "🔥 Incendie",
    color: "#e63946",
    sound: require("../assets/sounds/incendie.wav"),
    vibrationPattern: [0, 700, 300],
    hapticInterval: 100,
  },
  {
    type: "intrusion",
    label: "🚷 Intrusion",
    color: "#1d3557",
    sound: null, // PPMS intrusion : pas de son (discrétion), vibration seule
    vibrationPattern: [0, 200, 200],
    hapticInterval: 200,
  },
  {
    type: "confinement",
    label: "🏫 Confinement",
    color: "#457b9d",
    sound: require("../assets/sounds/confinement.wav"),
    vibrationPattern: [0, 500, 200],
    hapticInterval: 150,
  },
  {
    type: "medical",
    label: "💊 Médicale",
    color: "#2a9d8f",
    sound: require("../assets/sounds/medical.wav"),
    vibrationPattern: [0, 600, 300],
    hapticInterval: 120,
  },
  {
    type: "exercice",
    label: "🟢 Exercice",
    color: "#f4a261",
    sound: require("../assets/sounds/exercise.wav"),
    vibrationPattern: [0, 400, 300],
    hapticInterval: 180,
  },
];

export const ALERT_BY_TYPE: Record<string, AlertConfig> = Object.fromEntries(
  ALERTS.map((a) => [a.type, a])
);
