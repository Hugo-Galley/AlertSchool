# Task 02 : Authentification JWT

## Objectif
Implémenter le flux de connexion sécurisé entre le mobile et le serveur.

## Instructions pour l'Agent IA
1.  **Backend** :
    - Créer le modèle `User` avec `password_hash` (hasher avec `passlib[bcrypt]`).
    - Créer l'endpoint `POST /auth/login` qui valide les identifiants et retourne un JWT.
    - Le JWT doit inclure : `user_id`, `role`, `school_id`.
    - Créer une dépendance FastAPI `get_current_user` qui valide le token sur les routes protégées.
2.  **Frontend** :
    - Créer l'écran de login (`/app/login.tsx`).
    - Créer un service d'auth (`/services/auth.ts`) utilisant `axios` et `expo-secure-store`.
    - Gérer la redirection automatique après login vers l'écran correspondant au rôle.

## Critères de Succès
- Un utilisateur peut se connecter.
- Le token est stocké de manière sécurisée sur le mobile.
- Les routes backend protégées rejettent les requêtes sans token valide.
