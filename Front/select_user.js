// select_user.js

// Fonction pour charger les utilisateurs depuis le serveur
function chargerUtilisateurs() {
    fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(utilisateurs => {
            afficherUtilisateurs(utilisateurs);
        })
        .catch(error => console.error('Erreur lors du chargement des utilisateurs:', error));
}

document.getElementById('bouton-creer-utilisateur').addEventListener('click', function() {
    window.location.href = 'create_user.html';
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

// Fonction pour afficher la liste des utilisateurs
function afficherUtilisateurs(utilisateurs) {
    const ul = document.getElementById('liste-utilisateurs');
    utilisateurs.forEach(utilisateur => {
        const li = document.createElement('li');
        li.innerText = utilisateur.nom;
        li.style.cursor = 'pointer';
        li.style.color = motVersRGB(utilisateur.nom);
        li.classList.add('poppins-semibold');
        li.addEventListener('click', () => {
            // Enregistrer l'utilisateur dans le localStorage
            localStorage.setItem('utilisateurCourant', JSON.stringify(utilisateur));
            // Rediriger vers la page d'accueil
            window.location.href = 'index.html';
        });
        ul.appendChild(li);
    });
}

// Charger les utilisateurs au chargement de la page
chargerUtilisateurs();
