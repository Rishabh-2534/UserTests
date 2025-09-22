import { test, expect } from "@playwright/test";
import { baseUrl, headers } from "./config.js";

test.describe("PUT Update User API", () => {
    let userId;
    let baseUser;

    const fullPayload = (overrides = {}) => {
      const timestamp = Date.now();
      return {
        status: "Inactive",
        isEmailDisplayable: true,
        isMobileDisplayable: true,
        isPhoneDisplayable: true,
        payCurrency: "AED",
        managerId: "88e77945-b3d6-44f7-928f-1a5b117818ef",
        assistantId: "784b2f0b-86d2-4e33-a313-e191c018c290",
        locale: "en_US",
        timezone: "Asia/Kolkata",
        peopleCategory: "Employee",
        birthDate: "2003-02-01",
        username: "joe222",
        firstName: "joe",
        lastName: "smith",
        pronouns: "he/him",
        pronunciationUrl: "/pronunciation/55526ef2-752a-47e3-affa-2fa0eaadc5eb",
        email: "joe.h@example.com",
        mobile: "23456789o",
        phone: "23456789q",
        extn: "+91",
        about: "I am a software engineer",
        photo: "/photo/55526ef2-752a-47e3-affa-2fa0eaadc5eb",
        employeeNumber: "123456",
        coverImage: "/cover-image/55526ef2-752a-47e3-affa-2fa0eaadc5eb",
        zoom: "https://zoom.us/j/1234567890",
        skype: "https://skype.com/jhon.smith",
        linkedInUrl: "https://linkedin.com/in/jhon.smith",
        twitterUrl: "https://twitter.com/jhon.smith",
        facebookUrl: "https://facebook.com/jhon.smith",
        youtubeUrl: "https://youtube.com/jhon.smith",
        instagramUrl: "https://instagram.com/jhon.smith",
        licenseType: "Corporate",
        addressLine1: "123 Main St",
        addressLine2: "Apt 1",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        title: "Software Engineer",
        department: "Engineering",
        division: "Engineering",
        businessUnit: "Engineering",
        companyName: "Example Inc.",
        startDate: "2024-12-18",
        userType: "Employee",
        ...overrides,
      };
    };

    test.beforeAll(async ({ request: request }) => {
      // Create a user
      const id = "ff66fadb-a1b8-4b33-8c59-6f96b138a9d7";
      const response = await request.get(`${baseUrl}/users/${id}`, {
        headers: headers,
      });
      baseUser = await response.json();
      userId = baseUser.id;
      /*const resp = await requestObj.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `put_base_${Date.now()}@example.com`,
          username: `put_base_user_${Date.now()}`,
          firstName: "Base",
          lastName: "User",
          phone: `77777${Date.now().toString().slice(-5)}`,
        },
      });
      expect(resp.status()).toBe(201);
      baseUser = await resp.json();
      userId = baseUser.id;*/
    });

    test("should update user with valid full payload (birthDate variant)", async ({
      request,
    }) => {
      const payload = fullPayload({ birthDate: "2000-01-01" });

      const response = await request.put(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: payload,
      });
      expect(response.status()).toBe(200);
    });

    test("should update user with valid full payload (birthDayDay + birthDayMonth  variant)", async ({
      request,
    }) => {
      const payload = fullPayload({
        birthDayDay: "15",
        birthDayMonth: "06",
      });
      delete payload.birthDate;

      const response = await request.put(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: payload,
      });
      expect(response.status()).toBe(200);
    });

    test("should reject request with missing required field", async ({
      request,
    }) => {
      const payload = fullPayload();
      delete payload.email; // required field

      const response = await request.put(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: payload,
      });
      expect(response.status()).toBe(400);
    });

    test("should reject request with invalid email format", async ({
      request,
    }) => {
      const payload = fullPayload({ email: "invalidEmail" });

      const response = await request.put(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: payload,
      });
      expect(response.status()).toBe(400);
    });

    test("should not allow duplicate username", async ({ request }) => {
      // Create another user
      const otherResp = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `dup_put_${Date.now()}@example.com`,
          username: `dup_put_user_${Date.now()}`,
          firstName: "Another",
          lastName: "User",
          phone: `66666${Date.now().toString().slice(-5)}`,
        },
      });
      const otherUser = await otherResp.json();

      const payload = fullPayload({ username: otherUser.username });

      const response = await request.put(`${baseUrl}/users/${userId}`, {
        headers: headers,
        data: payload,
      });
      expect(response.status()).toBe(400);
    });
  });
