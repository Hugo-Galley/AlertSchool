# Task 01 : Initialisation du Projet & Base de Données

## Objectif
Mettre en place la structure monorepo et initialiser les frameworks frontend et backend ainsi que la base de données.

## Instructions pour l'Agent IA
1.  **Structure Monorepo** : Créer les dossiers `/frontend` et `/backend` à la racine.
2.  **Frontend (Expo)** :
    - Initialiser un projet Expo dans `/frontend` avec TypeScript.
    - Configurer l'arborescence : `/app`, `/components`, `/services`.
    - Installer et configurer **shadcn/ui** (React Native) et **Tailwind CSS**.
    - Installer les dépendances de base : `axios`, `expo-secure-store`.
3.  **Backend (FastAPI)** :
    - Initialiser un projet FastAPI dans `/backend`.
    - Configurer l'arborescence : `/routers`, `/models`, `/db`, `/websocket`.
    - Créer un `requirements.txt` avec `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `mysql-connector-python`.
4.  **Base de données** :
    - Créer un script SQL d'initialisation (`/backend/db/init.sql`) basé sur `docs/DB_SCHEMA.md`.
    - Implémenter la connexion SQLAlchemy dans `/backend/db/session.py`.

## Critères de Succès
- Le frontend démarre avec `npx expo start`.
- Le backend démarre avec `uvicorn main:app`.
- La connexion à MySQL est fonctionnelle.
