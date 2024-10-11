import fs from 'fs-extra';
import ExcelJS from 'exceljs';
import { format } from '@fast-csv/format';

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
  const csvStream = format({ headers: true });
  const writableStream = fs.createWriteStream('users.csv');

  writableStream.on('finish', () => {
    console.log('Données exportées en CSV (users.csv)');
  });

  csvStream.pipe(writableStream);

  // Inclure toutes les propriétés
  users.forEach(user => {
    csvStream.write({
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
      employment_title: user.employment.title,
      employment_key_skill: user.employment.key_skill,
      address_city: user.address.city,
      address_street_name: user.address.street_name,
      address_street_address: user.address.street_address,
      address_zip_code: user.address.zip_code,
      address_state: user.address.state,
      address_country: user.address.country,
      address_coordinates_lat: user.address.coordinates.lat,
      address_coordinates_lng: user.address.coordinates.lng,
      credit_card_number: user.credit_card.cc_number,
      subscription_plan: user.subscription.plan,
      subscription_status: user.subscription.status,
      subscription_payment_method: user.subscription.payment_method,
      subscription_term: user.subscription.term
    });
  });

  csvStream.end();
}

// Exporter les données en Excel
async function exportExcel(users) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Users');

  // Ajouter des en-têtes
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'UID', key: 'uid', width: 40 },
    { header: 'First Name', key: 'first_name', width: 20 },
    { header: 'Last Name', key: 'last_name', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Username', key: 'username', width: 20 },
    { header: 'Password', key: 'password', width: 20 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Phone Number', key: 'phone_number', width: 20 },
    { header: 'Social Insurance Number', key: 'social_insurance_number', width: 20 },
    { header: 'Date of Birth', key: 'date_of_birth', width: 15 },
    { header: 'Employment Title', key: 'employment_title', width: 25 },
    { header: 'Employment Key Skill', key: 'employment_key_skill', width: 25 },
    { header: 'City', key: 'address_city', width: 20 },
    { header: 'Street Name', key: 'address_street_name', width: 25 },
    { header: 'Street Address', key: 'address_street_address', width: 30 },
    { header: 'Zip Code', key: 'address_zip_code', width: 15 },
    { header: 'State', key: 'address_state', width: 15 },
    { header: 'Country', key: 'address_country', width: 20 },
    { header: 'Latitude', key: 'address_coordinates_lat', width: 15 },
    { header: 'Longitude', key: 'address_coordinates_lng', width: 15 },
    { header: 'Credit Card Number', key: 'credit_card_number', width: 20 },
    { header: 'Subscription Plan', key: 'subscription_plan', width: 20 },
    { header: 'Subscription Status', key: 'subscription_status', width: 20 },
    { header: 'Subscription Payment Method', key: 'subscription_payment_method', width: 20 },
    { header: 'Subscription Term', key: 'subscription_term', width: 20 }
  ];

  // Ajouter les données
  users.forEach(user => {
    worksheet.addRow({
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
      employment_title: user.employment.title,
      employment_key_skill: user.employment.key_skill,
      address_city: user.address.city,
      address_street_name: user.address.street_name,
      address_street_address: user.address.street_address,
      address_zip_code: user.address.zip_code,
      address_state: user.address.state,
      address_country: user.address.country,
      address_coordinates_lat: user.address.coordinates.lat,
      address_coordinates_lng: user.address.coordinates.lng,
      credit_card_number: user.credit_card.cc_number,
      subscription_plan: user.subscription.plan,
      subscription_status: user.subscription.status,
      subscription_payment_method: user.subscription.payment_method,
      subscription_term: user.subscription.term
    });
  });

  await workbook.xlsx.writeFile('users.xlsx');
  console.log('Données exportées en Excel (users.xlsx)');
}

// Fonction principale pour gérer les exports
async function main() {
  const format = process.argv[2]; // Récupérer l'argument de la ligne de commande

  // Récupérer les données de l'API
  const users = await fetchData();

  if (format === 'json') {
    await exportJson(users);
  } else if (format === 'csv') {
    await exportCsv(users);
  } else if (format === 'excel') {
    await exportExcel(users);
  } else {
    console.log('Utilisation : node index.js [json|csv|excel]');
  }
}

main();
