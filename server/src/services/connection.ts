import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { autoIncrementCommentId } from './database';
dotenv.config();

// Check for required environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('Environment variables not set!');
  process.exit(1);
}

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function incrementComments() {
  await autoIncrementCommentId();
  console.log("CommentId incremented.");
}

incrementComments();
console.log('Connected to MySQL database');

// Export the pool for use in other modules
export default pool;
