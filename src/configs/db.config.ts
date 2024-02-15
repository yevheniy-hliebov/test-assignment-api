import * as dotenv from 'dotenv';
dotenv.config();

const configConnection = {
  client: "postgresql",
  connection: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
    database: process.env.POSTGRES_DB,
  },
  pool: {
    min: 2,
    max: 10
  }
}

export default configConnection;
