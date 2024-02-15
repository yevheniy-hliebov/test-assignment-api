// UserFactory.ts
import {Knex as iKnex} from "knex";

export async function seed(knex: iKnex): Promise<void> {
  await knex('users').del();
  // Вставка 10 користувачів з випадковими ім'ям та електронною поштою
  const users: Array<Object> = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      username: `user${i}`,
      email: `user${i}@example.com`,
    };
    users.push(user);
  }

  await knex('users').insert(users);
}