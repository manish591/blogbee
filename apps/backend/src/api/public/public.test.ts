import { beforeEach } from 'node:test';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildServer } from '../../app';
import { createBlog } from '../blogs/blogs.services';
import { createCategory } from '../categories/categories.services';
import { createPost, editPost } from '../posts/posts.services';
import { createUser } from '../users/users.services';

describe('PUBLIC API', () => {
  let userId: string;

  beforeEach(async () => {
    const userData = {
      name: 'test user',
      email: 'test@gmail.com',
      password: 'test12457',
    };

    const testUser = await createUser(userData);
    userId = testUser.userId.toString();
  });

  describe('GET /v1/public/blogs', () => {
    it('should return 404 not found is blog with blogSlug does not exists', async () => {
      const nonExistingBlogSlug = 'non-existing-blog-slug';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/blogs?blog=${nonExistingBlogSlug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return blog data with blog posts and categories', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const blogSlug = blogData.slug;
      const blogId = createdBlog.blogId.toString();
      await createPost(userId, blogId);
      await createCategory(userId, blogId, {
        blogId,
        name: 'test category',
        description: 'test category description',
      });
      const app = buildServer();
      const res = await request(app).get(`/v1/public/blogs?blog=${blogSlug}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Blog data retrieved successfully',
        data: {
          blog: expect.objectContaining({
            name: blogData.name,
            slug: blogData.slug,
            about: blogData.about,
          }),
          posts: [
            expect.objectContaining({
              title: 'untitled',
              categories: [],
            }),
          ],
          categories: [
            expect.objectContaining({
              name: 'test category',
              description: 'test category description',
            }),
          ],
        },
      });
    });
  });

  describe('GET /v1/public/posts', () => {
    it('should return 404 not found if blog with blogSlug does not exists', async () => {
      const nonExistingBlogSlug = 'non-existing-blog-slug';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts?blog=${nonExistingBlogSlug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return 200 ok along with blog and post data', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      await createPost(userId, createdBlogId);
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Posts list fetched successfully',
        data: {
          blog: expect.objectContaining({
            name: blogData.name,
            slug: blogData.slug,
            about: blogData.about,
          }),
          posts: {
            currentPage: 1,
            limit: 10,
            totalItems: 1,
            totalPages: 1,
            items: [
              expect.objectContaining({
                title: 'untitled',
                categories: [],
              }),
            ],
          },
        },
      });
    });
  });

  describe('GET /v1/public/posts/:postSlug', () => {
    it('should return 404 not found if blog with blogSlug does not exists', async () => {
      const nonExistingBlogSlug = 'non-existing-blog-slug';
      const postSlug = 'some-post-slug';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts/${postSlug}?blog=${nonExistingBlogSlug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return 404 not found if post with postSlug does not exists', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      await createBlog(userId, blogData);
      const nonExistingPostSlug = 'non-existing-post-slug';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts/${nonExistingPostSlug}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post not found',
      });
    });

    it('should return 200 ok with post data and blog data', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();
      const postSlug = 'new-slug';
      editPost(createdPostId, {
        slug: postSlug,
      });
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts/${postSlug}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Post details fetched successfully',
        data: {
          post: expect.objectContaining({
            title: 'untitled',
            slug: postSlug,
            categories: [],
          }),
          blog: expect.objectContaining({
            name: blogData.name,
            slug: blogData.slug,
            about: blogData.about,
          }),
        },
      });
    });
  });
});
