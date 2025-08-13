import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import { createBlog } from '../blogs/blogs.services';
import { addTagToPost, createPost, getPostById } from '../posts/posts.services';
import { createUser } from '../users/users.services';
import { createTag, getBlogTags, getTagById } from './tags.services';

describe('TAGS', () => {
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

  describe('POST /v1/tags', () => {
    const blogData = {
      name: 'blog title',
      slug: 'blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    const requiredFields = ['blogId', 'name'];

    requiredFields.forEach((field) => {
      it(`should return 400 bad request if ${field} field is not provided`, async () => {
        const app = buildServer({ db });
        const data = { name: 'typescript', blogId };
        delete data[field];
        const res = await request(app)
          .post(`/v1/tags`)
          .set('Accept', 'application/json')
          .set('Cookie', [cookie])
          .send(data);
        const allBlogTags = await getBlogTags(blogId, db);

        expect(allBlogTags.length).toBe(0);
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
      const data = { name: 'typescript', blogId, invalidData: '' };
      const res = await request(app)
        .post('/v1/tags')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogTags = await getBlogTags(blogId, db);

      expect(allBlogTags.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 404 not found if blog with blogId passed in body does not exists', async () => {
      const nonExistentBlogId = '64d2f5b8e4a7c3f1b9a6d412';
      const data = { name: 'typescript', blogId: nonExistentBlogId };
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/tags`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: 'error',
        message: 'Blog not found',
      });
    });

    it('should return 403 forbidden if user attempts to add create tag in blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const data = { name: 'typescript', blogId: otherUserBlogId };
      const app = buildServer({ db });
      const res = await request(app)
        .post('/v1/tags')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const otherUserAllTags = await getBlogTags(otherUserBlogId, db);

      expect(otherUserAllTags.length).toBe(0);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to create the tag in this blog',
      });
    });

    it('should return 200 ok for successfully creating a new tag', async () => {
      const app = buildServer({ db });
      const data = {
        blogId,
        name: 'Javascript',
        description: 'Contains all the blogs of the javascript category.',
      };
      const res = await request(app)
        .post('/v1/tags')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const createdTagData = await getBlogTags(blogId, db);

      expect(createdTagData).toBeDefined();
      expect(createdTagData.length).toBe(1);
      expect(createdTagData[0].name).toBe(data.name);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        code: 201,
        status: 'success',
        message: 'Tag created successfully',
      });
    });
  });

  describe('GET /v1/tags', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
      await createTag(
        userId,
        blogId,
        { blogId, name: 'Typescript' },
        db,
      );
      await createTag(
        userId,
        blogId,
        { blogId, name: 'Python' },
        db,
      );
    });

    it('should return 400 bad request if blogId is not passed in query params', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/tags')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 403 forbidden if user attempts to add read the content of tag in the blog they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/tags?blogId=${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to read the content of the tags',
      });
    });

    it('should return 200 ok along with all the tags related to the blogId', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/tags?blogId=${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('PATCH /v1/tags/:tagId', () => {
    let tagId: string;

    beforeEach(async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const blogId = (await createBlog(userId, blogData, db)).blogId.toString();
      const tagData = {
        name: 'javascript',
        description: 'Contains all the blogs related to the javascript',
        blogId,
      };
      tagId = (await createTag(userId, blogId, tagData, db)).tagId.toString();
    });

    it('should return 400 bad request if invalid request body is provided', async () => {
      const app = buildServer({ db });
      const data = {
        invalidData: 'invalid',
      };
      const res = await request(app)
        .patch(`/v1/tags/${tagId}`)
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

    it('should return 403 forbidden if user attempts to edit the content of tag in the they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const tagData = {
        name: 'typescript',
        blogId: otherUserBlogId,
      };
      const otherUserTagId = (
        await createTag(otherUserId, otherUserBlogId, tagData, db)
      ).tagId.toString();
      const editTagContent = {
        name: 'javascript',
      };
      const app = buildServer({ db });
      const res = await request(app)
        .patch(`/v1/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(editTagContent);
      const editedTagData = await getTagById(otherUserTagId, db);

      expect(editedTagData?.name).not.toBe(editTagContent.name);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to edit the content of the tags',
      });
    });

    it('should return 200 ok for successfully editing the tag content', async () => {
      const app = buildServer({ db });
      const data = {
        name: 'typescript',
      };
      const res = await request(app)
        .patch(`/v1/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editTagData = await getTagById(tagId, db);

      expect(editTagData).toBeDefined();
      expect(editTagData?.name).toBe(data.name);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Edited tag successfully',
      });
    });
  });

  describe('DELETE /v1/tags/:tagId', () => {
    let tagId: string;

    beforeEach(async () => {
      const blogData = {
        name: 'update blog title',
        slug: 'update-blog-title',
        about: 'This is a content.',
      };
      const blogId = (await createBlog(userId, blogData, db)).blogId.toString();
      const tagData = {
        name: 'javascript',
        description: 'Contains all the blogs related to the javascript',
        blogId,
      };
      tagId = (await createTag(userId, blogId, tagData, db)).tagId.toString();
    });

    it('should return 403 forbidden if user attempts to edit the content of tag in the they do not own', async () => {
      const otherUserData = {
        name: 'virat',
        email: 'virat@gmail.com',
        password: '4578222djjd',
      };
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, blogData, db);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const tagData = {
        name: 'typescript',
        blogId: otherUserBlogId,
      };
      const otherUserTagId = (
        await createTag(otherUserId, otherUserBlogId, tagData, db)
      ).tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedTagData = await getTagById(otherUserTagId, db);

      expect(editedTagData).toBeDefined();
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message:
          'You do not have permissions to delete the content of the tags',
      });
    });

    it('should return 200 ok for successfully deleting the tag data and removing corresponding reference in posts', async () => {
      const blogData = {
        name: 'other blog',
        slug: 'other-user-blog',
      };
      const createdBlog = await createBlog(userId, blogData, db);
      const createdBlogId = createdBlog.blogId.toString();
      const createdPost = await createPost(userId, createdBlogId, db);
      const createdPostId = createdPost.postId.toString();
      await addTagToPost(createdPostId, tagId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const deletedTag = await getTagById(tagId, db);
      const postData = await getPostById(createdPostId, db);

      expect(deletedTag).toBeNull();
      expect(postData?.tags).not.include(tagId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Deleted tag successfully',
      });
    });
  });
});
