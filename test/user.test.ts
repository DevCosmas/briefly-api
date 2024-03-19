import supertest from 'supertest';
import createServer from '../src/utils/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { userModel } from '../src/model/user';
import express, { Express, Request, Response, NextFunction } from 'express';
import { login } from '../src/controller/userController';

let app: Express;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = createServer();
});

afterAll(async () => {
  await userModel.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('user', () => {
  describe('sign up a new user', () => {
    it('should return success when a new user signs up', async () => {
      const newUser = {
        email: 'jboy@gmail.com',
        username: 'jprince',
        password: 'pass1234',
      };
      const response = await supertest(app)
        .post('/api/user/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });
  });
  describe('given that a user has been registered', () => {
    it('should let registered user to login', async () => {
      const user = {
        email: 'jboy@gmail.com',
        password: 'pass1234',
      };
      const response = await supertest(app).post('/api/user/login').send(user);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });
  describe('given that a user passed a wrong password', () => {
    it('should return with a 404 not found error', async () => {
      const user = {
        email: 'jboy@gmail.com',
        password: 'pass123',
      };
      const response = await supertest(app).post('/api/user/login').send(user);
      console.log(response);
      expect(response.status).toBe(404);
    });
  });

  describe('update user profile', () => {
    it('should update user profile when valid JWT token is provided', async () => {
      const userId = mongoose.Types.ObjectId;
      const user = {
        email: 'test@example.com',
        username: 'user',
        password: 'pass1234',
      };

      await supertest(app).post('/api/user/register').send(user);
      const loginResponse = await supertest(app)
        .post('/api/user/login')
        .send({ email: user.email, password: user.password });

      const token = loginResponse.body.token;
      const Id = loginResponse.body.user._id;
      const body = loginResponse.body;
      console.log('TOKEN', token);
      console.log('BODY', body);
      console.log('Id', Id);

      const updatedProfile = {
        username: 'newUsername',
      };

      const response = await supertest(app)
        .patch(`/api/user/Update_me/${Id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProfile);

      expect(response.status).toBe(200);
    });

    it('should return 401 Unauthorized if JWT token is missing', async () => {
      const updatedProfile = {
        username: 'updatedusername',
      };
      const userId = '';
      const response = await supertest(app)
        .patch(`/api/user/Update_me/${userId}`)
        .send(updatedProfile);

      expect(response.status).toBe(401);
    });
  });
});

describe('url', () => {
  describe('create new url', () => {
    it('should create a new short url', async () => {
      const userId = mongoose.Types.ObjectId;
      const user = {
        email: 'test@example.com',
        username: 'user',
        password: 'pass1234',
      };

      await supertest(app).post('/api/user/register').send(user);
      const loginResponse = await supertest(app)
        .post('/api/user/login')
        .send({ email: user.email, password: user.password });

      const token = loginResponse.body.token;
      console.log('TOKEN', token);
      const newUrl = {
        originalUrl:
          'https://chat.openai.com/c/9fd04bc5-9899-477e-b100-2fbf24f8b1ce',
      };

      const response = await supertest(app)
        .post('/createUrl')
        .set('Authorization', `Bearer ${token}`)
        .send(newUrl);

      expect(response.status).toBe(201);
    });

    it('should return 401 Unauthorized if JWT token is missing', async () => {
      const newUrl = {
        originalUrl: 'https://chat.openai.com/',
      };

      const response = await supertest(app).post('/createUrl').send(newUrl);

      expect(response.status).toBe(400);
    });
  });
});
