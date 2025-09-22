import { test, expect } from "@playwright/test";
import { baseUrl, headers, variable } from "./config.js";

test.describe("GET all users", () => {
    test("should fetch users with default params", async ({ request }) => {
      const response = await request.get(`${baseUrl}/users`, {
        headers: headers,
      });
      expect(response.ok()).toBeTruthy();

      const body = await response.json();
      expect(body).toHaveProperty("items"); // assuming API returns { items: [...] }
    });

    test("should respect pageSize parameter", async ({ request }) => {
      const response = await request.get(`${baseUrl}/users?pageSize=5`, {
        headers: headers,
      });
      const body = await response.json();

      expect(body.items.length).toBeLessThanOrEqual(5);
    });

    test("should support pagination with pageToken", async ({ request }) => {
      // First page
      const firstResponse = await request.get(`${baseUrl}/users?pageSize=2`, {
        headers: headers,
      });
      const firstBody = await firstResponse.json();

      expect(firstBody).toHaveProperty("nextPageToken");

      // Next page
      const nextResponse = await request.get(
        `${baseUrl}/users?pageSize=2&pageToken=${firstBody.nextPageToken}`,
        {
          headers: headers,
        },
      );
      const nextBody = await nextResponse.json();

      expect(nextBody).toHaveProperty("items");
      expect(nextBody.items.length).toBeLessThanOrEqual(2);
    });

    test("should filter by modifiedAfter", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/users?modifiedAfter=2025-02-01T18:30:00.000Z`,
        {
          headers: headers,
        },
      );
      expect(response.ok()).toBeTruthy();
      const body = await response.json();

      expect(response.status()).toBe(200);
    });

    test("should sort results by firstName DESC", async ({ request }) => {
      const response = await request.get(
        `${baseUrl}/users?sortBy=firstName%3ADESC`,
        {
          headers: headers,
        },
      );
      const body = await response.json();

      const names = body.items.map((u) => (u.firstName || "").toLowerCase());
      const sorted = [...names].sort((a, b) => b.localeCompare(a));

      expect(names).toEqual(sorted);
    });

    test("should include total count when includeTotal=true", async ({
      request,
    }) => {
      const response = await request.get(`${baseUrl}/users?includeTotal=true`, {
        headers: headers,
      });
      const body = await response.json();

      expect(body).toHaveProperty("total");
      expect(typeof body.total).toBe("number");
    });
  });