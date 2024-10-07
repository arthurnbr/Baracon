-- Créer la base de données (si elle n'existe pas déjà)
CREATE DATABASE IF NOT EXISTS alcool_tracker;
USE alcool_tracker;

-- Supprimer les tables existantes (Attention : ceci effacera toutes les données)
DROP TABLE IF EXISTS consumptions;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    taille INT NOT NULL,
    poids INT NOT NULL
);

-- Table des consommations
CREATE TABLE consumptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    drink_type ENUM('pils', 'forte', 'shoot') NOT NULL,
    alcool_pur FLOAT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
