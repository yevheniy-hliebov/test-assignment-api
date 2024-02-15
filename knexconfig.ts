import type { Knex } from "knex";
import * as dotenv from 'dotenv';
dotenv.config();

const dbconnection = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
  database: process.env.POSTGRES_DB,
}

// Update with your config settings.
const configConnection = {
  client: "postgresql",
  connection: dbconnection,
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds'
  }
}

const knexfile: { [key: string]: Knex.Config } = {
  development: configConnection,
  production: configConnection,
};

export default knexfile;