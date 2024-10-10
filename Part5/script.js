import fetch from 'node-fetch';

// Classe représentant le concept de Mairie
function Mairie(fields) {
  // Le champ 'name' est une chaîne de caractères, on l'affiche tel quel
  this.nom = fields.name || 'Nom inconnu'; // Si le nom est absent, on utilise "Nom inconnu"
  this.sigid = fields.sigid || ''; // ajout de la propriété sigid vu que c'est le meme nom par tout!
  this.temps_attente = fields.averagewaitingtime || 0;
  this.horaires_ouverture = parseSchedule(fields.dayschedule);
  this.ouverte = fields.isopen === 1; // Utilisation de la propriété 'isopen'
  this.temps_ouverture = calculerMinutesOuverture(this.horaires_ouverture);
}

// Fonction pour convertir les horaires de la mairie
const parseSchedule = (dayschedule) => {
  try {
    const schedule = JSON.parse(dayschedule);
    const openingHour = schedule[0].openingHour;
    const openingMinute = schedule[0].openingMinute;
    const closingHour = schedule[0].closingHour;
    const closingMinute = schedule[0].closingMinute;
    return `${openingHour}:${openingMinute.toString().padStart(2, '0')} - ${closingHour}:${closingMinute.toString().padStart(2, '0')}`;
  } catch (error) {
    return '';
  }
};

// Fonction pour calculer la durée d'ouverture en minutes d'une mairie
const calculerMinutesOuverture = horaires => {
  if (!horaires) return 0;

  const [start, end] = horaires.split(' - ').map(h => h.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m)));
  return end - start;
};

// Fonction fléchée pour récupérer les données depuis l'API
const fetchMairiesData = () =>
  fetch('https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/duree-dattente-aux-mairies-en-temps-reel/records?limit=20')
    .then(res => res.json())
    .then(data => {
      if (data && data.results) {
        return data.results.map(record => new Mairie(record));
      } else {
        console.error('Données incorrectes reçues de l\'API.');
        return [];
      }
    });

// Afficher les mairies ouvertes
const afficherMairies = (mairies) => {
  const mairiesOuvertes = mairies
    .filter(mairie => mairie.ouverte) // Filtrer les mairies ouvertes
    .sort((a, b) => a.temps_attente - b.temps_attente || a.sigid.localeCompare(b.sigid)); // Trier par temps d'attente puis par sigid

  mairiesOuvertes.forEach(mairie => {
    console.log(`Mairie : ${mairie.nom}`);
    console.log(`Sigid : ${mairie.sigid}`);
    console.log(`Temps d'attente moyen : ${mairie.temps_attente} minutes`);
    console.log(`Horaires d'ouverture : ${mairie.horaires_ouverture}`);
    console.log('---------------------------------');
  });

  return mairiesOuvertes;
};

// Calculer le temps d'ouverture total de toutes les mairies ouvertes
const calculerTempsOuvertureTotal = mairies => 
  mairies.reduce((total, mairie) => total + mairie.temps_ouverture, 0);

// Fonction principale pour initier la récupération et l'affichage
const init = () => {
  fetchMairiesData().then(mairies => {
    const mairiesOuvertes = afficherMairies(mairies);
    
    const tempsOuvertureTotal = calculerTempsOuvertureTotal(mairiesOuvertes);
    console.log(`Temps d'ouverture total : ${tempsOuvertureTotal} minutes`);
  });
};

// Lancer l'application
init();
