import { beforeEach } from 'node:test';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildServer } from '../../app';
import { createBlog } from '../blogs/blogs.services';
import { createCategory } from '../categories/categories.services';
import { createPost, deletePost, editPost } from '../posts/posts.services';
import { createUser } from '../users/users.services';
import { PostStatus } from '../../db/schema';

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
        data: expect.objectContaining({
          name: blogData.name,
          slug: blogData.slug,
          about: blogData.about,
        })
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

    it('should return 200 ok along with post data', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();
      editPost(createdPostId, {
        slug: "new-slug",
        postStatus: PostStatus.PUBLISHED
      });

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Posts list fetched successfully',
        data: {
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
      });
    });

    it('should return 200 ok along with only published post', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      await createPost(userId, createdBlogId);
      const publishedPost = await createPost(userId, createdBlogId);
      const publishedPostId = publishedPost.postId.toString();
      const archivedPost = await createPost(userId, createdBlogId);
      const archivedPostId = await archivedPost.postId.toString();
      await editPost(publishedPostId, {
        postStatus: PostStatus.PUBLISHED
      });
      await deletePost(archivedPostId);

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].postStatus).toBe('published');
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

    it("should return 404 not found if user passed blog slug of unpublished post", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();
      const editPostData = {
        slug: "draft-slug"
      }
      await editPost(createdPostId, editPostData);

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts/${editPostData.slug}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: "Post not found"
      });
    });

    it('should return 200 ok with post data', async () => {
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
        postStatus: PostStatus.PUBLISHED
      });

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/posts/${postSlug}?blog=${blogData.slug}`,
      );

      console.log("the data", res.body);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Post details fetched successfully',
        data: expect.objectContaining({
          title: 'untitled',
          slug: postSlug,
          categories: [],
        })
      });
    });
  });

  describe('GET /v1/public/preview/:postId', () => {
    it('should return 404 not found if blog with blogSlug does not exists', async () => {
      const nonExistingBlogSlug = 'non-existing-blog-slug';
      const postId = '64a7b2f4e4b0f5c8d6e4b0f5';

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/preview/${postId}?blog=${nonExistingBlogSlug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return 404 not found if post with postId does not exists', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      await createBlog(userId, blogData);
      const nonExistingPostId = '64a7b2f4e4b0f5c8d6e4b0f5';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/preview/${nonExistingPostId}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post not found',
      });
    });

    it("should return 404 not found if user passed blog slug of archived post", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();
      await deletePost(createdPostId);

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/preview/${createdPostId}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: "Post not found"
      });
    });

    it('should return 200 ok with post data', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();

      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/preview/${createdPostId}?blog=${blogData.slug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Post preview details fetched successfully',
        data: expect.objectContaining({
          title: 'untitled',
          categories: [],
        })
      });
    });
  });

  describe('GET /v1/public/categories', () => {
    it('should return 404 not found is blog with blogSlug does not exists', async () => {
      const nonExistingBlogSlug = 'non-existing-blog-slug';
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/categories?blog=${nonExistingBlogSlug}`,
      );

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return blog categories list', async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData);
      const blogSlug = blogData.slug;
      const blogId = createdBlog.blogId.toString();
      await createCategory(userId, blogId, {
        blogId,
        name: 'test category',
        description: 'test category description',
      });
      const app = buildServer();
      const res = await request(app).get(
        `/v1/public/categories?blog=${blogSlug}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Categories fetched successfully',
        data: expect.arrayContaining([
          expect.objectContaining({
            name: 'test category',
            description: 'test category description',
          }),
        ]),
      });
    });
  });
});
