import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import type { Tags } from '../../db/schema';
import * as uploadUtils from '../../utils/upload-files';
import { createNewUser, getAuthSession } from '../users/users.services';
import { createNewBlog, getBlog, TAGS_COLLECTION } from './blogs.services';

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
    userId = (await getAuthSession(sessionId, db))?.userId.toString() as string;
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
        message: 'Request resources are invalid.',
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
        message: 'Request resources are invalid.',
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

  describe('GET /blogs', () => {
    const blogData1 = {
      name: 'first blog',
      slug: 'first-blog',
    };

    const blogData2 = {
      name: 'Second blog',
      slug: 'second-blog',
      about: 'About second blog',
    };

    const blogData3 = {
      name: 'Third blog',
      slug: 'third-blog',
      about: 'About third blog',
    };

    const blogData4 = {
      name: 'Fourth blog',
      slug: 'fourth-blog',
      about: 'About fourth blog',
    };

    beforeEach(async () => {
      await createNewBlog(userId, blogData1, db);
      await createNewBlog(userId, blogData2, db);
      await createNewBlog(userId, blogData3, db);
      await createNewBlog(userId, blogData4, db);

      const newUserId = await createNewUser(
        { name: 'new users', email: 'ema@gmail.com', password: 'new pass' },
        db,
      );
      await createNewBlog(newUserId.insertedId.toString(), blogData2, db);
    });

    it('should return 400 bad request if invalid query params are passed', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/api/v1/blogs?data=jdjdj')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request resources are invalid.',
      });
    });

    it('should return 200 ok along with users blog', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/api/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(4);
    });

    it('should return 200 ok with limit 3 results shown', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/api/v1/blogs?limit=3')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
    });

    it('should return 200 ok with search query result for fourth', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/api/v1/blogs?query=fourth')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('POST /blogs/logo', () => {
    it('should return 400 bad request if logo file is not attached', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'File not found',
      });
    });

    it('should return 200 ok if logo file is successfully uploaded', async () => {
      vi.spyOn(uploadUtils, 'uploadFileToCloudinary').mockImplementation(() => {
        return Promise.resolve('https://img-url.png');
      });

      const app = buildServer({ db });
      const res = await request(app)
        .post('/api/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach('blogLogo', Buffer.from('test-file'), {
          filename: 'test.png',
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Logo uploaded successfully',
        data: {
          url: 'https://img-url.png',
        },
      });
    });
  });

  describe('PATCH /blogs/:blogId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createNewBlog(userId, blogData, db)).toString();
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = { invalidData: '' };
      const res = await request(app)
        .patch(`/api/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request resources are invalid.',
      });
    });

    it('should return 200 ok for successfully updating the blog content', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'updated blog',
        about: 'about updated blog',
        blogLogo: 'https://test.png',
      };
      const res = await request(app)
        .patch(`/api/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Successfully updated the blog',
      });
    });
  });

  describe('DELETE /blogs/blogId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createNewBlog(userId, blogData, db)).toString();
    });

    it('should return 200 ok and delete the users blog resource', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/api/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedBlog = await getBlog(userId, blogId, db);

      expect(res.status).toBe(200);
      expect(deletedBlog).toBe(null);
      expect(res.body).toMatchObject({
        status: 200,
        message: 'Successfully deleted the blog',
      });
    });
  });

  describe('POST /blogs/:blogId/tags', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createNewBlog(userId, blogData, db)).toString();
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = {};
      const res = await request(app)
        .post(`/api/v1/blogs/${blogId}/tags`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 400,
        code: 'Bad Request',
        message: 'Request resources are invalid.',
      });
    });

    it('should return 200 ok for successfully creating a new tag', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'Javascript',
        desciption: 'Contains all the blogs of the javascript category.',
      };
      const res = await request(app)
        .post(`/api/v1/blogs/${blogId}/tags`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const newTagCreatedData = await db
        .collection<Tags>(TAGS_COLLECTION)
        .findOne({
          name: 'Javascript',
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        status: 201,
        message: 'Successfully created a new tag',
      });
      expect(newTagCreatedData).toBeDefined();
      expect(newTagCreatedData?.name).toBe('Javascript');
    });
  });
});
