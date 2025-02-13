import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';

runMigrations(config)
    .then(() => bootstrap(config))
    .catch(err => {
        console.log(err);
    });

// Initialiser SQLite Avant le Démarrage de Vendure
    import { sqliteDataSource } from './database/sqlite-connection';

    async function startSQLite() {
        await sqliteDataSource.initialize();
        console.log('✅ Connexion réussie à SQLite !');
    }
    
    startSQLite();
    