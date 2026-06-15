# Task 05 : Tests & Intégration Finale

## Objectif
Valider la stabilité du MVP et corriger les derniers bugs.

## Instructions pour l'Agent IA
1.  **Flux Complet** :
    - Simuler deux utilisateurs (1 enseignant, 1 directeur).
    - Déclencher une alerte côté enseignant.
    - Vérifier la réception instantanée côté directeur.
2.  **Gestion d'Erreurs** :
    - Vérifier le comportement en cas de perte de connexion réseau (reconnexion WebSocket automatique).
    - Vérifier les messages d'erreur lors d'un mauvais login.
3.  **UI/UX** :
    - Harmoniser les couleurs (Rouge/Orange pour les alertes).
    - S'assurer que les textes sont tous en Français.

## Critères de Succès
- Le flux nominal fonctionne sans crash.
- L'application est utilisable en conditions réelles.
