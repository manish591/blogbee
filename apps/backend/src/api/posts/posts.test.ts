import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildServer } from '../../app';
import { PostStatus } from '../../db/schema';
import { createBlog } from '../blogs/blogs.services';
import { createUser } from '../users/users.services';
import {
  addCategoryToPost,
  createPost,
  deletePost,
  editPost,
  getPostById,
  getPosts,
} from './posts.services';
import { createCategory, getCategoryById } from '../categories/categories.services';

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
      const allBlogPosts = await getPosts(blogId);

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
      const allBlogPosts = await getPosts(blogId);

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
      const allBlogPosts = await getPosts(blogId);

      expect(allBlogPosts.items.length).toBe(0);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Blog not found',
      });
    });

    it('should return 403 forbidden if user attempts to create post in the blog they do not own', async () => {
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
      const allOtherUserBlogPosts = await getPosts(blogId);

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
      const allBlogPosts = await getPosts(blogId);

      expect(allBlogPosts.items.length).toBe(1);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        message: 'Post created successfully',
        data: {
          id: allBlogPosts.items[0]._id.toString(),
        },
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
        .get(`/v1/posts?blogId=${blogId}&query=updated`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
    })

    it("should return 200 ok along with post sorted by latest", async () => {
      await createPost(userId, blogId);
      const latestPost = await createPost(userId, blogId);
      const latestPostId = latestPost.postId.toString();

      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&sort=latest`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.items[0]._id).toBe(latestPostId);
    });

    it("should return 200 ok along with post filtered by category", async () => {
      await createPost(userId, blogId);
      const postWithCategory = await createPost(userId, blogId);
      const postWithCategoryId = postWithCategory.postId.toString();
      const categoryData = {
        name: "javascript",
        blogId
      }
      const createdCategory = await createCategory(userId, blogId, categoryData);
      const createdCategoryId = createdCategory.categoryId.toString();
      await addCategoryToPost(postWithCategoryId, createdCategoryId, categoryData.name);

      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&categories=javascript`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].categories[0].name).toBe(categoryData.name);
    });

    it("should return 200 ok along with post filtered by post status", async () => {
      await createPost(userId, blogId);
      const deletedPost = await createPost(userId, blogId);
      const deletedPostId = deletedPost.postId.toString();
      await deletePost(deletedPostId);

      const app = buildServer();
      const res = await request(app)
        .get(`/v1/posts?blogId=${blogId}&status=archived`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].postStatus).toBe("archived");
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

    it("should return 400 bad request if user attempts to publish a post and post slug is not defined", async () => {
      const unpublishedPostId = (await createPost(userId, blogId)).postId.toString();
      const data = {
        postStatus: PostStatus.PUBLISHED
      }

      const app = buildServer();
      const res = await request(app)
        .patch(`/v1/posts/${unpublishedPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const updatedPostData = await getPostById(unpublishedPostId);

      expect(updatedPostData?.postStatus).toBe(PostStatus.DRAFT);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Slug is required',
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

    it("should return 200 ok for successfully publishing the post", async () => {
      const publishedPostId = (await createPost(userId, blogId)).postId.toString();
      const data = {
        slug: "new-post",
        postStatus: PostStatus.PUBLISHED
      }

      const app = buildServer();
      const res = await request(app)
        .patch(`/v1/posts/${publishedPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const updatedPostData = await getPostById(publishedPostId);

      expect(updatedPostData?.postStatus).toBe(PostStatus.PUBLISHED);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Posts edited successfully',
      });
    });

    it("should return 200 ok for updating post with multiple categories and should update the categories with postid", async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const firstCategoryData = {
        name: "firstcategory",
        blogId
      }
      const firstCategory = await createCategory(userId, blogId, firstCategoryData);
      const firstCategoryId = firstCategory.categoryId.toString();
      const secondCategoryData = {
        name: "secondcategory",
        blogId,
      }
      const secondCategory = await createCategory(userId, blogId, secondCategoryData);
      const secondcategoryId = secondCategory.categoryId.toString();
      const data = {
        categories: `${firstCategoryData.name},${secondCategoryData.name}`
      }

      const app = buildServer();
      const res = await request(app)
        .patch(`/v1/posts/${createdPostId}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookie])
        .send(data);
      const updatedPostData = await getPostById(createdPostId);
      const updatedCategoryOne = await getCategoryById(firstCategoryId);
      const updatedCategoryTwo = await getCategoryById(secondcategoryId);

      console.log("the post data", updatedPostData);

      expect(updatedPostData?.categories.length).toBe(2);
      expect(updatedPostData?.categories.map(c => c.name)).toContain(firstCategoryData.name);
      expect(updatedPostData?.categories.map(c => c.name)).toContain(secondCategoryData.name);
      expect(updatedCategoryOne?.posts[0].id.toString()).toBe(createdPostId);
      expect(updatedCategoryTwo?.posts[0].id.toString()).toBe(createdPostId);
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

  describe('POST /v1/posts/:postId/categories/:categoryId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to add category to the post they do not own', async () => {
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
      const otherUserCategory = await createCategory(otherUserId, otherUserBlogId, {
        name: 'other user category',
        blogId: otherUserBlogId,
      });
      const otherUserCategoryId = otherUserCategory.categoryId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${otherUserPostId}/categories/${otherUserCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.categories.map((c) => c.id.toString())).not.toContain(otherUserCategoryId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to add category to this post',
      });
    });

    it('should return 409 conflict if user attempts to add category to the post where category is already attached to post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const categoryData = { name: 'new category', blogId };
      const createdCategory = await createCategory(userId, blogId, categoryData);
      const createdCategoryId = createdCategory.categoryId.toString();
      await addCategoryToPost(createdPostId, createdCategoryId, categoryData.name);
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/categories/${createdCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        message: 'Post already contains this category',
      });
    });

    it('should return 403 forbidden is user attempts to add category to the post where postId and categoryId belongs to different blogs', async () => {
      const newBlogData = {
        name: 'other blog',
        slug: 'other-blog',
      };
      const newBlog = await createBlog(userId, newBlogData);
      const newBlogId = newBlog.blogId.toString();
      const userPostOnOldBlog = await createPost(userId, blogId);
      const userPostOnOldBlogId = userPostOnOldBlog.postId.toString();
      const categoryOnNewBlogData = {
        name: 'new blog category',
        blogId: newBlogId,
      };
      const categoryOnNewBlog = await createCategory(userId, newBlogId, categoryOnNewBlogData);
      const categoryOnNewBlogId = categoryOnNewBlog.categoryId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${userPostOnOldBlogId}/categories/${categoryOnNewBlogId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const oldBlogEditedPost = await getPostById(userPostOnOldBlogId);

      expect(oldBlogEditedPost).toBeDefined();
      expect(oldBlogEditedPost?.categories.map(c => c.id.toString())).not.contain(categoryOnNewBlogId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'The post and category must belong to the same blog',
      });
    });

    it('should return 200 ok for successfully adding category to the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const categoryId = (
        await createCategory(userId, blogId, { name: 'new category', blogId })
      ).categoryId.toString();
      const app = buildServer();
      const res = await request(app)
        .post(`/v1/posts/${createdPostId}/categories/${categoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId);
      const editedCategory = await getCategoryById(categoryId);

      expect(editedPost?.categories[0].id.toString()).toBe(categoryId);
      expect(editedCategory?.posts[0].id.toString()).toBe(createdPostId);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'category added to post successfully',
      });
    });
  });

  describe('DELETE /v1/posts/:postId/categories/:categoryId', () => {
    const blogData = {
      name: 'update blog title',
      slug: 'update-blog-title',
      about: 'This is a content.',
    };

    let blogId: string;

    beforeEach(async () => {
      blogId = (await createBlog(userId, blogData)).blogId.toString();
    });

    it('should return 403 forbidden if user attempts to delete the category from the post they do not own', async () => {
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
      const otherUserCategoryId = await createCategory(otherUserId, otherUserBlogId, {
        name: 'other user category',
        blogId: otherUserBlogId,
      }).then((category) => category.categoryId.toString());
      addCategoryToPost(otherUserPostId, otherUserCategoryId, 'other user category');

      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${otherUserPostId}/categories/${otherUserCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const updatedPostData = await getPostById(otherUserPostId);

      expect(updatedPostData).toBeDefined();
      expect(updatedPostData?.categories[0].id.toString()).toBe(otherUserCategoryId);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: 'You do not have permissions to delete the category from this post',
      });
    });

    it('should return 404 not found if user attempts to delete the category from the post where category is not attached to the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const createdCategory = await createCategory(userId, blogId, {
        name: 'new category',
        blogId,
      });
      const createdCategoryId = createdCategory.categoryId.toString();

      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}/categories/${createdCategoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({
        message: 'Post does not contains this category',
      });
    });

    it('should return 200 ok for successfully deleting category from the post', async () => {
      const createdPost = await createPost(userId, blogId);
      const createdPostId = createdPost.postId.toString();
      const categoryId = (
        await createCategory(userId, blogId, { name: 'new category', blogId })
      ).categoryId.toString();
      await addCategoryToPost(createdPostId, categoryId, 'new category');

      const app = buildServer();
      const res = await request(app)
        .delete(`/v1/posts/${createdPostId}/categories/${categoryId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [cookie]);
      const editedPost = await getPostById(createdPostId);
      const editedCategory = await getCategoryById(categoryId);

      expect(editedPost?.categories.length).toBe(0);
      expect(editedCategory?.posts.length).toBe(0);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'Category removed from the post successfully',
      });
    });
  });
});
