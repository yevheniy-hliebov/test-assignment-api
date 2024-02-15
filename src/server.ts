import express from 'express';
import dotenv from 'dotenv';
import Knex from "knex";
import configConnection from './configs/db.config';
import { UserService } from './services/user.service';
dotenv.config();

const app = express();
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API Worked');
});

const knex = Knex(configConnection);
const userService = new UserService(knex);

app.get('/users', (req, res) => {
  userService.getAllUsers()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch((error) => {
    console.error('Error:', error);
    res.sendStatus(500);
  })
})

const server = app.listen(process.env.PORT, () => {
  console.log('API Server up on port:', process.env.PORT);
})

process.on("unhandledRejection", (error: any) => {
  console.error(`An error occurred: ${error?.message}`);
  server.close(() => process.exit(1))
})