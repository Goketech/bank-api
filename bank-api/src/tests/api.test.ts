import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { createApp } from '../index';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';
import Account from '../models/Account';
import Transaction from '../models/Transaction';

let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Account.deleteMany({});
  await Transaction.deleteMany({});
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('data.accountNumber');
  });

  it('should login a user', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('data.token');
  });
});

describe('Account Endpoints', () => {
  let token: string;

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    token = loginRes.body.data.token;
  });

  it('should create a new account', async () => {
    const res = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Account created successfully');
    expect(res.body).toHaveProperty('data.accountNumber');
  });

  it('should search for an account', async () => {
    const createRes = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send();

    const accountNumber = createRes.body.data.accountNumber;

    const searchRes = await request(app)
      .get(`/api/v1/accounts/${accountNumber}`)
      .set('Authorization', `Bearer ${token}`);

    expect(searchRes.status).toBe(200);
    expect(searchRes.body).toHaveProperty('data.name', 'Test User');
  });

  it('should fetch all user accounts', async () => {
    const res = await request(app)
      .get('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'User accounts retrieved successfully');
    expect(res.body).toHaveProperty('data.accounts');
  });
});

describe('Transaction Endpoints', () => {
  let token: string;
  let account1: string;
  let account2: string;

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    token = loginRes.body.data.token;

    const createRes1 = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send();
    account1 = createRes1.body.data.accountNumber;

    const createRes2 = await request(app)
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send();
    account2 = createRes2.body.data.accountNumber;
  });

  it('should transfer funds between accounts', async () => {
    const res = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fromAccount: account1,
        toAccount: account2,
        amount: 1000,
        description: 'Test transfer',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Transfer successful');
  });

  it('should fetch account transaction details', async () => {
    const res = await request(app)
      .get(`/api/v1/transactions/${account1}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Transaction history retrieved successfully');
  });

  it('should fetch user transaction details', async () => {
    const res = await request(app)
      .get(`/api/v1/transactions`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'All user transactions retrieved successfully');
  });
});
