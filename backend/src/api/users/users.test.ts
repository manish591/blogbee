import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';

describe('users', () => {
  describe('POST /users', () => {
    it('should return 400 bad request if email is not provided', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: "manish" })
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
    });

    it("should return 400 bad request if password length is lower than 6 characters", async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: "manish", email: "abc@gmail.com", password: "25" })
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
    });

    it("should return 409 confict if user with email already exists", async () => {

    });

    it("should return 201 created for successfully creating user account", async () => {

    })
  });

  describe("POST /users/login", () => {

  });

  describe("POST /users/logout", () => {

  });
});
