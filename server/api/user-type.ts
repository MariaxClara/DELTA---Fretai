import { getUserType } from '../db/database';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { user_id } = body;

  try {
    const userType = await getUserType(user_id);
    return {
      status: 'success',
      userType
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Error determining user type'
    };
  }
});