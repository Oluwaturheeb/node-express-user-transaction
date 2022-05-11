import jwt from 'jsonwebtoken';

const app = {
  host: 'localhost:3000',
  appName: 'NothingMuch',
  signToken: async data => {
    let sign = await jwt.sign(data, '$2a$10$eEcRZh62h5VQq7AXb.E54eWgEorYEa082apf/Qw8VVUvtfM8gm7R');
    return sign;
  },
  verifyMiddleware: async (req, res, next) => {
    try {
      let token = req.headers.authorization.split(' ')[1];
      if (!token) res.sendStatus(403);
      let check = await jwt.verify(token, '$2a$10$eEcRZh62h5VQq7AXb.E54eWgEorYEa082apf/Qw8VVUvtfM8gm7R');
      
      if (!check) res.sendStatus(403);
      else req.token = check; next();
    } catch (e) {
      res.sendStatus(403);
    }
  },
  isAdmin: (req, res, next) => {
    if (!req.token) res.sendStatus(403);
    else {
      if (req.token.role.role === 'USER') res.sendStatus(403);
      else next();
    }
  },
};

export default app;