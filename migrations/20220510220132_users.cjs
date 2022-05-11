/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('users', table => {
		table.increments().primary();
		table.string('name', 150).notNullable();
		table.string('email', 100).unique().notNullable();
		table.string('password', 64).notNullable();
		table.decimal('balance', 15, 2).defaultTo(0)
		table.timestamps();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	
};
