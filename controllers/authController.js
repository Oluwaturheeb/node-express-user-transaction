import crypt from 'bcryptjs';
import db from '../conf/db.js';
import app from '../conf/app.js';
// import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  let email = req.body.email,
    password = req.body.password;

  if (!email && !password) res.status(412).json({
    message: 'Action required!'
  });
  else {
    try {
      var user = await db.select('*').from('users').where('email', email).limit(1);
      user = user[0];
      
      if (!user) res.status(412).json({
        code: 0, message: 'Credentials does not match any account!'
      });
      else {
        let check = await crypt.compare(password, user.password);

        if (!check) res.status(412).json({
          code: 0, message: 'Credentials does not match any account!'
        });
        else {
          let token = await app.signToken(JSON.parse(JSON.stringify(user)), process.env.JWTSECRET);
          res.json({
            code: 1,
            message: `Welcome, ${user.name}`,
            user: {
              token: token, ...user
            }
          });
        }
      }
    } catch (e) {
      res.status(500).json({
        code: 0, message: e.message
      });
    }
  }
};

export const register = async (req, res) => {
  //import ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let {
    email,
    password,
    name
  } = req.body;

  if (!email && !password && !name) res.sendStatus(412).json({
    message: 'Action required!'
  });
  else {
    try {
      let hashed = await crypt.hash(password, 10);
      let toInsert = {
        name: name,
        email: email,
        password: hashed,
      };
      let user = await db('users').insert(toInsert);

      if (!user) res.json({code: 0, message: 'Cannot register user!'});
      else res.json({code: 1, message: 'Registration complete!'});
    } catch (e) {
      console.log(e)
      res.status(412).json({
        code: 0, message: 'Email already exists!' + e.message
      })
    }
  }
};