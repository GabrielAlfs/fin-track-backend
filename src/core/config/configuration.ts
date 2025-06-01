export interface EnvironmentVariables {
  timezone: string;
  postgres: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

export default (): EnvironmentVariables => ({
  timezone: process.env.TZ,
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
