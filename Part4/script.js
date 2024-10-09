// Récupération des données via fetch
fetch('https://random-data-api.com/api/v2/users?size=10')
    .then(function(res) { 
        return res.json(); 
    })
    .then(function(donnees) {
        // Appel à la fonction d'affichage des utilisateurs
        afficherUtilisateurs(donnees);
    });

// Fonction impérative pour afficher les données dans la page
function afficherUtilisateurs(utilisateurs) {
    const container = document.getElementById('users-container');
    
    utilisateurs.forEach(function(utilisateur) {
        // Créer une div pour chaque utilisateur
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');

        // Ajouter les données utilisateur (nom, email, adresse)
        userDiv.innerHTML = `
            <h2>${utilisateur.first_name} ${utilisateur.last_name}</h2>
            <p>Email: ${utilisateur.email}</p>
            <p>Adresse: ${utilisateur.address.city}, ${utilisateur.address.street_name}</p>
            <hr>
        `;

        // Ajouter l'utilisateur dans le conteneur
        container.appendChild(userDiv);
    });
}
