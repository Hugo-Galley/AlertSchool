# Task 04 : Vue Directeur & Gestion de Comptes

## Objectif
Donner au directeur les outils de supervision et de gestion des accès.

## Instructions pour l'Agent IA
1.  **Backend** :
    - Créer les endpoints CRUD pour les utilisateurs (`GET /users`, `POST /users`, `DELETE /users/{id}`).
    - **Sécurité** : Vérifier que le rôle de l'appelant est `director` ET que l'utilisateur géré appartient au même `school_id`.
2.  **Frontend** :
    - Créer l'écran Directeur (`/app/director/dashboard.tsx`) : vue temps réel de l'alerte en cours.
    - Créer l'écran de gestion des enseignants (`/app/director/users.tsx`) : liste, bouton d'ajout (modal) et bouton de suppression.

## Critères de Succès
- Seul le directeur peut accéder à ces écrans.
- Le directeur ne peut pas voir ou supprimer des enseignants d'une autre école.
- La création d'un compte enseignant fonctionne immédiatement.
