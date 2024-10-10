const readlineSync = require('readline-sync');

// Variable pour stocker les contacts
const contacts = [];

// Fonction pour demander le nom du contact
const getUserName = () => {
    const name = readlineSync.question('Entrez le nom du contact : ');
    return name;
};

// Fonction pour demander l'adresse du contact
const getUserAddress = () => {
    const address = readlineSync.question('Entrez l\'adresse de votre contact:');
    return address;
};

// Fonction pour faire une requête à l'API Adresse
const fetchAddressFromAPI = async (userAddress) => {
    const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(userAddress)}&limit=1`;

    try {
        const response = await fetch(apiUrl); 
        const data = await response.json();

        // Vérifier s'il y a des résultats
        if (data.features && data.features.length > 0) {
            const bestMatch = data.features[0];
            const adresse = bestMatch.properties.label;
            const latitude = bestMatch.geometry.coordinates[1];
            const longitude = bestMatch.geometry.coordinates[0]; 

            return { adresse, latitude, longitude };  // Retourner les informations d'adresse et coordonnées
        } else {
            console.log('Aucune adresse trouvée.');
            return null;  // Retourner null si aucune adresse n'est trouvée
        }
    } catch (error) {
        console.error('Erreur lors de la requête à l\'API:', error);
        return null;  // Retourner null en cas d'erreur
    }
};

// Fonction principale avec une boucle
const main = async () => {
    let continueSearch = true;

    while (continueSearch) {
        const userName = getUserName();  // Demander le nom du contact
        const userAddress = getUserAddress();  // Demander l'adresse du contact
        const addressData = await fetchAddressFromAPI(userAddress);  // Faire la requête API pour récupérer l'adresse et les coordonnées

        if (addressData) {
            // Ajouter le contact au carnet de contacts
            contacts.push({
                nom: userName,
                adresse: addressData.adresse,
                latitude: addressData.latitude,
                longitude: addressData.longitude
            });

            // Afficher le contact ajouté
            console.log(`Contact ajouté : ${userName}, ${addressData.adresse}`);
            console.log(`Coordonnées géographiques : Latitude ${addressData.latitude}, Longitude ${addressData.longitude}`);
        }

        // Demander à l'utilisateur s'il souhaite continuer
        let answer = readlineSync.question('Voulez-vous ajouter un autre contact ? (O/N): ').toUpperCase();

        // Si l'utilisateur entre "N", arrêter la boucle
        if (answer !== 'O') {
            continueSearch = false;
            console.log('Fin de la saisie des contacts.');
        }
    }

    // Afficher tous les contacts à la fin
    console.log('\nCarnet de contacts :');
    contacts.forEach((contact, index) => {
        console.log(`${index + 1}. Nom : ${contact.nom}, Adresse : ${contact.adresse}`);
        console.log(`   Coordonnées : Latitude ${contact.latitude}, Longitude ${contact.longitude}`);
    });
};

main();
