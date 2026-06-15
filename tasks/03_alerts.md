# Task 03 : Système d'Alertes Temps Réel (WebSockets)

## Objectif
Permettre le déclenchement d'alertes et leur diffusion instantanée au sein de l'établissement.

## Instructions pour l'Agent IA
1.  **Backend** :
    - Créer l'endpoint `POST /alerts` (enregistre l'alerte en base).
    - Implémenter le gestionnaire de WebSockets (`/backend/websocket/manager.py`) permettant de gérer des "rooms" par `school_id`.
    - Diffuser un message JSON à tous les membres de la même école dès qu'une alerte est reçue sur `/alerts`.
2.  **Frontend** :
    - Créer l'écran Enseignant (`/app/teacher/home.tsx`) avec les 5 boutons d'alerte.
    - Créer un service WebSocket (`/services/websocket.ts`) qui se connecte au démarrage et écoute les événements `new_alert`.
    - Implémenter les signaux (vibration via `expo-haptics`, son via `expo-av`).

## Critères de Succès
- L'appui sur un bouton d'alerte crée une entrée en DB.
- Tous les téléphones connectés de la même école reçoivent l'alerte en moins d'une seconde.
- Les signaux visuels/sonores se déclenchent correctement.
