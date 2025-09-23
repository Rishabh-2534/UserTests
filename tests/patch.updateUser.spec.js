
import { test, expect } from "@playwright/test";
import { baseUrl, headers} from "./config.js";


test.describe("patch Update User API", () => {
    let userId;
    let existingUser;
    let dupUser;
    test.beforeAll(async ({ request: request }) => {
      // Create a base user
      const id = "ff66fadb-a1b8-4b33-8c59-6f96b138a9d7";
      const response = await request.get(`${baseUrl}/users/${id}`, {
        headers: headers,
      });
      existingUser = await response.json();
      userId = existingUser.id;

      const dupId = "8067fa27-99a7-426b-9b48-aad7c4a8d37b";
      const dupresponse = await request.get(`${baseUrl}/users/${dupId}`, {
        headers: headers,
      });
      dupUser = await dupresponse.json();

      /*const timestamp = Date.now();
      const resp = await requestObj.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `update_${timestamp}@example.com`,
          username: `update_user_${timestamp}`,
          phone: `99999${timestamp.toString().slice(-5)}`,
          firstName: "Base",
          lastName: "User",
        },
      });
      
      expect(resp.status()).toBe(201);
      existingUser = await resp.json();
      userId = existingUser.id;*/
     });

    test("should successfully update user firstName and lastName", async ({
      request,
    }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { firstName: "Updated", lastName: "User" },
      });
      expect(response.status()).toBe(204);

      // follow-up GET
      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.firstName).toBe("Updated");
      expect(body.lastName).toBe("User");
    });

    test("should not allow duplicate email", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { email: dupUser.email },
      });
      expect(response.status()).toBe(400);
      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.email).toBe(existingUser.email);
    });

    test("should not allow duplicate username", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { username: dupUser.username },
      });
      expect(response.status()).toBe(400);

      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.username).toBe(existingUser.username);
    });

    test("should not allow duplicate mobile", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { phone: dupUser.phone },
      });
      expect(response.status()).toBe(400);

      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.phone).toBe(existingUser.phone);
    });

    test("should reject invalid email format", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { email: "badEmailFormat" },
      });
      expect(response.status()).toBe(400);

      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.email).toBe(existingUser.email);
    });

    test("should reject invalid phone number", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { phone: "abc123" },
      });
      expect(response.status()).toBe(400);

      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.phone).toBe(existingUser.phone);
    });

    test("should update status field correctly", async ({ request }) => {
      const response = await request.patch(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: { status: "Inactive" },
      });
      expect(response.status()).toBe(200);

      const getResp = await request.get(`${baseUrl}/users/${userId}`, {
        headers: headers,
      });
      const body = await getResp.json();
      expect(body.status).toBe("Inactive");
    });
  });