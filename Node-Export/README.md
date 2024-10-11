# Exercises JS et NodeJS

## Node-Export

### Description

Ce projet permet de récupérer des données aléatoires d'utilisateurs via une API et de les exporter dans différents formats : **JSON**, **CSV**, ou **Excel**.

### Fonctionnalités

- **Récupération de données** : Le projet utilise l'API [Random Data API](https://random-data-api.com/api/v2/users) pour obtenir des informations sur 10 utilisateurs aléatoires.
- **Export de données** : Les données peuvent être exportées en trois formats différents :
  - **JSON**
  - **CSV**
  - **Excel** (fichier `.xlsx`)

### Prérequis

- **Node.js** (v18+ pour utiliser `fetch` intégré)
- **npm** (pour la gestion des dépendances)

### Dépendances

Les packages suivants sont utilisés :

- **fs-extra** : Pour la gestion des fichiers.
- **ExcelJS** : Pour générer des fichiers Excel.
- **fast-csv** : Pour créer des fichiers CSV.

### Installation

1. Clonez le dépôt ou téléchargez les fichiers du projet.
2. Ouvrez un terminal dans le répertoire du projet et exécutez la commande suivante pour installer les dépendances :

```bash
npm install
