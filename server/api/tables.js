import connectDatabase from '../plugins/database';

const { getTables } = connectDatabase();

export default defineEventHandler(async () => {
  const tables = await getTables();
  return tables;
});