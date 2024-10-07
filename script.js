let utilisateurs = [];
let utilisateurCourant = null;

// Fonction pour charger les utilisateurs depuis le serveur
function chargerUtilisateurs() {
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => {
            utilisateurs = data;
            initialiserUtilisateur();
        })
        .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
}

// Fonction pour initialiser l'utilisateur
function initialiserUtilisateur() {
    // Vérifier si un utilisateur est stocké dans le localStorage
    const utilisateurStocke = localStorage.getItem('utilisateurCourant');
    if (utilisateurStocke) {
        utilisateurCourant = JSON.parse(utilisateurStocke);
        afficherInterfaceUtilisateur();
    } else {
        window.location.href = 'select_user.html';
    }
}

document.getElementById('bouton-deconnexion').addEventListener('click', function() {
    localStorage.removeItem('utilisateurCourant');
    window.location.href = 'select_user.html';
});

// Fonction pour afficher l'interface après sélection de l'utilisateur
function afficherInterfaceUtilisateur() {
    document.getElementById('titre-utilisateur').innerText = `Un ptit verre ${utilisateurCourant.nom} ?`;
    document.getElementById('boisson-form').style.display = 'flex';
    document.getElementById('bouton-leaderboard').style.display = 'flex';
    // Change the background color to motVersRGB(username)
    const username = utilisateurCourant.nom;
    const backgroundColor = motVersRGB(username);
    document.body.style.backgroundColor = backgroundColor;
}

// Fonction pour afficher la pop-up de sélection de l'utilisateur
function demanderUtilisateur() {
    let noms = utilisateurs.map(u => u.nom);
    let nom = prompt('Veuillez choisir votre nom:\n' + noms.join('\n'));
    utilisateurCourant = utilisateurs.find(u => u.nom === nom);

    if (utilisateurCourant) {
        // Enregistrer l'utilisateur dans le localStorage
        localStorage.setItem('utilisateurCourant', JSON.stringify(utilisateurCourant));
        afficherInterfaceUtilisateur();
    } else {
        window.location.href = 'select_user.html';
    }
}

// Gestion des événements
document.getElementById('type-boisson').addEventListener('change', function() {
    let typeBoisson = this.value;
    if (typeBoisson === 'biere') {
        document.getElementById('biere-options').style.display = 'flex';
    } else {
        document.getElementById('biere-options').style.display = 'none';
    }
});

document.getElementById('ajouter-boisson').addEventListener('click', function() {
    let typeBoisson = document.getElementById('type-boisson').value;
    let alcoolPurAjoute = 0;
    let drinkType = '';

    if (typeBoisson === 'shoot') {
        // Shoot de 4cl à 30%
        alcoolPurAjoute = 0.04 * 0.30;
        drinkType = 'shoot';
    } else if (typeBoisson === 'biere') {
        let typeBiere = document.getElementById('type-biere').value;
        if (typeBiere === 'pils') {
            // Pils de 25cl à 5%
            alcoolPurAjoute = 0.25 * 0.05;
            drinkType = 'pils';
        } else if (typeBiere === 'forte') {
            // Bière forte de 25cl à 8%
            alcoolPurAjoute = 0.25 * 0.08;
            drinkType = 'forte';
        }
    }

    // Envoyer les données au serveur pour mise à jour
    fetch('http://localhost:3000/api/consumptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: utilisateurCourant.id,
            drink_type: drinkType,
            alcool_pur: alcoolPurAjoute
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Vous avez ajouté ${alcoolPurAjoute.toFixed(3) * 100} cl d'alcool pur.`);
        } else {
            alert('Erreur lors de l\'ajout de la boisson.');
        }
    })
    .catch(error => console.error('Erreur:', error));
});

// Ajouter un événement au bouton pour aller au leaderboard
document.getElementById('bouton-leaderboard').addEventListener('click', function() {
    window.location.href = 'leaderboard.html';
});



function motVersRGB(mot) {
    let hash = 0;

    // Calculer une valeur numérique à partir du mot
    for (let i = 0; i < mot.length; i++) {
        hash = mot.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convertir en entier 32 bits
    }

    // Extraire les composantes RGB
    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;

    // Retourner la couleur au format 'rgb(r, g, b)'
    return `rgb(${r}, ${g}, ${b})`;
}

// Charger les utilisateurs au chargement de la page
chargerUtilisateurs();
