# Overview

This starter kit gives you a foundation for creating an API with Express.js that uses PostgreSQL as a database. It uses Docker to run PostgreSQL in a container, which makes it convenient for local development and deployment.

### Important Configuration Files
- `db.config.ts`: Configuration for connection to database.
- `.env`: Environment variables.
- `docker-compose`.yaml: Docker container configuration for PostgreSQL.
- `knexconfig.ts`: Knex configuration for database migrations and seeds.
- `nodemon.json`: Nodemon configuration.
- `tsconfig.json`: TypeScript configuration.

# Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env-example` to `.env` and update the environment variables.
4. Start the PostgreSQL container with `npm run db`.  
_It is important if your Docker does not have a_ `postgres` _image, then you need to install it first -_ `npm run pull-db`
5. Run database migrations with `npm run migrate`.
6. Seed the database with `npm run seed`.
7. Build and start the server with `npm start` or for development, use `npm run dev`.


# Scripts
- `npm run build`: Build TypeScript files.  
- `npm start`: Build and start the server.  
- `npm run dev`: Start the server in development mode using Nodemon.  
- `npm run db`: Start the PostgreSQL container.  
- `npm run db:down`: Stop the PostgreSQL container.  
- `npm run pull-db`: Pull the latest PostgreSQL Docker image.  
- `npm run migrate`: Run database migrations.  
- `npm run migrate:down`: Rollback the last database migration.  
- `npm run seed`: Run database seeding.  

# Notes
Ensure Docker is installed for database containerization.  
Adjust configurations and scripts as needed for specific project requirements.