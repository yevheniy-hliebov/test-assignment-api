import {Knex as iKnex} from "knex";

export async function seed(knex: iKnex): Promise<void> {
  await knex('positions').del();
  const positions: Array<Object> = [
    {
      "id": 1,
      "name": "Security"
    },
    {
      "id": 2,
      "name": "Designer"
    },
    {
      "id": 3,
      "name": "Content manager"
    },
    {
      "id": 4,
      "name": "Lawyer"
    }
  ];
  
  await knex('positions').insert(positions);
}