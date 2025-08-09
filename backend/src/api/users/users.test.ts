import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import type { Users } from '../../db/schema';
import * as uploadUtils from '../../utils/upload-files';
import { createUser, getUserDetails } from './users.services';

describe('users', () => {
  const user1 = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  const user2 = {
    name: 'prachi',
    email: 'prachi@gmail.com',
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
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
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
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
    });

    it('should return 409 confict if user with email already exists', async () => {
      await createUser({ ...user1 }, db);
      const app = buildServer({ db });
      const data = { ...user1 };

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        status: 409,
        code: 'Conflict',
        message: 'A user with the email already exists!',
      });
    });

    it('should return 201 created for successfully creating user account', async () => {
      const app = buildServer({ db });
      const data = { ...user2 };

      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        status: 201,
        message: 'User created successfully',
      });
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await createUser({ ...user1 }, db);
    });

    it('should return 400 bad request for invalid request body', async () => {
      const app = buildServer({ db });
      const data = {};

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
    });

    it('should return 401 unauthorized if user with email does not exists', async () => {
      const app = buildServer({ db });
      const data = { email: user2.email, password: user2.password };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        status: 401,
        code: 'Unauthorized',
        message: 'The credentials you have provided are incorrect!',
      });
    });

    it('should return return 401 unauthorized if password is not correct', async () => {
      const app = buildServer({ db });
      const data = { email: user1.email, password: 'incorrectpass' };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        status: 401,
        code: 'Unauthorized',
        message: 'The credentials you have provided are incorrect!',
      });
    });

    it('should return 200 ok if credentials are correct', async () => {
      const app = buildServer({ db });
      const data = { email: user1.email, password: user1.password };

      const res = await request(app)
        .post('/api/v1/users/login')
        .send(data)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Logged in successfully',
      });
    });
  });

  describe('POST /users/logout', () => {
    let cookie: string;

    beforeEach(async () => {
      await createUser({ ...user1 }, db);

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
      expect(res.body).toMatchObject({
        status: 401,
        code: 'Unauthorized',
        message: 'You are not authorized.',
      });
    });

    it('should return 401 if session has expired', async () => {
      vi.setSystemTime(new Date(Date.now() + 1000 * 60 * 60 * 24 * 40)); // 40days
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        status: 401,
        code: 'Unauthorized',
        message: 'You are not authorized.',
      });

      vi.useRealTimers();
    });

    it('should return 200 ok and logout user successfully', async () => {
      const app = buildServer({ db });

      const res = await request(app)
        .post('/api/v1/users/logout')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Logout successfully',
      });
    });
  });

  describe('POST /users/picture', () => {
    let cookie: string;

    beforeEach(async () => {
      await createUser({ ...user1 }, db);

      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: user1.email, password: user1.password })
        .set('Accept', 'application/json');

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 400 bad request if image file not attached', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/picture')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'File not found',
      });
    });

    it('should return 200 ok if file is successfully uploaded', async () => {
      vi.spyOn(uploadUtils, 'uploadFileToCloudinary').mockImplementation(() => {
        return Promise.resolve('https://img-url.png');
      });
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/picture')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach('profileImg', Buffer.from('test-file'), {
          filename: 'test.png',
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'File uploaded successfully',
        data: {
          url: 'https://img-url.png',
        },
      });
    });
  });

  describe('PATCH /users/me', () => {
    let cookie: string;

    const invalidProfileData = {
      name: 'manish',
      profileImg: 'https://picsum.photos/536/354',
      otherData: 'other data not required',
    };

    const validProfileData = {
      name: 'manish',
      profileImg: 'https://picsum.photos/536/354',
    };

    beforeEach(async () => {
      await createUser({ ...user1 }, db);

      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: user1.email, password: user1.password })
        .set('Accept', 'application/json');

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 400 bad request if invalid profile data is provided', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .patch('/api/v1/users/me')
        .send(invalidProfileData)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
    });

    it('should return 200 ok for successfully updating the profile data', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .patch('/api/v1/users/me')
        .send(validProfileData)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Profile data updated successfully',
      });
    });
  });

  describe('GET /users/me', () => {
    let cookie: string;
    let createdUserData: {
      _id?: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };

    beforeEach(async () => {
      const insertedUser = await createUser({ ...user1 }, db);
      const userData = (await getUserDetails(
        insertedUser.insertedId.toString(),
        db,
      )) as Users;
      createdUserData = {
        _id: userData._id?.toString(),
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt.toISOString(),
        updatedAt: userData.updatedAt.toISOString(),
        ...(userData.profileImg && { profileImg: userData.profileImg }),
      };

      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: user1.email, password: user1.password })
        .set('Accept', 'application/json');

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 200 ok for successfully fetching the user data', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Successfully fetched user details',
        data: {
          user: createdUserData,
        },
      });
    });
  });
});
