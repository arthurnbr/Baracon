let utilisateurCourant = null;

// Fonction pour vérifier si l'utilisateur est connecté
function verifierUtilisateur() {
    const utilisateurStocke = localStorage.getItem('utilisateurCourant');
    if (utilisateurStocke) {
        utilisateurCourant = JSON.parse(utilisateurStocke);
        document.getElementById('bouton-deconnexion').style.display = 'block';
    } else {
        // Rediriger vers la page de sélection d'utilisateur
        window.location.href = 'select_user.html';
    }
}

document.getElementById('bouton-deconnexion').addEventListener('click', function() {
    localStorage.removeItem('utilisateurCourant');
    window.location.href = 'select_user.html';
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

function afficherClassement() {
    fetch('http://localhost:3000/api/leaderboard')
        .then(response => response.json())
        .then(utilisateurs => {
            // Le leaderboard est déjà trié par taux d'alcoolémie décroissant
            let tbody = document.getElementById('tableau-classement');
            tbody.innerHTML = ''; // Vider le tableau

            utilisateurs.forEach((utilisateur, index) => {
                let tr = document.createElement('tr');

                let tdRang = document.createElement('td');
                tdRang.innerText = index + 1;
                tdRang.style.color = motVersRGB(utilisateur.nom);
                tr.appendChild(tdRang);

                let tdNom = document.createElement('td');
                tdNom.innerText = utilisateur.nom;
                tdNom.style.color = motVersRGB(utilisateur.nom);
                tr.appendChild(tdNom);

                let alcoolpur = document.createElement('td');
                alcoolpur.innerText = utilisateur.alcool_pur_total.toFixed(3);
            
                alcoolpur.style.color = motVersRGB(utilisateur.nom);
                tr.appendChild(alcoolpur);

                let tdBAC = document.createElement('td');
                tdBAC.innerText = utilisateur.bac.toFixed(3);
                tdBAC.style.color = motVersRGB(utilisateur.nom);
                tr.appendChild(tdBAC);

                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erreur lors du chargement du classement:', error));
}

// Ajouter un événement au bouton pour retourner à la page d'ajout de boisson
document.getElementById('bouton-ajout').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Appeler la fonction pour afficher le classement
afficherClassement();
