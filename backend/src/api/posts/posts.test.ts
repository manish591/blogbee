import { ObjectId } from 'mongodb';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../test/setup';
import { buildServer } from '../../app';
import { PostStatus } from '../../db/schema';
import { createBlog } from '../blogs/blogs.services';
import { createTag, getTagById } from '../tags/tags.services';
import { createUser } from '../users/users.services';
import {
  addTagToPost,
  createPost,
  editPost,
  getAllPosts,
  getPostById,
} from './posts.services';

describe('POSTS', () => {
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

  describe('POST /v1/posts', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 400 bad request if blogId is not provided in request body', async () => {
      const app = buildServer({ db });
      const data = {};
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId, db);

      expect(allBlogPosts.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if invalid mongodb object id is passed for blogId', async () => {
      const app = buildServer({ db });
      const data = {
        blogId: 'invalidId',
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId, db);

      expect(allBlogPosts.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 404 not found if blog with blogId passed in body does not exists', async () => {
      const app = buildServer({ db });
      const data = {
        blogId: '64d2f5b8e4a7c3f1b9a6d412',
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId, db);

      expect(allBlogPosts.length).toBe(0);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: 'error',
        message: 'Blog not found',
      });
    });

    it('should return 403 forbiddedn if user attempts to create post in the blog they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const data = {
        blogId: otherUserBlogId,
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allOtherUserBlogPosts = await getAllPosts(blogId, db);

      expect(allOtherUserBlogPosts.length).toBe(0);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permission to add post in this blog',
      });
    });

    it('should return 200 ok for creating a new posts', async () => {
      const app = buildServer({ db });
      const data = {
        blogId,
      };
      const res = await request(app)
        .post(`/v1/posts`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId, db);

      expect(allBlogPosts.length).toBe(1);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        code: 201,
        status: 'success',
        message: 'Post created successfully',
      });
    });
  });

  describe('GET /v1/posts', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 400 bad request if invalid query params are passed', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&invalidquery=data`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if blogId is not passed in query params', async () => {
      const app = buildServer({ db });
      const res = await request(app)
        .get('/v1/posts')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        code: 400,
        status: 'error',
        message: 'Bad request',
      });
    });

    it('should return 403 forbidden if user attempts to read the posts of the blog they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to read the posts content',
      });
    });

    it('should return 200 ok along with the posts result for blog with blogId', async () => {
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, limit results to 2', async () => {
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&limit=2`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, return page 2 results with limit 3', async () => {
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&limit=3&page=2`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, return result for search query updated', async () => {
      await createPost(userId, blogId, db);
      await createPost(userId, blogId, db);
      const postToEdit = await createPost(userId, blogId, db);
      const postToEditId = postToEdit.postId.toString();
      const editPostData = {
        title: 'updated',
        subTitle: null,
        content: null,
        coverImg: null,
        slug: null,
        postStatus: null,
      };
      await editPost(postToEditId, editPostData, db);
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&q=updated`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('GET /v1/posts/:postId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to access the post they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId, db);
      const otherUserPostId = otherUserPost.postId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to read the post content',
      });
    });

    it('should return 200 ok along with post content', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .get(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('untitled');
    });
  });

  describe('PATCH /v1/posts/:postId', async () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 400 bad request if invalid postId is passed in params', async () => {
      const invalidPostId = 'invalidid';
      const app = buildServer({ db });
      const data = {};
      const res = await request(app)
        .patch(`/v1/posts/${invalidPostId}`)
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

    it('should return 403 forbidden if user attempts to edit the post they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId, db);
      const otherUserPostId = otherUserPost.postId.toString();
      const data = {
        title: 'other user updated title',
      };
      const app = buildServer({ db });
      const res = await request(app)
        .patch(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const otherUserEditedPost = await getPostById(otherUserPostId, db);

      expect(otherUserEditedPost?.title).not.toBe(data.title);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to edit the post',
      });
    });

    it('should return 200 ok for successfully editing the post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer({ db });
      const data = {
        content: 'new content',
      };
      const res = await request(app)
        .patch(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editedPost = await getPostById(createdPostId, db);

      expect(editedPost?.content).toBe(data.content);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Posts edited successfully',
      });
    });
  });

  describe('DELETE /v1/posts/:postId', async () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to delete the posts that they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId, db);
      const otherUserPostId = otherUserPost.postId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const otherUserEditedPost = await getPostById(otherUserPostId, db);

      expect(otherUserEditedPost).toBeDefined();
      expect(otherUserEditedPost?.postStatus).not.toBe(PostStatus.ARCHIVED);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to delete the post',
      });
    });

    it('should return 200 ok for successfuly deleting the post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId, db);

      expect(editedPost?.postStatus).toBe(PostStatus.ARCHIVED);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Posts deleted successfully',
      });
    });
  });

  describe('POST /v1/posts/:postId/tags/:tagId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to add tag to the post they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId, db);
      const otherUserPostId = otherUserPost.postId.toString();
      const otherUserTag = await createTag(
        otherUserId,
        otherUserBlogId,
        { name: 'other user tag', description: null, blogId: otherUserBlogId },
        db,
      );
      const otherUserTagId = otherUserTag.tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${otherUserPostId}/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId, db);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.tags.map(String)).not.toContain(otherUserTagId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to add tag to this post',
      });
    });

    it('should return 409 conflict if user attempts to add tag to the post where tag is already attached to post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const tagData = { name: 'new tag', description: null, blogId };
      const createdTag = await createTag(userId, blogId, tagData, db);
      const createdTagId = createdTag.tagId.toString();
      await addTagToPost(createdPostId, createdTagId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${createdTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        code: 409,
        status: 'error',
        message: 'Post already contains this tag',
      });
    });

    it('should return 403 forbidden is user attempts to add tag to the post where postId and tagId belongs to different blogs', async () => {
      const newBlogData = {
        name: 'other blog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const newBlog = await createBlog(userId, newBlogData, db);
      const newBlogId = newBlog.blogId.toString();
      const userPostOnOldBlog = await createPost(userId, blogId, db);
      const userPostOnOldBlogId = userPostOnOldBlog.postId.toString();
      const tagOnNewBlogData = {
        name: 'new blog tag',
        description: null,
        blogId: newBlogId,
      };
      const tagOnNewBlog = await createTag(
        userId,
        newBlogId,
        tagOnNewBlogData,
        db,
      );
      const tagOnNewBlogId = tagOnNewBlog.tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${userPostOnOldBlogId}/tags/${tagOnNewBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const oldBlogEditedPost = await getPostById(userPostOnOldBlogId, db);

      expect(oldBlogEditedPost).toBeDefined();
      expect(oldBlogEditedPost?.tags).not.contain(new ObjectId(tagOnNewBlogId));
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'The post and tag must belong to the same blog',
      });
    });

    it('should return 200 ok for successfully adding tag to the post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const tagId = (
        await createTag(
          userId,
          blogId,
          { name: 'new tag', description: null, blogId },
          db,
        )
      ).tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId, db);
      const editedTag = await getTagById(tagId, db);

      expect(editedPost?.tags.map(String)).toContain(tagId);
      expect(editedTag?.posts.map(String)).toContain(createdPostId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Tag added to post successfully',
      });
    });
  });

  describe('DELETE /v1/posts/:postId/tags/:tagId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
      logo: null,
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData, db)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to delete the tag from the post they do not own', async () => {
      const otherUserData = {
        name: 'anjali',
        email: 'anjali@gmail.com',
        password: '4478fdehhd',
      };
      const otherUserBlogData = {
        name: 'otherblog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const otherUser = await createUser(otherUserData, db);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(
        otherUserId,
        otherUserBlogData,
        db,
      );
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId, db);
      const otherUserPostId = otherUserPost.postId.toString();
      const otherUserTagId = await createTag(
        otherUserId,
        otherUserBlogId,
        { name: 'other user tag', description: null, blogId: otherUserBlogId },
        db,
      ).then((tag) => tag.tagId.toString());
      addTagToPost(otherUserPostId, otherUserTagId, db);
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/posts/${otherUserPostId}/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId, db);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.tags.map(String)).toContain(otherUserTagId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'You do not have permissions to delete the tag from this post',
      });
    });

    it('should return 404 not found if user attempts to delete the tag from the post where tag is not attached to the post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const createdTag = await createTag(
        userId,
        blogId,
        { name: 'new tag', description: null, blogId },
        db,
      );
      const createdTagId = createdTag.tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}/tags/${createdTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        code: 404,
        status: 'error',
        message: 'Post does not contains this tag',
      });
    });

    it('should return 403 forbidden is user attempts to add tag to the post where postId and tagId belongs to different blogs', async () => {
      const newBlogData = {
        name: 'other blog',
        slug: 'other-blog',
        about: '',
        logo: null,
      };
      const newBlog = await createBlog(userId, newBlogData, db);
      const newBlogId = newBlog.blogId.toString();
      const userPostOnOldBlog = await createPost(userId, blogId, db);
      const userPostOnOldBlogId = userPostOnOldBlog.postId.toString();
      const tagOnNewBlogData = {
        name: 'new blog tag',
        description: null,
        blogId: newBlogId,
      };
      const tagOnNewBlog = await createTag(
        userId,
        newBlogId,
        tagOnNewBlogData,
        db,
      );
      const tagOnNewBlogId = tagOnNewBlog.tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${userPostOnOldBlogId}/tags/${tagOnNewBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const oldBlogEditedPost = await getPostById(userPostOnOldBlogId, db);

      expect(oldBlogEditedPost).toBeDefined();
      expect(oldBlogEditedPost?.tags).not.contain(new ObjectId(tagOnNewBlogId));
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        code: 403,
        status: 'error',
        message: 'The post and tag must belong to the same blog',
      });
    });

    it('should return 200 ok for successfully adding tag to the post', async () => {
      const createdPost = await createPost(userId, blogId, db);
      const createdPostId = createdPost.postId.toString();
      const tagId = (
        await createTag(
          userId,
          blogId,
          { name: 'new tag', description: null, blogId },
          db,
        )
      ).tagId.toString();
      const app = buildServer({ db });
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId, db);
      const editedTag = await getTagById(tagId, db);

      expect(editedPost?.tags.map(String)).toContain(tagId);
      expect(editedTag?.posts.map(String)).toContain(createdPostId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        code: 200,
        status: 'success',
        message: 'Tag added to post successfully',
      });
    });
  });
});
