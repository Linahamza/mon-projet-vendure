// Ajouter une Connexion Séparée à SQLite


import { DataSource } from 'typeorm';
import path from 'path';

export const sqliteDataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.join(__dirname, '../../../base/db.sqlite'), // Chemin de la base SQLite
    entities: [path.join(__dirname, '../entities/*.ts')], // Charger uniquement les entités SQLite
    synchronize: false, // On ne modifie pas la structure de la table
    logging: false,
});
