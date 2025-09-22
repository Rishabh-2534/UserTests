import { test, expect } from "@playwright/test";
import { baseUrl, headers } from "./config.js";

test.describe("Upload File API", () => {
    let userId;

    test.beforeAll(async ({ request }) => {
      // Create a fresh user to get UUID
      const id = "ff66fadb-a1b8-4b33-8c59-6f96b138a9d7";
      const response = await request.get(`${baseUrl}/users/${id}`, {
        headers: headers,
      });
      const body = await response.json();
      userId = body.id;
      /*
      const timestamp = Date.now();
      const createUserResp = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `Rishabh_${timestamp}@simpplr.com`,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });

      expect(createUserResp.status()).toBe(201);
      const body = await createUserResp.json();
      userId = body.id; // UUID for upload tests*/
     });
    // to be removed

    test("should upload a valid photo successfully", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "photo",
          userId,
          mimeType: "image/png",
          size: 2097152,
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("result");
    });

    test("should fail if useFor is invalid", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "invalidValue",
          userId,
          mimeType: "image/png",
          size: 500000,
        },
      });

      expect(response.status()).toBe(400);
    });

    test("should fail if mimeType is unsupported", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "photo",
          userId,
          mimeType: "application/pdf",
          size: 500000,
        },
      });

      expect(response.status()).toBe(400);
    });

    test("should fail if photo exceeds 2MB", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "photo",
          userId,
          mimeType: "image/jpeg",
          size: 3000000, // 3 MB
        },
      });

      expect(response.status()).toBe(400);
    });

    test("should allow coverImage up to 4MB", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "coverImage",
          userId,
          mimeType: "image/jpeg",
          size: 4000000, // 4 MB exact
        },
      });

      expect(response.status()).toBe(201);
    });

    test("should fail if coverImage exceeds 4MB", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users/files`, {
        headers: headers,
        data: {
          useFor: "coverImage",
          userId,
          mimeType: "image/jpeg",
          size: 5000000, // 5 MB
        },
      });

      expect(response.status()).toBe(400);
    });
  });