import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildServer } from '../../app';
import { createBlog } from '../blogs/blogs.services';
import { addCategoryToPost, createPost, getPostById } from '../posts/posts.services';
import { createUser } from '../users/users.services';
import { createCategory, getCategories, getCategoryById } from './categories.services';

describe('CATEGORIES', () => {
  const loggedInUser = {
    name: 'manish',
    email: 'manish@gmail.com',
    password: '124578drd',
  };

  let cookie: string;
  let userId: string;

  beforeEach(async () => {
    const createdUserResult = await createUser(loggedInUser);
    userId = createdUserResult.userId.toString();

    const app = buildServer();
    const res = await request(app)
      .post('/v1/users/login')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ email: loggedInUser.email, password: loggedInUser.password });

    cookie = res.headers['set-cookie'][0];
  });

  describe('POST /v1/categories', () => {
    const blogData = {
      name: 'blog title',
      slug: 'blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    const requiredFields = ['blogId', 'name'];

    requiredFields.forEach((field) => {
      it(`should return 400 bad request if ${field} field is not provided`, async () => {
        const app = buildServer();
        const data = { name: 'typescript', blogId };
        delete data[field];
        const res = await request(app)
          .post(`/v1/categories`)
          .set('Accept', 'application/json')
          .set('Cookie', [cookie])
          .send(data);
        const allBlogcategories = await getCategories(blogId);

        expect(allBlogcategories.length).toBe(0);
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: 'Bad request',
        });
      });
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer();
      const data = { name: 'typescript', blogId, invalidData: '' };
      const res = await request(app)
        .post('/v1/categories')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogcategories = await getCategories(blogId);

      expect(allBlogcategories.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 404 not found if blog with blogId passed in body does not exists', async () => {
      const nonExistentBlogId = '64d2f5b8e4a7c3f1b9a6d412';
      const data = { name: 'typescript', blogId: nonExistentBlogId };
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/categories`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return 403 forbidden if user attempts to add create category in blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const data = { name: 'typescript', blogId: otherUserBlogId };
      const app = buildServer();
      const res = await request(app)
        .post('/v1/categories')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const otherUserAllcategories = await getCategories(otherUserBlogId);

      expect(otherUserAllcategories.length).toBe(0);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to create the category in this blog',
      });
    });

    it('should return 200 ok for successfully creating a new category', async () => {
      const app = buildServer();
      const data = {
        blogId,
        name: 'javascript',
        description: 'Contains all the blogs of the javascript category.',
      };
      const res = await request(app)
        .post('/v1/categories')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const createdCategoryData = await getCategories(blogId);

      expect(createdCategoryData).toBeDefined();
      expect(createdCategoryData.length).toBe(1);
      expect(createdCategoryData[0].name).toBe(data.name);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        message: 'Category created successfully',
      });
    });
  });

  describe('GET /v1/categories', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
      await createCategory(userId, blogId, { blogId, name: 'Typescript' });
      await createCategory(userId, blogId, { blogId, name: 'Python' });
    });

    it('should return 400 bad request if blogId is not passed in query params', async () => {
      const app = buildServer();
      const res = await request(app)
        .get('/v1/categories')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 403 forbidden if user attempts to add read the content of category in the blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/categories?blogId=${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to read the content of the categories',
      });
    });

    it('should return 200 ok along with all the categories related to the blogId', async () => {
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/categories?blogId=${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('PATCH /v1/categories/:categoryId', () => {
    let categoryId: string;

    beforeEach(async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const blogId = (await createBlog(userId, blogData)).blogId.toString();
      const categoryData = {
        name: 'javascript',
        description: 'Contains all the blogs related to the javascript',
        blogId,
      };
      categoryId = (await createCategory(userId, blogId, categoryData)).categoryId.toString();
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer();
      const data = {
        invalidData: 'invalid',
      };
      const res = await request(app)
        .patch(`/v1/categories/${categoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 403 forbidden if user attempts to edit the content of category in the they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const categoryData = {
        name: 'typescript',
        blogId: otherUserBlogId,
      };
      const otherUserCategoryId = (
        await createCategory(otherUserId, otherUserBlogId, categoryData)
      ).categoryId.toString();
      const editCategoryContent = {
        name: 'javascript',
      };
      const app = buildServer();
      const res = await request(app)
        .patch(`/v1/categories/${otherUserCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(editCategoryContent);
      const editedCategoryData = await getCategoryById(otherUserCategoryId);

      expect(editedCategoryData?.name).not.toBe(editCategoryContent.name);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to edit the content of the categories',
      });
    });

    it('should return 200 ok for successfully editing the category content', async () => {
      const app = buildServer();
      const data = {
        name: 'typescript',
      };
      const res = await request(app)
        .patch(`/v1/categories/${categoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editCategoryData = await getCategoryById(categoryId);

      expect(editCategoryData).toBeDefined();
      expect(editCategoryData?.name).toBe(data.name);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Edited the category successfully',
      });
    });

    it("should return 200 ok for successfully updating the category name in posts collection after updating the category name", async () => {
      const blogData = {
        name: "test1",
        slug: "test-blog"
      }
      const createdBlog = await createBlog(userId, blogData);
      const blogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const categoryData = {
        blogId,
        name: "javascript"
      }
      const createdCategory = await createCategory(userId, blogId, categoryData);
      const createdCategoryId = createdCategory.categoryId.toString();
      await addCategoryToPost(createdPostId, createdCategoryId, categoryData.name);
      const app = buildServer();
      const data = {
        name: 'typescript',
      };
      const res = await request(app)
        .patch(`/v1/categories/${createdCategoryId}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      const editCategoryData = await getCategoryById(createdCategoryId);
      const postData = await getPostById(createdPostId);

      expect(editCategoryData).toBeDefined();
      expect(editCategoryData?.name).toBe(data.name);
      expect(postData?.categories[0].name).toBe('typescript');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Edited the category successfully',
      });
    });
  });

  describe('DELETE /v1/categories/:categoryId', () => {
    let categoryId: string;
    const categoryData = {
      name: 'javascript',
      description: 'Contains all the blogs related to the javascript',
    };

    beforeEach(async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const blogId = (await createBlog(userId, blogData)).blogId.toString();
      categoryId = (await createCategory(userId, blogId, {
        ...categoryData,
        blogId
      })).categoryId.toString();
    });

    it('should return 403 forbidden if user attempts to edit the content of category in the they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const categoryData = {
        name: 'typescript',
        blogId: otherUserBlogId,
      };
      const otherUserCategoryId = (
        await createCategory(otherUserId, otherUserBlogId, categoryData)
      ).categoryId.toString();
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/categories/${otherUserCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedCategoryData = await getCategoryById(otherUserCategoryId);

      expect(editedCategoryData).toBeDefined();
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message:
          'You do not have permissions to delete the content of the categories',
      });
    });

    it('should return 200 ok for successfully deleting the category data and removing corresponding reference in posts', async () => {
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const createdBlog = await createBlog(userId, blogData);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId);
      const createdPostId = createdPost.postId.toString();
      await addCategoryToPost(createdPostId, categoryId, categoryData.name);
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/categories/${categoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedcategory = await getCategoryById(categoryId);
      const postData = await getPostById(createdPostId);

      expect(deletedcategory).toBeNull();
      expect(postData?.categories).not.include(categoryId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Deleted the category successfully',
      });
    });
  });
});
