# 🏃 Sprint 1 — MVP (1 semaine) · 3 devs full-stack

**Objectif :** Une app fonctionnelle où un enseignant peut déclencher une alerte, et où le directeur peut la voir en temps réel et gérer les comptes.

**Hors scope MVP :** localisation, confirmation de réception, canal de communication, alerte automatique aux secours, historique des alertes, notifications push.

---

## 🔧 SETUP — Jour 1 (toute l'équipe)

| # | Tâche | Responsable | Durée est. |
|---|-------|-------------|------------|
| S1 | Créer le repo Git + structure monorepo (`/frontend`, `/backend`) | Dev 1 | 1h |
| S2 | Initialiser le projet **Expo / React Native** avec TypeScript | Dev 2 | 1h |
| S3 | Initialiser le projet **FastAPI** + structure des dossiers | Dev 3 | 1h |
| S4 | Créer la base **MySQL** avec les 3 tables : `users`, `schools`, `alerts` | Dev 3 | 2h |
| S5 | Définir et partager le contrat d'API (endpoints + format JSON) | Tous | 1h |

---

## 🔐 AUTHENTIFICATION — Jour 1-2

| # | Tâche | Responsable | Durée est. |
|---|-------|-------------|------------|
| A1 | Backend — endpoint `POST /auth/login` avec JWT en réponse | Dev 1 | 2h |
| A2 | Backend — middleware de vérification JWT sur routes protégées | Dev 1 | 1h |
| A3 | Frontend — écran de login (email + mot de passe) | Dev 2 | 2h |
| A4 | Frontend — stockage du token JWT + redirection selon le rôle (`teacher` / `director`) | Dev 2 | 1h |

---

## 🚨 ALERTE D'URGENCE — Jour 2-4

| # | Tâche | Responsable | Durée est. |
|---|-------|-------------|------------|
| AL1 | Backend — endpoint `POST /alerts` (créer une alerte) | Dev 3 | 2h |
| AL2 | Backend — WebSocket server : diffuser l'alerte à tous les connectés du même établissement | Dev 1 | 3h |
| AL3 | Frontend — écran principal enseignant avec **5 boutons d'alerte** (Incendie, Intrusion, Médical, Confinement, Météo) | Dev 2 | 3h |
| AL4 | Frontend — connexion WebSocket côté client + réception de l'alerte | Dev 3 | 2h |
| AL5 | Frontend — affichage de l'alerte reçue avec signal adapté (son / vibration / visuel selon le type) | Dev 2 | 3h |

---

## 👨‍💼 VUE DIRECTEUR — Jour 3-5

| # | Tâche | Responsable | Durée est. |
|---|-------|-------------|------------|
| D1 | Backend — endpoint `GET /users` (liste des enseignants de l'établissement) | Dev 3 | 1h |
| D2 | Backend — endpoint `POST /users` (créer un compte enseignant) | Dev 1 | 1h |
| D3 | Backend — endpoint `DELETE /users/:id` (supprimer un compte) | Dev 1 | 1h |
| D4 | Frontend — écran directeur : vue temps réel de l'alerte en cours (via WebSocket) | Dev 3 | 2h |
| D5 | Frontend — écran gestion des comptes : liste + bouton créer + bouton supprimer | Dev 2 | 3h |

---

## ✅ TESTS & INTÉGRATION — Jour 5

| # | Tâche | Responsable | Durée est. |
|---|-------|-------------|------------|
| T1 | Test du flux complet : login enseignant → alerte → réception par directeur | Tous | 2h |
| T2 | Test de la gestion des comptes par le directeur | Tous | 1h |
| T3 | Fix des bugs bloquants identifiés | Tous | 2h |

---

## 📅 Planning de la semaine

| Jour | Dev 1 | Dev 2 | Dev 3 |
|------|-------|-------|-------|
| Lundi | Setup + A1 + A2 | Setup + A3 + A4 | Setup + S4 + S5 |
| Mardi | AL2 (WebSocket back) | AL3 (écran alertes) | AL1 + AL4 |
| Mercredi | D2 + D3 | AL5 (signaux) | AL4 fin + D1 |
| Jeudi | Intégration front/back | D5 (gestion comptes) | D4 (vue directeur) |
| Vendredi | T1 + T2 + T3 | T1 + T2 + T3 | T1 + T2 + T3 |

---

## ⚠️ Points de risque

- **AL2 — WebSocket backend** est la tâche la plus complexe : la prioriser dès le mardi matin
- **S5 — Contrat d'API** doit être validé le lundi matin pour permettre le travail en parallèle front/back
- Prévoir un **mock WebSocket côté front** si le back n'est pas prêt, pour ne pas bloquer Dev 2 et Dev 3