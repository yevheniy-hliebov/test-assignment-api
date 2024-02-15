import Knex, {Knex as iKnex} from "knex";

export async function up(knex: iKnex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.timestamps(true, true);
  });
}


export async function down(knex: iKnex): Promise<void> {
  await knex.schema.dropTable('users');
}

