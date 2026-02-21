import { registerAs } from '@nestjs/config';
import { AdminUserEnvType } from './types';

export default registerAs('admin', (): AdminUserEnvType => ({
  login: process.env.ADMIN_LOGIN || '',
  email: process.env.ADMIN_EMAIL || '',
  password: process.env.ADMIN_PASSWORD || '',
}));
