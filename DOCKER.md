# 🐳 Guide Docker — Alerte École

Dans ce projet, **Docker sert à faire tourner la base de données MySQL**.
Le backend (FastAPI) et le frontend (Expo) tournent nativement — voir le [README](README.md).

Le fichier qui décrit le conteneur est [`docker-compose.yml`](docker-compose.yml) (à la racine).

---

## ⚡ TL;DR

```bash
docker compose up -d      # démarrer MySQL (en arrière-plan)
docker compose ps         # vérifier qu'il tourne
docker compose down       # arrêter (les données sont conservées)
```

> Toutes les commandes `docker compose` se lancent **depuis la racine du projet**
> (là où se trouve `docker-compose.yml`).

---

## 0. Prérequis : Docker Desktop doit tourner

Sur Mac, lance **Docker Desktop** (icône 🐳 dans la barre de menus) et attends qu'il soit « Running ».

Vérifier que le démon répond :

```bash
docker info
```

Si tu vois `Cannot connect to the Docker daemon`, c'est que Docker Desktop n'est pas démarré.

---

## 1. Démarrer MySQL

```bash
docker compose up -d
```

- `up` crée et démarre le conteneur.
- `-d` (*detached*) le lance en arrière-plan, tu récupères ton terminal.

Au **tout premier démarrage**, Docker :
1. télécharge l'image `mysql:8.4` (une fois) ;
2. crée la base `alerte_ecole` et l'utilisateur `alerte` ;
3. exécute `backend/db/init.sql` pour créer les tables (`schools`, `users`, `alerts`).

### Attendre que MySQL soit prêt

MySQL met quelques secondes à être réellement prêt. Le conteneur a un *healthcheck* :

```bash
docker compose ps
```

Attends que la colonne **STATUS** affiche `healthy` avant de lancer le backend ou le seed.

---

## 2. Coordonnées de connexion

Le conteneur est exposé sur le port hôte **3307** (le 3306 est souvent déjà pris par un
autre MySQL sur la machine).

| Paramètre | Valeur |
|-----------|--------|
| Hôte | `127.0.0.1` |
| Port | `3307` |
| Base | `alerte_ecole` |
| Utilisateur | `alerte` / mot de passe `alerte` |
| Root | `root` / mot de passe `root` |

C'est ce que reflète le `DATABASE_URL` du backend :
`mysql+mysqlconnector://alerte:alerte@127.0.0.1:3307/alerte_ecole`

---

## 3. Commandes du quotidien

```bash
# Voir l'état du conteneur
docker compose ps

# Voir les logs (suivre en direct : -f)
docker compose logs mysql
docker compose logs -f mysql

# Arrêter (CONSERVE les données)
docker compose down

# Arrêter SANS supprimer le conteneur (le remettre en route plus tard)
docker compose stop
docker compose start

# Redémarrer
docker compose restart
```

---

## 4. Se connecter à la base

### Depuis le conteneur (sans rien installer)

```bash
docker compose exec mysql mysql -ualerte -palerte alerte_ecole
```

Puis, dans le prompt MySQL :

```sql
SHOW TABLES;
SELECT id, email, role FROM users;
SELECT * FROM alerts ORDER BY created_at DESC LIMIT 5;
```

### Depuis un client externe (TablePlus, DBeaver, DataGrip…)

Utilise les coordonnées de la section 2 (hôte `127.0.0.1`, port `3307`).

---

## 5. Réinitialiser la base (repartir de zéro)

⚠️ **Efface toutes les données** (utilisateurs, alertes).

```bash
docker compose down -v      # -v supprime aussi le volume de données
docker compose up -d        # recrée une base vierge + tables
```

Puis recrée les comptes de démo :

```bash
cd backend && .venv/bin/python seed.py
```

> `init.sql` n'est rejoué **que** lorsque le volume est vide (donc après un `down -v`).
> Modifier `init.sql` sans réinitialiser le volume n'aura aucun effet.

---

## 6. Ordre de lancement complet du projet

```bash
# 1) Base de données (racine)
docker compose up -d
docker compose ps                       # attendre "healthy"

# 2) Backend (dossier backend/)
cd backend
.venv/bin/python seed.py                # 1re fois seulement
.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8800

# 3) Frontend (dossier frontend/)
cd frontend
npm run web                             # ou npm start pour mobile
```

---

## 7. Dépannage

| Symptôme | Solution |
|----------|----------|
| `Cannot connect to the Docker daemon` | Démarre **Docker Desktop** et attends qu'il soit « Running ». |
| `ports are not available: ... 3307` | Le port 3307 est pris. Change le mapping dans `docker-compose.yml` (`"3308:3306"`) **et** le port dans `backend/config.py` / `backend/.env` (`DATABASE_URL`). |
| Backend : `Can't connect to MySQL` | MySQL pas encore prêt → `docker compose ps` jusqu'à `healthy`. Ou conteneur arrêté → `docker compose up -d`. |
| Tables absentes / schéma modifié non pris en compte | `init.sql` ne se rejoue que sur volume vide → `docker compose down -v` puis `up -d`. |
| Voir ce qui ne va pas | `docker compose logs mysql` |
| Tout nettoyer (conteneur + données) | `docker compose down -v` |

---

## ℹ️ Et le backend dans Docker ?

Aujourd'hui, seul MySQL est conteneurisé ; le backend tourne en local (venv Python) pour
faciliter le développement (rechargement à chaud, debug). Si un jour vous voulez **tout lancer
en une commande** (`docker compose up` démarre MySQL **et** le backend), il suffira d'ajouter
un `Dockerfile` au backend et un second service dans `docker-compose.yml`. Demandez-le si besoin.
