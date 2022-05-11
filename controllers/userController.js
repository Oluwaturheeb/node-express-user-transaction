import db from '../conf/db.js';

const dashboard = async (req, res) => {
  try {
    // i know i shouldd add offset to this query
    let user = req.token;
    let transactions = await db('users').select()
    .leftOuterJoin('user_transactions', function () {
      this.on('users.id', 'user_transactions.userId').orOn('users.id', 'user_transactions.toUserId')
    }).where('users.id', user.id).limit(20);
    res.json({transactions});
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export default dashboard;