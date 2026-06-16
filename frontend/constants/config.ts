// Configuration réseau du backend local.
//  - Web    : on parle au backend sur le même hôte que la page (localhost en dev).
//  - Mobile : on récupère AUTOMATIQUEMENT l'IP de la machine depuis le serveur Metro
//             d'Expo (le téléphone s'y connecte déjà pour charger l'app). Plus besoin
//             de toucher app.json quand l'IP LAN change.
//  - Fallback : expo.extra.apiHost / apiPort dans app.json (build standalone, tunnel…).
import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiHost?: string;
  apiPort?: number;
};

const PORT = extra.apiPort ?? 8800;
const FALLBACK_HOST = extra.apiHost ?? "127.0.0.1";

/** IP/hôte du serveur de dev Expo (Metro), ex: "192.168.1.48:8081" -> "192.168.1.48". */
function devServerHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).expoGoConfig?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost ??
    null;

  if (!hostUri) return null;
  const host = String(hostUri).split(":")[0];
  if (!host) return null;

  // En mode tunnel, l'hôte n'est pas l'IP LAN de la machine -> on l'ignore.
  if (
    host.endsWith("exp.direct") ||
    host.endsWith("exp.host") ||
    host.endsWith("ngrok.io")
  ) {
    return null;
  }
  return host;
}

function resolveHost(): string {
  if (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location?.hostname
  ) {
    return window.location.hostname;
  }
  return devServerHost() ?? FALLBACK_HOST;
}

const HOST = resolveHost();

export const API_BASE_URL = `http://${HOST}:${PORT}`;
export const WS_URL = `ws://${HOST}:${PORT}/ws`;
