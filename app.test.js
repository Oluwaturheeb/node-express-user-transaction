var request = require('supertest');
var assert = require('assert');
var app = 'http://localhost:3000/api';
// collect bearer string from requests
let bearer;
// set request uri
let req = request(app);
//let reqWithBearer = req.set('authorization', `bearer ${bearer}`);
// register route
describe('Register route => POST', () => {
  test(`${app}/auth/register`, async () => {
    let res = await req.post('/auth/register')
    .set('accept', /json/)
    .send({email: 'devTee@gmail.com', password: 'password', name: 'devTee'})
    .expect('content-type', /json/)
  
    //jest
    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(500);
  });
});

// login route
describe('Login route => POST', () => {
  test(`${app}/auth/login`, async () => {
    let res = await req.post('/auth/login').send({
      email: 'devTee@gmail.com', password: 'password'
    })
    .set('accept', 'json')
    .expect(200)
    .expect('content-type', /json/);
    
    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(500);
    expect(res.status).not.toBe(412);
    expect(res.body).toHaveProperty('user');
    bearer = res.body.user.token;
  });
});

describe('Dashboard => GET', () => {
  test(`${app}/user/dashboard`, async () => {
    let res = await req.get('/user/dashboard')
    .set('authorization', `bearer ${bearer}`)
    .set('accept', 'json')
    .expect(200)
    .expect('content-type', /json/);
    
    //jest
    expect(res.body).toHaveProperty('transactions');
  });
});

describe('Deposit route => PUT', () => {
  test(`${app}/transaction/deposit`, async () => {
    let res = await req.put('/transaction/deposit')
    .send({amount: 30000})
    .set('authorization', `bearer ${bearer}`)
    .set('accept', 'json')
    .expect(200)
    .expect('content-type', /json/);
    
    expect(res.body).toHaveProperty('code')
    expect(res.body.code).toEqual(1);
  });
});

describe('Withdrawal route => PUT', () => {
  test(`${app}/transaction/withdraw`, async () => {
    let res = await req.put('/transaction/withdraw')
    .send({amount: 30000})
    .set('authorization', `bearer ${bearer}`)
    .set('accept', 'json')
    .expect(200)
    .expect('content-type', /json/);
    
    expect(res.body).toHaveProperty('code')
    expect(res.body.code).toEqual(1);
  });
});

describe('Transfer route => PUT', () => {
  test(`${app}/transaction/transfer`, async () => {
    let res = await req.put('/transaction/transfer')
    .send({amount: 300, toUser: 53})
    .set('authorization', `bearer ${bearer}`)
    .set('accept', 'json')
    .expect(200)
    .expect('content-type', /json/);
    
    expect(res.body).toHaveProperty('code')
    expect(res.body.code).toEqual(1);
  });
});
