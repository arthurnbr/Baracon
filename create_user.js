// create_user.js

// Gestion de la soumission du formulaire
document.getElementById('form-creer-utilisateur').addEventListener('submit', function(event) {
    event.preventDefault();

    const nom = document.getElementById('nom').value.trim();
    const poids = parseInt(document.getElementById('poids').value);

    // Validation simple des données
    if (!nom || isNaN(poids)) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    // Envoyer les données au serveur pour créer l'utilisateur
    fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, poids })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Utilisateur créé avec succès !');
            // Rediriger vers la sélection d'utilisateur
            window.location.href = 'select_user.html';
        } else {
            alert('Erreur lors de la création de l\'utilisateur : ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        alert('Une erreur est survenue.');
    });
});

// Gestion du bouton de retour
document.getElementById('bouton-retour').addEventListener('click', function() {
    window.location.href = 'select_user.html';
});
