// database.js
import pkg from 'pg';
const { Pool } = pkg;

export function connectDatabase() {
  return new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
  });
}
