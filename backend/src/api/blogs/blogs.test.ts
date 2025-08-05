import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import { createNewUser, getAuthSession } from '../users/users.services';
import { createNewBlog } from './blogs.services';

describe('blogs', () => {
  const user1 = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  let cookie: string;
  let sessionId: string;
  let userId: string;

  beforeEach(async () => {
    await createNewUser({ ...user1 }, db);

    const app = buildServer({ db });
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: user1.email, password: user1.password })
      .set('Accept', 'application/json');

    cookie = res.headers['set-cookie'][0];
    sessionId = cookie
      .split(';')
      .find((c) => c.split('=')[0] === 'sessionId')
      ?.split('=')[1] as string;
    userId = (await getAuthSession(sessionId, db))?.userId as string;
  });

  describe('POST /blogs', () => {
    const blogData = {
      name: 'first blog',
      slug: 'first-blog',
      about: 'something about the blog',
    };

    beforeEach(async () => {
      await createNewBlog(userId, blogData, db);
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = {};
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
    });

    it('should return 400 bad request if slug contains characters other than lowercase and hyphes', async () => {
      const app = buildServer({ db });
      const data = { ...blogData, slug: 'first&blog' };
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request body is invalid.',
      });
    });

    it('should return 409 conflict if blog with slug already exists', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'second blog',
        about: 'second blog about',
        slug: blogData.slug,
      };
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        status: 409,
        code: 'Conflict',
        message: 'Slug is taken. Please user a different slug',
      });
    });

    it('should return 200 ok for successfully creating the new blog', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'second blog',
        about: 'second blog about',
        slug: 'second-blog-2',
      };
      const res = await request(app)
        .post('/api/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Successfully created the blog',
      });
    });
  });

  describe("GET /blogs", () => {
    const blogData1 = {
      name: "first blog",
      slug: "first-blog"
    }

    const blogData2 = {
      name: "Second blog",
      slug: "second-blog",
      about: "About second blog"
    }

    const blogData3 = {
      name: "Third blog",
      slug: "third-blog",
      about: "About third blog"
    }

    const blogData4 = {
      name: "Fourth blog",
      slug: "fourth-blog",
      about: "About fourth blog"
    }

    beforeEach(async () => {
      await createNewBlog(userId, blogData1, db);
      await createNewBlog(userId, blogData2, db);
      await createNewBlog(userId, blogData3, db);
      await createNewBlog(userId, blogData4, db);
      await createNewBlog("anotherid", blogData2, db);
    });

    it("should return 400 bad request if invalid query params are passed", async () => {
      const app = buildServer({ db });
      const res = await request(app).get("/api/v1/blogs?data=jdjdj").set("Accept", "application/json").set("Cookie", [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: "Bad Request",
        message: "Request query params are invalid."
      });
    });

    it("should return 200 ok along with users blog", async () => {
      const app = buildServer({ db });
      const res = await request(app).get("/api/v1/blogs").set("Accept", "application/json").set("Cookie", [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(4);
    });

    it("should return 200 ok with limit 3 results shown", async () => {
      const app = buildServer({ db });
      const res = await request(app).get("/api/v1/blogs?limit=3").set("Accept", "application/json").set("Cookie", [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
    });

    it("should return 200 ok with search query result for fourth", async () => {
      const app = buildServer({ db });
      const res = await request(app).get("/api/v1/blogs?query=fourth").set("Accept", "application/json").set("Cookie", [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
