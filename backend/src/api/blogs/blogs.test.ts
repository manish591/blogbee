import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import * as uploadUtils from '../../utils/upload-files';
import { createUser, getAuthSession, getUserByEmail } from '../users/users.services';
import { createBlog, getAllBlogs, getBlogById, getBlogBySlug } from './blogs.services';
import { SESSION_COOKIE_NAME, UPLOADED_BLOG_LOGO_FILE_NAME } from '../../utils/constants';

describe('blogs', () => {
  const loggedInUser = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  let cookie: string;
  let sessionId: string;
  let userId: string;

  beforeEach(async () => {
    await createUser(loggedInUser, db);

    const app = buildServer({ db });
    const res = await request(app)
      .post('/v1/users/login')
      .set('Accept', 'application/json')
      .set("Content-Type", "application/json")
      .send({ email: loggedInUser.email, password: loggedInUser.password })

    cookie = res.headers['set-cookie'][0];
    sessionId = cookie
      .split(';')
      .find((c) => c.split('=')[0] === SESSION_COOKIE_NAME)
      ?.split('=')[1] as string;
    userId = (await getAuthSession(sessionId, db))?.userId.toString() as string;
  });

  describe('POST /v1/blogs', () => {
    const requiredField = ["name", "slug"];
    const blogData = {
      name: 'first blog',
      slug: 'first-blog',
      about: 'something about the blog',
    }

    requiredField.forEach(field => {
      it(`should return 400 bad request if ${field} field is not provided`, async () => {
        const app = buildServer({ db });
        const data = { name: blogData.name, slug: blogData.slug };
        delete data[field];
        const res = await request(app)
          .post('/v1/blogs')
          .set('Accept', 'application/json')
          .set("Content-Type", "application/json")
          .set('Cookie', [cookie])
          .send(data);
        const createdBlog = await getBlogBySlug(blogData.slug, db);

        expect(createdBlog).toBeNull();
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          code: 400,
          status: 'error',
          message: 'Bad request',
        });
      });
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = { name: blogData.name, slug: blogData.slug, invalidData: "" };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie])
        .send(data);
      const createdBlog = await getBlogBySlug(blogData.slug, db);

      expect(createdBlog).toBeNull();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if slug contains characters other than lowercase, numbers and hyphes', async () => {
      const app = buildServer({ db });
      const data = { name: blogData.name, slug: "myslug$%jf" };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie])
        .send(data);
      const createdBlog = await getBlogBySlug(blogData.slug, db);

      expect(createdBlog).toBeNull();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 'error',
        code: 400,
        message: 'Bad request',
      });
    });

    it('should return 409 conflict if blog with slug already exists', async () => {
      await createBlog(userId, { name: blogData.name, slug: blogData.slug, about: null, logo: null }, db);
      const app = buildServer({ db });
      const data = { name: "different name", slug: blogData.slug };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie])
        .send(data);
      const allBlogs = await getAllBlogs(userId, db);
      const createdBlog = await getBlogBySlug(blogData.slug, db);

      expect(allBlogs.length).toBe(1);
      expect(createdBlog?.name).not.toBe(data.name);
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        code: 409,
        status: 'error',
        message: 'Slug not available',
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
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set("Content-Type", "application/json")
        .set('Cookie', [cookie])
        .send(data);
      const createdBlog = await getBlogBySlug(data.slug, db);

      expect(createdBlog).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        code: 201,
        status: 'success',
        message: 'Created the blog successfully',
      });
    });
  });

  describe('GET /blogs', () => {
    const blogData1 = {
      name: 'first blog',
      slug: 'first-blog',
      about: null,
      logo: null
    };

    const blogData2 = {
      name: 'Second blog',
      slug: 'second-blog',
      about: null,
      logo: null
    };

    const blogData3 = {
      name: 'Third blog',
      slug: 'third-blog',
      about: null,
      logo: null
    };

    const blogData4 = {
      name: 'Fourth blog',
      slug: 'fourth-blog',
      about: null,
      logo: null
    };

    const blogData5 = {
      name: "fifth blog",
      slug: "fifth-blog",
      about: null,
      logo: null
    }

    const userData = {
      name: 'new users',
      email: 'ema@gmail.com',
      password: 'new pass'
    };

    beforeEach(async () => {
      await createBlog(userId, blogData1, db);
      await createBlog(userId, blogData2, db);
      await createBlog(userId, blogData3, db);
      await createBlog(userId, blogData4, db);
      await createUser(userData, db);
      const newUserCreated = await getUserByEmail(userData.email, db);
      const newUserId = newUserCreated?._id.toString() as string;
      await createBlog(newUserId, blogData5, db);
    });

    it('should return 400 bad request if invalid query parameters are passed', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/blogs?data=jdjdj')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 200 ok along with users blogs', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/blogs')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(4);
    });

    it('should return 200 ok along with blogs with limit 3', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/blogs?limit=3')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
    });

    it('should return 200 ok along with blogs for search query fourth', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/blogs?q=fourth')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("GET /blogs/:blogId", () => {
    const blogData = {
      name: "fifth blog",
      slug: "fifth-blog",
      about: null,
      logo: null
    }

    let blogId: string;

    beforeEach(async () => {
      await createBlog(userId, blogData, db);
      const createdBlogData = await getBlogBySlug(blogData.slug, db);
      blogId = createdBlogData?._id.toString() as string;
    });

    it("should return 200 ok along with blog data", async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Blog returned successfully");
      expect(res.body.data.slug).toBe(blogData.slug);
    });
  });

  describe('POST /blogs/logo', () => {
    it('should return 400 bad request if logo file is not attached', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if logo file size exceeds allowed limit of 10MB', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach(UPLOADED_BLOG_LOGO_FILE_NAME, Buffer.alloc(11 * 1024 * 1024), {
          filename: "big.png"
        });

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Allowed file size limit is 10MB',
      });
    });

    it('should return 200 ok if logo file is successfully uploaded', async () => {
      vi.spyOn(uploadUtils, 'uploadFileToCloudinary').mockImplementation(() => {
        return Promise.resolve('https://img-url.png');
      });
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach(UPLOADED_BLOG_LOGO_FILE_NAME, Buffer.from('test-file'), {
          filename: 'test.png',
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Blog logo uploaded successfully',
        data: {
          url: 'https://img-url.png',
        },
      });
    });
  });

  describe('PATCH /blogs/:blogId', () => {
    const blogData = {
      name: "fifth blog",
      slug: "fifth-blog",
      about: null,
      logo: null
    }

    let blogId: string;

    beforeEach(async () => {
      await createBlog(userId, blogData, db);
      const createdBlogData = await getBlogBySlug(blogData.slug, db);
      blogId = createdBlogData?._id.toString() as string;
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = { invalidData: '' };
      const res = await request(app)
        .patch(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 200 ok for successfully editing the blog content', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'edit blog',
        about: 'about edited blog',
        logo: 'https://test.png',
      };
      const res = await request(app)
        .patch(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editedBlogData = await getBlogById(blogId, db);

      expect(editedBlogData).toBeDefined();
      expect(editedBlogData?.name).toBe(data.name);
      expect(editedBlogData?.logo).toBe(data.logo);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Edited the blog successfully',
      });
    });
  });

  describe('DELETE /blogs/:blogId', () => {
    const blogData = {
      name: "fifth blog",
      slug: "fifth-blog",
      about: null,
      logo: null
    }

    let blogId: string;

    beforeEach(async () => {
      await createBlog(userId, blogData, db);
      const createdBlogData = await getBlogBySlug(blogData.slug, db);
      blogId = createdBlogData?._id.toString() as string;
    });

    it('should return 200 ok and delete the users blog resource', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedBlog = await getBlogById(blogId, db);

      expect(res.status).toBe(200);
      expect(deletedBlog).toBe(null);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Deleted the blog successfully',
      });
    });

    // it("should return 200 ok and delete the corresponding posts and tags related to blog", async () => {
    //   await createPost(userId, blogId, db);
    //   await createTag(userId, )
    //   const app = buildServer({ db });
    //   const res = await request(app)
    //     .delete(`/v1/blogs/${blogId}`)
    //     .set('Accept', 'application/json')
    //     .set('Cookie', [cookie]);
    //   const deletedBlog = await getBlogById(userId, blogId, db);
    //   const allUserPosts = await getAllUserPosts(userId, db);
    //   const allUserTags = await getAllUserTags(userId, db);

    //   expect(deletedBlog).toBe(null);
    //   expect(allUserTags).toBe(0);
    //   expect(allUserPosts.length).toBe(0);
    //   expect(res.status).toBe(200);
    //   expect(res.body).toMatchObject({
    //     code: 200,
    //     status: 'success',
    //     message: 'Deleted the blog successfully',
    //   });
    // });
  });
});
