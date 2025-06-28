/**
 * Script de rollback pour Academia Hub
 * 
 * Ce script annule les migrations SQL dans l'ordre inverse.
 * Utilisation: node rollback.js [nombre_de_migrations_à_annuler]
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
 * Annule les dernières migrations
 * @param {number} count - Nombre de migrations à annuler (par défaut: 1)
 */
async function rollbackMigrations(count = 1) {
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à la base de données MySQL');
    
    // Vérification de l'existence de la table migrations
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'migrations'
    `, [dbConfig.database]);
    
    if (tables.length === 0) {
      console.log('Aucune migration n\'a été exécutée, rien à annuler');
      return;
    }
    
    // Récupération des dernières migrations exécutées
    const [migrations] = await connection.execute(`
      SELECT id, name 
      FROM migrations 
      ORDER BY id DESC 
      LIMIT ?
    `, [count]);
    
    if (migrations.length === 0) {
      console.log('Aucune migration à annuler');
      return;
    }
    
    // Annulation des migrations dans l'ordre inverse
    for (const migration of migrations) {
      console.log(`Annulation de la migration: ${migration.name}`);
      
      // Lecture du fichier de migration
      const filePath = path.join(__dirname, 'migrations', migration.name);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Extraction de la partie "Down Migration"
      const parts = sql.split('-- Down Migration');
      if (parts.length < 2 || !parts[1].trim()) {
        console.warn(`Pas de script de rollback trouvé pour ${migration.name}, suppression de l'entrée uniquement`);
      } else {
        // Suppression des commentaires et exécution du rollback
        const downMigration = parts[1].replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (downMigration) {
          await connection.query(downMigration);
          console.log(`Rollback de ${migration.name} exécuté`);
        }
      }
      
      // Suppression de l'entrée dans la table migrations
      await connection.execute('DELETE FROM migrations WHERE id = ?', [migration.id]);
      console.log(`Migration ${migration.name} marquée comme annulée`);
    }
    
    console.log(`${migrations.length} migration(s) annulée(s) avec succès`);
  } catch (error) {
    console.error('Erreur lors de l\'annulation des migrations:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée');
    }
  }
}

// Récupération du nombre de migrations à annuler depuis les arguments
const count = parseInt(process.argv[2], 10) || 1;

// Exécution du rollback
rollbackMigrations(count);
