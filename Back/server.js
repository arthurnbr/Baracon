const express = require('express');
const app = express();
const mysql = require('mysql2');

// Pour parser le JSON dans les requêtes POST
app.use(express.json());

// Ajouter ce middleware pour définir les en-têtes CORS dans les réponses de l'API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Autoriser les méthodes HTTP spécifiques
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Autoriser les en-têtes spécifiques
  next();
});

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'dev',
  password: 'poplpopl',
  database: 'alcool_tracker'
});

// Connecter à la base de données
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MariaDB.');
  }
});

// Route pour obtenir la liste des utilisateurs
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      res.status(500).json([]);
    } else {
      res.json(results);
    }
  });
});

// Route pour ajouter une consommation
app.post('/api/consumptions', (req, res) => {
  const { user_id, drink_type, alcool_pur } = req.body;

  if (!user_id || !drink_type || !alcool_pur) {
    return res.status(400).json({ success: false, message: 'Données manquantes' });
  }

  const sql = 'INSERT INTO consumptions (user_id, drink_type, alcool_pur) VALUES (?, ?, ?)';
  db.query(sql, [user_id, drink_type, alcool_pur], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la consommation:', err);
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// Ajouter cette partie dans server.js après les autres routes

// Route pour créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { nom, poids } = req.body;

  // Validation des données
  if (!nom || !poids) {
      return res.status(400).json({ success: false, message: 'Données manquantes ou invalides' });
  }

  // Vérifier si l'utilisateur existe déjà
  const sqlCheck = 'SELECT * FROM users WHERE nom = ?';
  db.query(sqlCheck, [nom], (err, results) => {
      if (err) {
          console.error('Erreur lors de la vérification de l\'utilisateur existant :', err);
          return res.status(500).json({ success: false, message: 'Erreur du serveur' });
      }

      if (results.length > 0) {
          return res.status(400).json({ success: false, message: 'Un utilisateur avec ce nom existe déjà' });
      }

      // Insérer le nouvel utilisateur dans la base de données
      const sqlInsert = 'INSERT INTO users (nom, poids, taille) VALUES (?, ?, 0)';
      db.query(sqlInsert, [nom, poids], (err, result) => {
          if (err) {
              console.error('Erreur lors de la création de l\'utilisateur :', err);
              return res.status(500).json({ success: false, message: 'Erreur du serveur' });
          }

          res.json({ success: true });
      });
  });
});


// Route pour obtenir le classement
// Route pour obtenir le classement avec le taux d'alcoolémie
app.get('/api/leaderboard', (req, res) => {
  const sqlUsers = 'SELECT id, nom, poids FROM users';

  db.query(sqlUsers, async (err, users) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      return res.status(500).json([]);
    }

    const currentTime = new Date();

    let leaderboardData = [];

    for (const user of users) {
      try {
        const consumptions = await new Promise((resolve, reject) => {
          const sqlConsumptions = 'SELECT alcool_pur, date FROM consumptions WHERE user_id = ?';
          db.query(sqlConsumptions, [user.id], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        let totalBAC = 0;
        let alcool_pur_total = 0;

        for (const consumption of consumptions) {
          const alcoolPurEnLitres = consumption.alcool_pur; // en litres
          const alcoolPurEnGrammes = alcoolPurEnLitres * 789; // 1 litre d'alcool pur = 789 grammes

          const weightInKg = user.poids; // Poids en kg

          const widmarkFactor = 0.7; // Coefficient de diffusion

          const timeOfDrink = new Date(consumption.date);
          const timeElapsedInHours = (currentTime - timeOfDrink) / (1000 * 60 * 60); // En heures

          const eliminationRatePerHour = 0.10; // Coefficient d'élimination (g/L/h)

          // Calculer le BAC contribution
          let bacContribution = (alcoolPurEnGrammes) / (weightInKg * widmarkFactor);

          // Ajuster pour l'élimination
          bacContribution -= eliminationRatePerHour * timeElapsedInHours;

          // Le BAC ne peut pas être négatif
          if (bacContribution < 0) bacContribution = 0;

          alcool_pur_total += alcoolPurEnGrammes;
          totalBAC += bacContribution;
        }

        leaderboardData.push({
          id: user.id,
          nom: user.nom,
          alcool_pur_total: alcool_pur_total,
          bac: totalBAC
        });

      } catch (err) {
        console.error('Erreur lors de la récupération des consommations:', err);
        return res.status(500).json([]);
      }
    }

    // Trier les utilisateurs par taux d'alcoolémie décroissant
    leaderboardData.sort((a, b) => b.bac - a.bac);
    res.json(leaderboardData);

  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
