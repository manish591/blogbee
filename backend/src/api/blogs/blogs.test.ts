import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import { UPLOADED_BLOG_LOGO_IDENTIFIER } from '../../utils/constants';
import * as uploadUtils from '../../utils/upload-files';
import { createPost, getPostById } from '../posts/posts.services';
import { createTag, getTagById } from '../tags/tags.services';
import { createUser } from '../users/users.services';
import {
  createBlog,
  getAllBlogsByUser,
  getBlogById,
  getBlogBySlug,
} from './blogs.services';

describe('blogs', () => {
  const loggedInUser = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  let cookie: string;
  let userId: string;

  beforeEach(async () => {
    const createdUserResult = await createUser(loggedInUser, db);
    userId = createdUserResult.userId.toString();

    const app = buildServer({ db });
    const res = await request(app)
      .post('/v1/users/login')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ email: loggedInUser.email, password: loggedInUser.password });

    cookie = res.headers['set-cookie'][0];
  });

  describe('POST /v1/blogs', () => {
    const requiredField = ['name', 'slug'];
    const blogData = {
      name: 'first blog',
      slug: 'first-blog',
      about: 'something about the blog',
    };

    requiredField.forEach((field) => {
      it(`should return 400 bad request if ${field} field is not provided`, async () => {
        const app = buildServer({ db });
        const data = { name: blogData.name, slug: blogData.slug };
        delete data[field];
        const res = await request(app)
          .post('/v1/blogs')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
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
      const data = {
        name: blogData.name,
        slug: blogData.slug,
        invalidData: '',
      };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
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
      const data = { name: blogData.name, slug: 'myslug$%jf' };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
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
      await createBlog(
        userId,
        { name: blogData.name, slug: blogData.slug, about: null, logo: null },
        db,
      );
      const app = buildServer({ db });
      const data = { name: 'different name', slug: blogData.slug };
      const res = await request(app)
        .post('/v1/blogs')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogs = await getAllBlogsByUser(userId, db);
      const createdBlog = await getBlogBySlug(blogData.slug, db);

      // blog count 1 signifies no new blogs created
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
        .set('Content-Type', 'application/json')
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
      logo: null,
    };

    const blogData2 = {
      name: 'Second blog',
      slug: 'second-blog',
      about: null,
      logo: null,
    };

    const blogData3 = {
      name: 'Third blog',
      slug: 'third-blog',
      about: null,
      logo: null,
    };

    const blogData4 = {
      name: 'Fourth blog',
      slug: 'fourth-blog',
      about: null,
      logo: null,
    };

    const blogData5 = {
      name: 'fifth blog',
      slug: 'fifth-blog',
      about: null,
      logo: null,
    };

    const userData = {
      name: 'new users',
      email: 'ema@gmail.com',
      password: 'new pass',
    };

    beforeEach(async () => {
      await createBlog(userId, blogData1, db);
      await createBlog(userId, blogData2, db);
      await createBlog(userId, blogData3, db);
      await createBlog(userId, blogData4, db);
      const newUserCreated = await createUser(userData, db);
      const newUserId = newUserCreated.userId.toString();
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

  describe('GET /blogs/:blogId', () => {
    it('should return 400 bad request if blog id passed in params is not a valid mongo object id', async () => {
      const invalidBlogId = 'invalidid';
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/blogs/${invalidBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 404 not found if blog with blogid does not exists', async () => {
      const nonExistentBlogId = '64d2f5b8e4a7c3f1b9a6d412';
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/blogs/${nonExistentBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: 'error',
        message: 'Blog not found',
      });
    });

    it('should return 403 forbidden if user attempts to access blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
        about: '',
        logo: '',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/blogs/${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permission to read the content of the blog',
      });
    });

    it('should return 200 ok along with blog data', async () => {
      const blogData = {
        name: 'fifth blog',
        slug: 'fifth-blog',
        about: null,
        logo: null,
      };
      const createdBlogResult = await createBlog(userId, blogData, db);
      const blogId = createdBlogResult.blogId.toString();

      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blog data returned successfully');
      expect(res.body.data.slug).toBe(blogData.slug);
      expect(res.body.data.name).toBe(blogData.name);
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
        message: 'File not found',
      });
    });

    it('should return 400 bad request if logo file size exceeds allowed limit of 10MB', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/blogs/logo')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .attach(UPLOADED_BLOG_LOGO_IDENTIFIER, Buffer.alloc(11 * 1024 * 1024), {
          filename: 'big.png',
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
        .attach(UPLOADED_BLOG_LOGO_IDENTIFIER, Buffer.from('test-file'), {
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
      name: 'fifth blog',
      slug: 'fifth-blog',
      about: null,
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      const createdBlogResult = await createBlog(userId, blogData, db);
      blogId = createdBlogResult.blogId.toString();
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = { invalidData: '' };
      const res = await request(app)
        .patch(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editedBlog = await getBlogById(blogId, db);

      // checking for invalidData not get added to the db
      expect(editedBlog).not.toHaveProperty('invalidData');
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 403 forbidden if user attempts to edit blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
        about: '',
        logo: '',
      };
      const blogDataToEdit = {
        name: 'otherblogedited',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .patch(`/v1/blogs/${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(blogDataToEdit);
      const otherBlogAfterEditing = await getBlogById(otherUserBlogId, db);

      expect(otherBlogAfterEditing?.name).not.toBe(blogDataToEdit.name);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to edit the blog',
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
      name: 'fifth blog',
      slug: 'fifth-blog',
      about: null,
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      const createdBlogResult = await createBlog(userId, blogData, db);
      blogId = createdBlogResult.blogId.toString();
    });

    it('should return 403 forbidden if user attempts to delete the blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
        about: '',
        logo: '',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/blogs/${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const otherBlogAfterEditing = await getBlogById(otherUserBlogId, db);

      // checking if other blog still exists
      expect(otherBlogAfterEditing).toBeDefined();
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to delete the blog',
      });
    });

    it('should return 200 ok and delete the users blog resource', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedBlog = await getBlogById(blogId, db);

      expect(deletedBlog).toBe(null);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Deleted the blog successfully',
      });
    });

    it('should return 200 ok and delete the corresponding posts and tags related to blog', async () => {
      const newTagData = {
        blogId,
        name: 'typescript',
        description: null,
      };
      const newPostId = (
        await createPost(userId, blogId, db)
      ).postId.toString();
      const newTagId = (
        await createTag(userId, blogId, newTagData, db)
      ).tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/blogs/${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedBlog = await getBlogById(blogId, db);
      const deletedPost = await getPostById(newPostId, db);
      const deletedTag = await getTagById(newTagId, db);

      expect(deletedBlog).toBe(null);
      expect(deletedPost).toBe(null);
      expect(deletedTag).toBe(null);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Deleted the blog successfully',
      });
    });
  });
});
