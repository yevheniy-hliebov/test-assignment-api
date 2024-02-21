import { Knex } from "knex";
import { faker } from '@faker-js/faker';

function generateRandomUkrainianPhoneNumber() {
  const prefixes = ["44", "45", "48", "32", "50", "66", "95", "99", "63", "73", "93", "67", "68", "96", "97", "98", "91", "92", "94"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 7-digit number

  return `+380${randomPrefix}${randomNumber.toString().slice(0, 3)}${randomNumber.toString().slice(3, 5)}${randomNumber.toString().slice(5)}`;
}

function getRandomUnixTimestamp() {
  const startTimestamp = new Date('2024-01-01T00:00:00Z').getTime();
  const endTimestamp = Date.now();

  const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1) + startTimestamp);

  return Math.floor(randomTimestamp / 1000); // Convert milliseconds to seconds (Unix timestamp)
}

type UserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position_id: number;
  registration_timestamp: number;
  photo: string;
}

function generateUserData(id: number): UserData {
  const name = faker.person.firstName();
  const email = name.toLowerCase() + '.' + faker.person.lastName().toLowerCase() + '@example.com';
  const phone = generateRandomUkrainianPhoneNumber();
  const position_id = Math.floor(Math.random() * 4) + 1;
  const registration_timestamp = getRandomUnixTimestamp();
  const photo = faker.image.avatar();

  return {
    id,
    name,
    email,
    phone,
    position_id,
    registration_timestamp,
    photo,
  };
}

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();
  const users: Array<Object> = [];
  for (let i = 0; i < 45; i++) {
    const user = generateUserData(i + 1);
    users.push(user);
  }

  await knex('users').insert(users);
}