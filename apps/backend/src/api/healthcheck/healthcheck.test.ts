import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { buildServer } from '../../app';

describe('healthcheck', () => {
  describe('GET /v1/healthcheck', () => {
    it('should return 200 success response', async () => {
      const app = buildServer();
      const res = await request(app).get('/v1/healthcheck');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Ok');
    });
  });
});
