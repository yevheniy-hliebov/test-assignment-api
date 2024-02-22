import {Knex as iKnex} from "knex";

export async function up(knex: iKnex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone').notNullable().unique();
    table.integer('position_id').notNullable();
    table.bigint('registration_timestamp').notNullable();
    table.string('photo');
  });
}

export async function down(knex: iKnex): Promise<void> {
  await knex.schema.dropTable('users');
}

