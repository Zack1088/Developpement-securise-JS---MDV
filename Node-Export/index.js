import fs from 'fs-extra';
import ExcelJS from 'exceljs';
import { format as csvFormat } from '@fast-csv/format';

// URL de l'API pour récupérer des données aléatoires
const apiUrl = 'https://random-data-api.com/api/v2/users?size=10';

// Fonction pour récupérer les données depuis l'API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
}

// Préparer les données pour l'export
function prepareData(users) {
  return users.map(user => ({
    id: user.id,
    uid: user.uid,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    username: user.username,
    password: user.password,
    gender: user.gender,
    phone_number: user.phone_number,
    social_insurance_number: user.social_insurance_number,
    date_of_birth: user.date_of_birth,
    employment_title: user.employment?.title,
    employment_key_skill: user.employment?.key_skill,
    address_city: user.address?.city,
    address_street_name: user.address?.street_name,
    address_street_address: user.address?.street_address,
    address_zip_code: user.address?.zip_code,
    address_state: user.address?.state,
    address_country: user.address?.country,
    address_coordinates_lat: user.address?.coordinates?.lat,
    address_coordinates_lng: user.address?.coordinates?.lng,
    credit_card_number: user.credit_card?.cc_number,
    subscription_plan: user.subscription?.plan,
    subscription_status: user.subscription?.status,
    subscription_payment_method: user.subscription?.payment_method,
    subscription_term: user.subscription?.term,
  }));
}

// Exporter les données en JSON
async function exportJson(users) {
  try {
    await fs.writeJson('users.json', users, { spaces: 2 });
    console.log('Données exportées en JSON (users.json)');
  } catch (err) {
    console.error('Erreur lors de l\'écriture du fichier JSON', err);
  }
}

// Exporter les données en CSV
async function exportCsv(users) {
  const csvStream = csvFormat({ headers: true });
  const writableStream = fs.createWriteStream('users.csv');

  writableStream.on('finish', () => {
    console.log('Données exportées en CSV (users.csv)');
  });

  csvStream.pipe(writableStream);
  users.forEach(user => csvStream.write(user));
  csvStream.end();
}

// Exporter les données en Excel
async function exportExcel(users) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // Ajouter des en-têtes
  worksheet.columns = Object.keys(users[0]).map(key => ({
    header: key.replace(/_/g, ' ').toUpperCase(),
    key,
    width: 25
  }));

  // Ajouter les données
  users.forEach(user => worksheet.addRow(user));

  await workbook.xlsx.writeFile('users.xlsx');
  console.log('Données exportées en Excel (users.xlsx)');
}

// Fonction principale pour gérer les exports
async function main() {
  const format = process.argv[2]; // Récupérer l'argument de la ligne de commande

  // Récupérer les données de l'API
  const users = await fetchData();

  // Préparer les données à exporter
  const preparedData = prepareData(users);

  if (format === 'json') {
    await exportJson(preparedData);
  } else if (format === 'csv') {
    await exportCsv(preparedData);
  } else if (format === 'excel') {
    await exportExcel(preparedData);
  } else {
    console.log('Utilisation : node index.js [json|csv|excel]');
  }
}

main();
