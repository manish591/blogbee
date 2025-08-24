import { ObjectId } from 'mongodb';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
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

  describe('POST /v1/posts', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    it('should return 400 bad request if blogId is not provided in request body', async () => {
      const app = buildServer();
      const data = {};
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId);

      expect(allBlogPosts.items.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if invalid mongodb object id is passed for blogId', async () => {
      const app = buildServer();
      const data = {
        blogId: 'invalidId',
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId);

      expect(allBlogPosts.items.length).toBe(0);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 404 not found if blog with blogId passed in body does not exists', async () => {
      const app = buildServer();
      const data = {
        blogId: '64d2f5b8e4a7c3f1b9a6d412',
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId);

      expect(allBlogPosts.items.length).toBe(0);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer();
      const data = {
        blogId: otherUserBlogId,
      };
      const res = await request(app)
        .post('/v1/posts')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allOtherUserBlogPosts = await getAllPosts(blogId);

      expect(allOtherUserBlogPosts.items.length).toBe(0);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permission to add post in this blog',
      });
    });

    it('should return 200 ok for creating a new posts', async () => {
      const app = buildServer();
      const data = {
        blogId,
      };
      const res = await request(app)
        .post(`/v1/posts`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const allBlogPosts = await getAllPosts(blogId);

      expect(allBlogPosts.items.length).toBe(1);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        message: 'Post created successfully',
      });
    });
  });

  describe('GET /v1/posts', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    it('should return 400 bad request if invalid query params are passed', async () => {
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&invalidquery=data`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });

    it('should return 400 bad request if blogId is not passed in query params', async () => {
      const app = buildServer();
      const res = await request(app)
        .get('/v1/posts')
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${otherUserBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to read the posts content',
      });
    });

    it('should return 200 ok along with the posts result for blog with blogId', async () => {
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, limit results to 2', async () => {
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&limit=2`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, return page 2 results with limit 3', async () => {
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&limit=3&page=2`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(2);
    });

    it('should return 200 ok along with posts of blog with blogId, return result for search query updated', async () => {
      await createPost(userId, blogId);
      await createPost(userId, blogId);
      const postToEdit = await createPost(userId, blogId);
      const postToEditId = postToEdit.postId.toString();
      const editPostData = {
        title: 'updated',
      };
      await editPost(postToEditId, editPostData);
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&q=updated`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
    });
  });

  describe('GET /v1/posts/:postId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId);
      const otherUserPostId = otherUserPost.postId.toString();
      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to read the post content',
      });
    });

    it('should return 200 ok along with post content', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer();
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
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    it('should return 400 bad request if invalid postId is passed in params', async () => {
      const invalidPostId = 'invalidid';
      const app = buildServer();
      const data = {};
      const res = await request(app)
        .patch(`/v1/posts/${invalidPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId);
      const otherUserPostId = otherUserPost.postId.toString();
      const data = {
        title: 'other user updated title',
      };
      const app = buildServer();
      const res = await request(app)
        .patch(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const otherUserEditedPost = await getPostById(otherUserPostId);

      expect(otherUserEditedPost?.title).not.toBe(data.title);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to edit the post',
      });
    });

    it('should return 200 ok for successfully editing the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer();
      const data = {
        content: 'new content',
      };
      const res = await request(app)
        .patch(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const editedPost = await getPostById(createdPostId);

      expect(editedPost?.content).toBe(data.content);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Posts edited successfully',
      });
    });
  });

  describe('DELETE /v1/posts/:postId', async () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId);
      const otherUserPostId = otherUserPost.postId.toString();
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${otherUserPostId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const otherUserEditedPost = await getPostById(otherUserPostId);

      expect(otherUserEditedPost).toBeDefined();
      expect(otherUserEditedPost?.postStatus).not.toBe(PostStatus.ARCHIVED);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to delete the post',
      });
    });

    it('should return 200 ok for successfuly deleting the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId);

      expect(editedPost?.postStatus).toBe(PostStatus.ARCHIVED);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Posts deleted successfully',
      });
    });
  });

  describe('POST /v1/posts/:postId/tags/:tagId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId);
      const otherUserPostId = otherUserPost.postId.toString();
      const otherUserTag = await createTag(otherUserId, otherUserBlogId, {
        name: 'other user tag',
        blogId: otherUserBlogId,
      });
      const otherUserTagId = otherUserTag.tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${otherUserPostId}/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.tags.map(String)).not.toContain(otherUserTagId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to add tag to this post',
      });
    });

    it('should return 409 conflict if user attempts to add tag to the post where tag is already attached to post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const tagData = { name: 'new tag', blogId };
      const createdTag = await createTag(userId, blogId, tagData);
      const createdTagId = createdTag.tagId.toString();
      await addTagToPost(createdPostId, createdTagId);
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${createdTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        message: 'Post already contains this tag',
      });
    });

    it('should return 403 forbidden is user attempts to add tag to the post where postId and tagId belongs to different blogs', async () => {
      const newBlogData = {
        name: 'other blog',
        slug: 'other-blog',
      };
      const newBlog = await createBlog(userId, newBlogData);
      const newBlogId = newBlog.blogId.toString();
      const userPostOnOldBlog = await createPost(userId, blogId);
      const userPostOnOldBlogId = userPostOnOldBlog.postId.toString();
      const tagOnNewBlogData = {
        name: 'new blog tag',
        blogId: newBlogId,
      };
      const tagOnNewBlog = await createTag(userId, newBlogId, tagOnNewBlogData);
      const tagOnNewBlogId = tagOnNewBlog.tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${userPostOnOldBlogId}/tags/${tagOnNewBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const oldBlogEditedPost = await getPostById(userPostOnOldBlogId);

      expect(oldBlogEditedPost).toBeDefined();
      expect(oldBlogEditedPost?.tags).not.contain(new ObjectId(tagOnNewBlogId));
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'The post and tag must belong to the same blog',
      });
    });

    it('should return 200 ok for successfully adding tag to the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const tagId = (
        await createTag(userId, blogId, { name: 'new tag', blogId })
      ).tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId);
      const editedTag = await getTagById(tagId);

      expect(editedPost?.tags.map(String)).toContain(tagId);
      expect(editedTag?.posts.map(String)).toContain(createdPostId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Tag added to post successfully',
      });
    });
  });

  describe('DELETE /v1/posts/:postId/tags/:tagId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
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
      };
      const otherUser = await createUser(otherUserData);
      const otherUserId = otherUser.userId.toString();
      const otherUserBlog = await createBlog(otherUserId, otherUserBlogData);
      const otherUserBlogId = otherUserBlog.blogId.toString();
      const otherUserPost = await createPost(otherUserId, otherUserBlogId);
      const otherUserPostId = otherUserPost.postId.toString();
      const otherUserTagId = await createTag(otherUserId, otherUserBlogId, {
        name: 'other user tag',
        blogId: otherUserBlogId,
      }).then((tag) => tag.tagId.toString());
      addTagToPost(otherUserPostId, otherUserTagId);
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${otherUserPostId}/tags/${otherUserTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.tags.map(String)).toContain(otherUserTagId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to delete the tag from this post',
      });
    });

    it('should return 404 not found if user attempts to delete the tag from the post where tag is not attached to the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const createdTag = await createTag(userId, blogId, {
        name: 'new tag',
        blogId,
      });
      const createdTagId = createdTag.tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}/tags/${createdTagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post does not contains this tag',
      });
    });

    it('should return 403 forbidden is user attempts to add tag to the post where postId and tagId belongs to different blogs', async () => {
      const newBlogData = {
        name: 'other blog',
        slug: 'other-blog',
      };
      const newBlog = await createBlog(userId, newBlogData);
      const newBlogId = newBlog.blogId.toString();
      const userPostOnOldBlog = await createPost(userId, blogId);
      const userPostOnOldBlogId = userPostOnOldBlog.postId.toString();
      const tagOnNewBlogData = {
        name: 'new blog tag',
        blogId: newBlogId,
      };
      const tagOnNewBlog = await createTag(userId, newBlogId, tagOnNewBlogData);
      const tagOnNewBlogId = tagOnNewBlog.tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${userPostOnOldBlogId}/tags/${tagOnNewBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const oldBlogEditedPost = await getPostById(userPostOnOldBlogId);

      expect(oldBlogEditedPost).toBeDefined();
      expect(oldBlogEditedPost?.tags).not.contain(new ObjectId(tagOnNewBlogId));
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'The post and tag must belong to the same blog',
      });
    });

    it('should return 200 ok for successfully adding tag to the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const tagId = (
        await createTag(userId, blogId, { name: 'new tag', blogId })
      ).tagId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/tags/${tagId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId);
      const editedTag = await getTagById(tagId);

      expect(editedPost?.tags.map(String)).toContain(tagId);
      expect(editedTag?.posts.map(String)).toContain(createdPostId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Tag added to post successfully',
      });
    });
  });
});
