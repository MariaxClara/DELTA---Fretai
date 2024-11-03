// server/api/tables.js
import { getTables } from '../db/database';

export default defineEventHandler(async () => {
  const tables = await getTables();
  return tables;
});

