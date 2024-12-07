import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();
import { renameCommentColumn } from './database';


if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('Environment variables not set!');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initializeDatabase() {
  await renameCommentColumn();
  console.log("Database initialized and column renamed.");
}

initializeDatabase();


console.log('Connected to MySQL database');

export default pool;
