import db from '../conf/db.js';

export const deposit = async (req, res) => {
	try {
		let user = req.token;
		let amount = req.body.amount;

		if (isNaN(amount)) res.status(412).send({ code: 0, message: 'Expects numeric value for amount!' });
		else {
			let dep = await db.transaction(async trans => {
				let depTrans = await db('user_transactions').insert({
					userId: user.id, amount: amount,
					transactionType: 'deposit',
					toUserId: user.id,
				})
					.transacting(trans);

				let setBalance = await db('users').update({
					balance: db.raw(`balance + ${amount}`)
				}).where('id', user.id).transacting(trans);

				return depTrans;
			});

			if (!dep) res.json({ code: 0, message: 'Cannot make transaction' });
			else res.json({ code: 1, message: 'Transaction successful!' });
		}
	} catch (e) {
		res.status(500).json({ code: 0, message: e.message })
	}
}


export const transfer = async (req, res) => {
	let toUser = req.body.toUser,
		amount = req.body.amount;

	try {
		if (isNaN(toUser) || isNaN(amount)) res.status(412).json({ code: 0, message: 'Action required!' });
		else {
			// check against what we have as in the user balance;
			let checkUser = await db('users').select('id').where('id', toUser).first();

			if (!checkUser) res.status(412).json({ code: 0, message: 'Can not find user account!' });
			else {
				let checkBalance = await db('users').select('id').where('balance', '>', amount)
					.andWhere('id', req.token.id).first();

				if (!checkBalance) res.status(412).json({ code: 0, message: 'Transaction failed: Insufficient balance!' });
				else {
					let transfer = await db.transaction(async t => {
						// update user balance on both end
						// remove funds from initiator first

						let transfer = await db('users').update({
							balance: db.raw(`balance - ${amount}`)
						}).where('id', req.token.id).transacting(t);

						// toUser add to beneficiary
						await db('users').update({
							balance: db.raw(`balance + ${amount}`)
						}).where('id', toUser).transacting(t);

						await db('user_transactions').insert({
							userId: req.token.id,
							toUserId: toUser,
							amount,
							transactionType: 'transfer'
						}).transacting(t);

						return transfer;
					});

					if (!transfer) res.json({ code: 0, message: 'Can not complete transaction at this time!' });
					else res.json({ code: 1, message: 'Transaction completed successfully!' });
				}
			}
		}
	} catch (e) {
		res.status(500).json({ code: 0, message: e.message });
	}
}

export const withdraw = async (req, res) => {
	try {
		let amount = req.body.amount;

		if (isNaN(amount)) res.status(412).send({ code: 0, message: 'Expects numeric value for amount!' });
		else {
			// check balance first

			let checkBalance = await db('users').select('id').where('balance', '>', amount)
				.andWhere('id', req.token.id).first();

			if (!checkBalance) res.status(412).json({ code: 0, message: 'Transaction failed: Insufficient balance!' });
			else {
				let withdrawTrans = await db.transaction(async trans => {
					let withdraw = await db('user_transactions').insert({
						userId: req.token.id,
						amount,
						transactionType: 'withdrawal',
						toUserId: req.token.id,
					}).transacting(trans);

					await db('users').update({
						balance: db.raw(`balance - ${amount}`)
					}).where('id', req.token.id).transacting(trans);

					return withdraw;
				});

				if (!withdrawTrans) res.json({ code: 0, message: 'Cannot make transaction' });
				else res.json({ code: 1, message: 'Transaction completed successfully!' });
			}
		}
	} catch (e) {
		res.status(500).json({ code: 0, message: e.message });
	}
}