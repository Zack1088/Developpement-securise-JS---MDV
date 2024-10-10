// Importation du module readlineSync pour capturer l'entrée de l'utilisateur de manière synchrone
const readlineSync = require('readline-sync');

// Fonction pour demander une adresse à l'utilisateur
const getUserAddress = () => {
    const address = readlineSync.question('Entrez l\'adresse que vous souhaitez rechercher: ');
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

            console.log(`L'adresse la plus probable est : ${adresse}`);
        } else {
            console.log('Aucune adresse trouvée.');
        }
    } catch (error) {
        console.error('Erreur lors de la requête à l\'API:', error);
    }
};

// Fonction principale avec une boucle
const main = async () => {
    let continueSearch = true;

    while (continueSearch) {
        const userAddress = getUserAddress();  
        await fetchAddressFromAPI(userAddress); 

        // Demander à l'utilisateur s'il souhaite continuer
        let answer = readlineSync.question('Voulez-vous rechercher une autre adresse ? (O/N): ').toUpperCase();

        // Si l'utilisateur entre "N", arrêter la boucle
        if (answer !== 'O') {
            continueSearch = false;
            console.log('Fin de la recherche.');
        }
    }
};

main();
