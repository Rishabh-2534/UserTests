import { test, expect } from "@playwright/test";
import { baseUrl, headers, variable } from "./config.js";

test.describe("Get User by ID ", () => {
    test("should return a user by ID", async ({ request }) => {
      const createResp = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `Rishabh_${Date.now()}@simpplr.com`,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });
      const id = "ff66fadb-a1b8-4b33-8c59-6f96b138a9d7";
      const response = await request.get(`${baseUrl}/users/${id}`, {
        headers: headers,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("id", id);
    });

    test("should return 404 for non-existent user", async ({ request }) => {
      const id = "ff66fadb-a1b8-4b33-8c59-6f96b138a9d7";

      const response = await request.get(`${baseUrl}/users/${id}000`, {
        headers: headers,
      });
      expect(response.status()).toBe(400);
    });
  });
