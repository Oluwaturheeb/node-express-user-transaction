/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('user_transactions', table => {
		table.increments().primary();
		table.bigInteger('userId').notNullable();
		table.bigInteger('toUserId').defaultTo(0);
		table.enu('transactionType', ['deposit', 'withdrawal', 'transfer']);
		table.decimal('amount', 15, 2);
		table.timestamps(true, true);

		// table.foreign('user_id').references('id').inTable('users').onDelete(null);
		// table.foreign('toUserId').references('id').inTable('users');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
};
