import { EnvType } from '@/configs/types';

export default (): EnvType => ({
  nodeEnv: process.env.NODE_ENV || 'dev',
});
