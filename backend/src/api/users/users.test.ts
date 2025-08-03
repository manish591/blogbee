import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import { createNewUser } from './users.services';

describe('users', () => {
  const user1 = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  const user2 = {
    name: 'anjali',
    email: 'anjali@gmail.com',
    password: '4574114',
  };

  describe('POST /users', () => {
    it('should return 400 bad request if email is not provided', async () => {
      const app = buildServer({ db });
      const data = {};

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
    });

    it('should return 400 bad request if password length is lower than 6 characters', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'manish',
        email: 'manish@gmail.com',
        password: '24',
      };

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
    });

    it('should return 409 confict if user with email already exists', async () => {
      await createNewUser({ ...user1 }, db);
      const app = buildServer({ db });
      const data = { ...user1 };

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(409);
    });

    it('should return 201 created for successfully creating user account', async () => {
      const app = buildServer({ db });
      const data = { ...user2 };

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await createNewUser({ ...user1 }, db);
    });

    it('should return 400 bad request for invalid request body', async () => {
      const app = buildServer({ db });
      const data = {};

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
    });

    it('should return 401 unauthorized if user with email does not exists', async () => {
      const app = buildServer({ db });
      const data = { email: user2.email, password: user2.password };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(401);
    });

    it('should return return 401 unauthorized if password is not correct', async () => {
      const app = buildServer({ db });
      const data = { email: user1.email, password: 'incorrectpass' };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(401);
    });

    it('should return 200 ok if credentials are correct', async () => {
      const app = buildServer({ db });
      const data = { email: user1.email, password: user1.password };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /users/logout', () => {
    let cookie: string;

    beforeEach(async () => {
      await createNewUser({ ...user1 }, db);

      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: user1.email, password: user1.password })
        .set('Accept', 'application/json');

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 401 if authorization cookies not found', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Accept', 'application/json')
        .set('Cookie', []);

      expect(res.status).toBe(401);
    });

    it('should return 200 ok and logout user successfully', async () => {
      const app = buildServer({ db });

      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /users/picture', () => {
    it('should return 401 unauthorized if authorization cookies not found', async () => {});

    it('should return 400 bad request if image file not attached', async () => {});

    it('should return 200 ok if file is successfully uploaded', async () => {});
  });

  describe('PATCH /users/me', () => {});

  describe('GET /users/me', () => {});
});
