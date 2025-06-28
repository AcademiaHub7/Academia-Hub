/**
 * Script de migration pour Academia Hub
 * 
 * Ce script exécute les migrations SQL dans l'ordre séquentiel.
 * Utilisation: node migrate.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config();

// Configuration pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academia_hub',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  multipleStatements: true
};

/**
 * Exécute les fichiers de migration dans l'ordre
 */
async function runMigrations() {
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à la base de données MySQL');
    
    // Création de la table de migrations si elle n'existe pas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Lecture des migrations déjà exécutées
    const [executedMigrations] = await connection.execute('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(row => row.name);
    
    // Lecture des fichiers de migration
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Tri alphabétique pour l'ordre d'exécution
    
    // Exécution des migrations non appliquées
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Exécution de la migration: ${file}`);
        
        // Lecture du contenu du fichier
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // Extraction de la partie "Up Migration"
        const upMigration = sql.split('-- Down Migration')[0];
        
        // Exécution de la migration
        await connection.query(upMigration);
        
        // Enregistrement de la migration comme exécutée
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [file]
        );
        
        console.log(`Migration ${file} exécutée avec succès`);
      } else {
        console.log(`Migration ${file} déjà exécutée, ignorée`);
      }
    }
    
    console.log('Toutes les migrations ont été exécutées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée');
    }
  }
}

// Exécution des migrations
runMigrations();
