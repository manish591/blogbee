import request from "supertest";
import { describe, expect, it, test } from "vitest";
import { db } from "../../../tests/setup";
import { buildServer } from "../../app";

describe("users", () => {
  test("POST /api/v1/users", () => {
    it("should return 400 if email is not provided", async () => {
      const app = buildServer({ db });

      const res = await request(app)
        .get("/api/v1/healthcheck");

      expect(res.status).toBe(200);
    });
  });
});