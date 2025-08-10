import { describe } from "vitest";

describe.skip("POSTS", () => {
  // describe('POST /blogs/:blogId/posts', () => {
  //   const blogData = {
  //     name: 'update blog title',
  //     slug: 'update-blog-title',
  //     about: 'This is a content.',
  //   };

  //   let blogId: string;

  //   beforeEach(async () => {
  //     blogId = (await createBlog(userId, blogData, db)).blogId.toString();
  //   });

  //   it('should return 200 ok for creating a new posts', async () => {
  //     const app = buildServer({ db });
  //     const res = await request(app)
  //       .post(`/api/v1/blogs/${blogId}/posts`)
  //       .set('Accept', 'application/json')
  //       .set('Cookie', [cookie]);

  //     expect(res.status).toBe(201);
  //     expect(res.body).toMatchObject({
  //       code: 201,
  //       status: 'success',
  //       message: 'Post created successfully',
  //     });
  //   });
  // });
});