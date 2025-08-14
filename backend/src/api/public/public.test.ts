import request from "supertest";
import { describe, expect, it } from "vitest";
import { db } from "../../../test/setup";
import { buildServer } from "../../app";
import { createBlog } from "../blogs/blogs.services";
import { beforeEach } from "node:test";
import { createUser } from "../users/users.services";
import { createPost, editPost } from "../posts/posts.services";
import { createTag } from "../tags/tags.services";

describe("EMBED API", () => {
  let userId: string;

  beforeEach(async () => {
    const userData = {
      name: "test user",
      email: "test@gmail.com",
      password: "test12457"
    }

    const testUser = await createUser(userData, db);
    userId = testUser.userId.toString();
  });

  describe("GET /v1/public/blogs", () => {
    it("should return 404 not found is blog with blogSlug does not exists", async () => {
      const nonExistingBlogSlug = "non-existing-blog-slug";
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/blogs?blog=${nonExistingBlogSlug}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: "error",
        message: "Blog not found"
      });
    });

    it("should return blog data with blog posts and tags", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData, db);
      const blogSlug = blogData.slug;
      const blogId = createdBlog.blogId.toString();
      await createPost(userId, blogId, db);
      await createTag(userId, blogId, {
        blogId,
        name: "test tag",
        description: "test tag description",
      }, db);
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/blogs?blog=${blogSlug}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: "Blog data retrieved successfully",
        data: {
          blog: expect.objectContaining({
            name: blogData.name,
            slug: blogData.slug,
            about: blogData.about,
          }),
          posts: [expect.objectContaining({
            title: "untitled",
            tags: []
          })],
          tags: [
            expect.objectContaining({
              name: "test tag",
              description: "test tag description"
            })
          ],
        }
      });
    });
  });

  describe("GET /v1/public/posts", () => {
    it("should return 404 not found if blog with blogSlug does not exists", async () => {
      const nonExistingBlogSlug = "non-existing-blog-slug";
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/posts?blog=${nonExistingBlogSlug}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: "error",
        message: "Blog not found"
      });
    });

    it("should return blog and post data", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData, db);
      const createdBlogId = createdBlog.blogId.toString();
      await createPost(userId, createdBlogId, db);
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/posts?blog=${blogData.slug}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: "Posts list fetched successfully",
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
            hasNext: false,
            hasPrevious: false,
            items: [
              expect.objectContaining({
                title: "untitled",
                tags: []
              })
            ]
          }
        }
      });
    });
  });

  describe("GET /v1/public/posts/:postSlug", () => {
    it("should return 404 not found if blog with blogSlug does not exists", async () => {
      const nonExistingBlogSlug = "non-existing-blog-slug";
      const postSlug = "some-post-slug";
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/posts/${postSlug}?blog=${nonExistingBlogSlug}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: "error",
        message: "Blog not found"
      });
    });

    it("should return 404 not found if post with postSlug does not exists", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      await createBlog(userId, blogData, db);
      const nonExistingPostSlug = "non-existing-post-slug";
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/posts/${nonExistingPostSlug}?blog=${blogData.slug}`);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: "error",
        message: "Post not found"
      });
    });

    it("should return 200 ok with post data and blog data", async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const createdBlog = await createBlog(userId, blogData, db);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId, db);
      const createdPostId = createdPost.postId.toString();
      const postSlug = "new-slug";
      editPost(createdPostId, {
        slug: postSlug
      }, db);
      const app = buildServer({ db });
      const res = await request(app).get(`/v1/public/posts/${postSlug}?blog=${blogData.slug}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: "success",
        message: "Post details fetched successfully",
        data: {
          post: expect.objectContaining({
            title: "untitled",
            slug: postSlug,
            tags: []
          }),
          blog: expect.objectContaining({
            name: blogData.name,
            slug: blogData.slug,
            about: blogData.about,
          })
        }
      });
    });
  });
});
