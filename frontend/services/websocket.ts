// Connexion WebSocket aux alertes, avec reconnexion automatique.
import { WS_URL } from "../constants/config";
import { getToken } from "./auth";

export type AlertPayload = {
  id: number;
  type: string;
  school_id: number;
  triggered_by: number;
  active: boolean;
  created_at: string | null;
};

export type AlertEvent =
  | { event: "new_alert"; alert: AlertPayload }
  | { event: "stop_alert"; alert_id: number };

/**
 * Ouvre la connexion WebSocket et appelle `onEvent` à chaque message.
 * Retourne une fonction de fermeture (à appeler dans le cleanup du useEffect).
 */
export async function connectAlerts(
  onEvent: (e: AlertEvent) => void
): Promise<() => void> {
  const token = await getToken();
  let ws: WebSocket | null = null;
  let closed = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data) as AlertEvent);
      } catch {
        // message non-JSON ignoré
      }
    };

    ws.onclose = () => {
      // Reconnexion automatique tant qu'on n'a pas fermé volontairement
      if (!closed) {
        retryTimer = setTimeout(open, 2000);
      }
    };

    ws.onerror = () => {
      ws?.close();
    };
  };

  open();

  return () => {
    closed = true;
    if (retryTimer) clearTimeout(retryTimer);
    ws?.close();
  };
}
