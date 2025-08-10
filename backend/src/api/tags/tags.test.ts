import { describe } from "vitest";

describe.skip("TAGS", () => {
  // describe('POST /blogs/:blogId/tags', () => {
  //   const blogData = {
  //     name: 'update blog title',
  //     slug: 'update-blog-title',
  //     about: 'This is a content.',
  //   };

  //   let blogId: string;

  //   beforeEach(async () => {
  //     blogId = (await createBlog(userId, blogData, db)).blogId.toString();
  //   });

  //   it('should return 400 bad request if invalid request body is provided', async () => {
  //     const app = buildServer({ db });
  //     const data = {};
  //     const res = await request(app)
  //       .post(`/api/v1/blogs/${blogId}/tags`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie])
  //       .send(data);

  //     expect(res.status).toBe(400);
  //     expect(res.body).toMatchObject({
  //       code: 400,
  //       status: 'error',
  //       message: 'Bad request',
  //     });
  //   });

  //   it('should return 200 ok for successfully creating a new tag', async () => {
  //     const app = buildServer({ db });
  //     const data = {
  //       name: 'Javascript',
  //       description: 'Contains all the blogs of the javascript category.',
  //     };
  //     const res = await request(app)
  //       .post(`/api/v1/blogs/${blogId}/tags`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie])
  //       .send(data);
  //     const createdTagData = await getAllTags(userId, blogId, db);

  //     expect(res.status).toBe(201);
  //     expect(res.body).toMatchObject({
  //       code: 201,
  //       status: 'success',
  //       message: 'Tags created successfully',
  //     });
  //     expect(createdTagData).toBeDefined();
  //     expect(createdTagData.length).toBe(1);
  //     expect(createdTagData[0].name).toBe('Javascript');
  //   });
  // });

  // describe('GET /blogs/:blogId/tags', () => {
  //   const blogData = {
  //     name: 'update blog title',
  //     slug: 'update-blog-title',
  //     about: 'This is a content.',
  //   };

  //   let blogId: string;

  //   beforeEach(async () => {
  //     blogId = (await createBlog(userId, blogData, db)).blogId.toString();
  //     await createTag(userId, blogId, { blogId: '', name: 'Typescript' }, db);
  //     await createTag(userId, blogId, { blogId: '', name: 'Python' }, db);
  //   });

  //   it('should return 200 ok along with all the tags related to the blogId', async () => {
  //     const app = buildServer({ db });
  //     const res = await request(app)
  //       .get(`/api/v1/blogs/${blogId}/tags`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie]);

  //     expect(res.status).toBe(200);
  //     expect(res.body.data.length).toBe(2);
  //   });
  // });

  // describe('PATCH /blogs/:blogId/tags/:tagId', () => {
  //   const blogData = {
  //     name: 'update blog title',
  //     slug: 'update-blog-title',
  //     about: 'This is a content.',
  //   };

  //   const tagData = {
  //     name: 'javascript',
  //     description: 'Contains all the blogs related to the javascript',
  //   };

  //   let blogId: string;
  //   let tagId: string;

  //   beforeEach(async () => {
  //     blogId = (await createBlog(userId, blogData, db)).blogId.toString();
  //     tagId = '';
  //   });

  //   it('should return 400 bad request if invalid request body is provided', async () => {
  //     const app = buildServer({ db });
  //     const data = {
  //       invalidData: 'invalid',
  //     };
  //     const res = await request(app)
  //       .patch(`/api/v1/blogs/${blogId}/tags/${tagId}`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie])
  //       .send(data);

  //     expect(res.status).toBe(400);
  //     expect(res.body).toMatchObject({
  //       code: 400,
  //       status: 'error',
  //       message: 'Bad request',
  //     });
  //   });

  //   it('should return 200 ok for successfully editing the tag', async () => {
  //     const app = buildServer({ db });
  //     const data = {
  //       name: 'typescript',
  //     };
  //     const res = await request(app)
  //       .patch(`/api/v1/blogs/${blogId}/tags/${tagId}`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie])
  //       .send(data);
  //     const editTagData = '';

  //     expect(res.status).toBe(200);
  //     expect(res.body).toMatchObject({
  //       code: 200,
  //       status: 'success',
  //       message: 'Edited tag successfully',
  //     });
  //     expect(editTagData).toBeDefined();
  //     expect(editTagData).toBe('typescript');
  //   });
  // });

  // describe('DELETE /blogs/:blogId/tags/:tagId', () => {
  //   const blogData = {
  //     name: 'update blog title',
  //     slug: 'update-blog-title',
  //     about: 'This is a content.',
  //   };

  //   const tagData = {
  //     name: 'javascript',
  //     description: 'Contains all the blogs related to the javascript',
  //   };

  //   let blogId: string;
  //   let tagId: string;

  //   beforeEach(async () => {
  //     blogId = (await createBlog(userId, blogData, db)).blogId.toString();
  //     tagId = '';
  //   });

  //   it('should return 200 ok for successfully deleting the tag data', async () => {
  //     const app = buildServer({ db });
  //     const res = await request(app)
  //       .delete(`/api/v1/blogs/${blogId}/tags/${tagId}`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie]);
  //     const deletedTagData = '';

  //     expect(res.status).toBe(200);
  //     expect(res.body).toMatchObject({
  //       code: 200,
  //       status: 'success',
  //       message: 'Deleted tag successfully',
  //     });
  //     expect(deletedTagData).toBe(null);
  //   });
  // });
});