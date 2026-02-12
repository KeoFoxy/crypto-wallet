export type EnvType = {
  nodeEnv: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpire: string;
  jwtRefreshExpire: string;
};

export type DatabaseEnvType = {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  url: string;
};
