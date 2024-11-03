// server/api/tables.ts
import { getTables } from '../db/database';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  const tables = await getTables();
  return tables;
});
