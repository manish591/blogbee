import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import * as uploadUtils from '../../utils/upload-files';
import { createUser, getUserAuthSessions, getUserByEmail } from './users.services';
import { UPLOADED_PROFILE_IMG_IDENTIFIER } from '../../utils/constants';

describe('users', () => {
  describe('POST /v1/users', () => {
    const requestBodyRequiredField = ["email", "password", "name"];

    requestBodyRequiredField.forEach(field => {
      it(`should return 400 bad request if ${field} is not provided`, async () => {
        const app = buildServer({ db });
        const data = { name: "test1", email: "manish@gmail.com", password: "14577952" };
        delete data[field];
        const res = await request(app)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .set('Content-Type', "application/json")
          .send(data);
        const createdUser = await getUserByEmail(data.email, db);

        expect(createdUser).toBeNull();
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          code: 400,
          status: "error",
          message: 'Bad request',
        });
      });
    });

    it("should return 400 bad request if invalid fields provided", async () => {
      const app = buildServer({ db });
      const data = { name: "test1", email: "manish@gmail.com", password: "14577952", extraField: "extra" };
      const res = await request(app)
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data);
      const createdUser = await getUserByEmail(data.email, db);

      expect(createdUser).toBeNull();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: "error",
        message: 'Bad request',
      });
    });

    it("should return 400 bad request if valid email is not provided", async () => {
      const app = buildServer({ db });
      const data = { name: "test1", email: "gmail", password: "14577952" };
      const res = await request(app)
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data);
      const createdUser = await getUserByEmail(data.email, db);

      expect(createdUser).toBeNull();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: "error",
        message: 'Bad request',
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
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data);
      const createdUser = await getUserByEmail(data.email, db);

      expect(createdUser).toBeNull();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: "error",
        message: 'Bad request',
      });
    });

    it('should return 409 confict if user with email already exists', async () => {
      const existingUser = {
        name: "manish",
        email: "manish@gmail.com",
        password: "12457mans"
      }
      await createUser(existingUser, db);
      const app = buildServer({ db });
      const data = { ...existingUser, name: "newname", password: "147928d4d" };
      const res = await request(app)
        .post('/v1/users')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data)
      const createdUser = await getUserByEmail(existingUser.email, db);

      expect(createdUser?.name).not.toBe(data.name);
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        code: 409,
        status: 'error',
        message: 'User with email already exists',
      });
    });

    it('should return 201 created for successfully creating user', async () => {
      const app = buildServer({ db });
      const data = { name: "anjali", email: "anjali@gmail.com", password: "anjali78545" };
      const res = await request(app)
        .post('/v1/users')
        .set('Content-Type', "application/json")
        .set('Accept', 'application/json')
        .send(data);
      const createdUser = await getUserByEmail(data.email, db);

      expect(createdUser).toBeDefined();
      expect(createdUser?.name).toBe(data.name);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        code: 201,
        status: "success",
        message: 'User created successfully',
      });
    });
  });

  describe('POST /v1/users/login', () => {
    const requestBodyRequiredField = ["email", "password"];
    const loggedOutUser = {
      name: "manish",
      email: "manish@gmail.com",
      password: "hdhfhf455"
    }

    beforeEach(async () => {
      await createUser(loggedOutUser, db);
    });

    requestBodyRequiredField.forEach(field => {
      it(`should return 400 bad request if ${field} is not provided`, async () => {
        const app = buildServer({ db });
        const data = { email: loggedOutUser.email, password: loggedOutUser.password };
        delete data[field];
        const res = await request(app)
          .post('/v1/users/login')
          .set('Accept', 'application/json')
          .set('Content-Type', "application/json")
          .send(data)
        const loggedInUser = await getUserByEmail(data.email, db);
        const userId = loggedInUser?._id.toString() as string;
        const loggedInUserSessions = await getUserAuthSessions(userId, db);

        expect(loggedInUserSessions.length).toBe(0)
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          code: 400,
          status: "error",
          message: 'Bad request',
        });
      });
    });

    it("should return 400 bad request if invalid fields provided", async () => {
      const app = buildServer({ db });
      const data = { email: "manish@gmail.com", password: "14577952", extraField: "extra" };
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data);
      const loggedInUser = await getUserByEmail(data.email, db);
      const userId = loggedInUser?._id.toString() as string;
      const loggedInUserSessions = await getUserAuthSessions(userId, db);

      expect(loggedInUserSessions.length).toBe(0)
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: "error",
        message: 'Bad request',
      });
    });

    it('should return 401 unauthorized if user with email does not exists', async () => {
      const userNotExistsInDB = {
        name: "anjali",
        email: "anjali@gmail.com",
        password: "annu@2925"
      }
      const app = buildServer({ db });
      const data = { email: userNotExistsInDB.email, password: userNotExistsInDB.password };
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data);

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        code: 401,
        status: "error",
        message: 'Invalid credentials',
      });
    });

    it('should return return 401 unauthorized if password is  incorrect', async () => {
      const app = buildServer({ db });
      const data = { email: loggedOutUser.email, password: 'incorrectpass' };

      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data)

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({
        code: 401,
        status: "error",
        message: 'Invalid credentials',
      });
    });

    it('should return 200 ok if credentials are correct', async () => {
      const app = buildServer({ db });
      const data = { email: loggedOutUser.email, password: loggedOutUser.password };
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set('Content-Type', "application/json")
        .send(data)
      const loggedInUser = await getUserByEmail(data.email, db);
      const userId = loggedInUser?._id.toString() as string;
      const loggedInUserSessions = await getUserAuthSessions(userId, db);

      expect(loggedInUserSessions.length).toBe(1)
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: 'Logged in successfully',
      });
    });
  });

  describe('POST /v1/users/logout', () => {
    let cookie: string;
    const loggedInUser = {
      name: "anjali",
      email: "anjali@gmail.com",
      password: "annu@2925"
    }

    beforeEach(async () => {
      await createUser(loggedInUser, db);
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .send({ email: loggedInUser.email, password: loggedInUser.password })

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 200 ok for logging out user successfully', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/logout')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const loggedOutUser = await getUserByEmail(loggedInUser.email, db);
      const userId = loggedOutUser?._id.toString() as string;
      const userAuthSession = await getUserAuthSessions(userId, db);

      expect(userAuthSession.length).toBe(0);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: 'Logout successfully',
      });
    });
  });

  describe('POST /v1/users/picture', () => {
    let cookie: string;
    const loggedInUser = {
      name: "anjali",
      email: "anjali@gmail.com",
      password: "annu@2925"
    }

    beforeEach(async () => {
      await createUser(loggedInUser, db);
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .send({ email: loggedInUser.email, password: loggedInUser.password })

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 400 bad request if profile image is not attached', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/picture')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it("should return 400 bad request if profile image size exceeds 10MB", async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/picture')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach(UPLOADED_PROFILE_IMG_IDENTIFIER, Buffer.alloc(11 * 1024 * 1024), {
          filename: "large.jpg"
        });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Allowed file size limit is 10MB',
      });
    });

    it('should return 200 ok if file is successfully uploaded', async () => {
      vi.spyOn(uploadUtils, 'uploadFileToCloudinary').mockImplementation(() => {
        return Promise.resolve('https://img-url.png');
      });
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/picture')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach(UPLOADED_PROFILE_IMG_IDENTIFIER, Buffer.from('test-file'), {
          filename: 'test.png',
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: 'Profile image uploaded successfully',
        data: {
          url: 'https://img-url.png',
        },
      });
    });
  });

  describe('PATCH /v1/users/me', () => {
    let cookie: string;

    const loggedInUser = {
      name: "anjali",
      email: "anjali@gmail.com",
      password: "annu@2925"
    }

    beforeEach(async () => {
      await createUser(loggedInUser, db);

      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .send({ email: loggedInUser.email, password: loggedInUser.password })

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 400 bad request if invalid profile data is provided', async () => {
      const app = buildServer({ db });
      const invalidData = {
        name: 'manish',
        profileImg: 'https://picsum.photos/536/354',
        otherData: 'other data not required',
      };
      const res = await request(app)
        .patch('/v1/users/me')
        .send(invalidData)
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie]);
      const userData = await getUserByEmail(loggedInUser.email, db);

      expect(userData?.name).not.toBe(invalidData.name);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: "error",
        message: 'Bad request',
      });
    });

    it('should return 200 ok for successfully updating the profile data', async () => {
      const app = buildServer({ db });
      const validData = {
        name: 'manish',
        profileImg: 'https://picsum.photos/536/354',
      };
      const res = await request(app)
        .patch('/v1/users/me')
        .send(validData)
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie]);
      const userData = await getUserByEmail(loggedInUser.email, db);

      expect(userData?.name).toBe(validData.name);
      expect(userData?.profileImg).toBe(validData.profileImg);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: 'User data edited successfully',
      });
    });
  });

  describe('GET /users/me', () => {
    let cookie: string;
    const loggedInUser = {
      name: "anjali",
      email: "anjali@gmail.com",
      password: "annu@2925"
    }

    beforeEach(async () => {
      await createUser(loggedInUser, db);
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/users/login')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .send({ email: loggedInUser.email, password: loggedInUser.password })

      cookie = res.headers['set-cookie'][0];
    });

    it('should return 200 ok for successfully fetching the user data', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/users/me')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const userData = await getUserByEmail(loggedInUser.email, db);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: 'User details fetched successfully',
        data: {
          _id: userData?._id.toString(),
          name: userData?.name,
          email: userData?.email,
          createdAt: userData?.createdAt.toISOString(),
          updatedAt: userData?.updatedAt.toISOString(),
          ...(userData?.profileImg && { profileImg: userData.profileImg })
        },
      });
    });
  });
});
