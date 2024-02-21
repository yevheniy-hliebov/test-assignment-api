import {Knex as iKnex} from "knex";

export async function up(knex: iKnex): Promise<void> {
  await knex.schema.createTable('positions', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
  });
}


export async function down(knex: iKnex): Promise<void> {
  await knex.schema.dropTable('positions');
}

