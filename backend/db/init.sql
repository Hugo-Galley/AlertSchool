-- Schéma d'initialisation de la base Alerte École (MVP)
-- Exécuté automatiquement au premier démarrage du conteneur MySQL.

CREATE DATABASE IF NOT EXISTS alerte_ecole
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alerte_ecole;

-- Établissements scolaires
CREATE TABLE IF NOT EXISTS schools (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Utilisateurs (enseignants & directeurs)
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  school_id     INT NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  role          ENUM('teacher', 'director') NOT NULL DEFAULT 'teacher',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_school FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Alertes déclenchées
CREATE TABLE IF NOT EXISTS alerts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  school_id    INT NOT NULL,
  type         VARCHAR(50) NOT NULL,        -- incendie / intrusion / confinement / medical / exercice
  triggered_by INT NOT NULL,                -- users.id
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alerts_school FOREIGN KEY (school_id) REFERENCES schools(id),
  CONSTRAINT fk_alerts_user FOREIGN KEY (triggered_by) REFERENCES users(id)
);

CREATE INDEX idx_alerts_school ON alerts(school_id);
CREATE INDEX idx_users_school ON users(school_id);
