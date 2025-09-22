import { test, expect } from "@playwright/test";
import { baseUrl, headers, variable } from "./config.js";

test.describe("Create User", () => {
    test("email as identifier field", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `${variable}_01@Simpplr.com`,
          firstName: "Rishabh1",
          lastName: "Mishra1",
        },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("id");
    });
    test("username as identifier field", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          username: `${variable}02`,
          firstName: "Rishabh2",
          lastName: "Mishra2",
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("id");
    });

    test("fail when identifier field missing", async ({ request }) => {
      const response = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          firstName: "Rishabh3",
          lastName: "Mishra3",
        },
      });
      expect(response.status()).toBe(400);
    });

    test("should not allow duplicate identifiers", async ({ request }) => {
      const timestamp = Date.now();

      const email = `dup_${timestamp}@test.com`;
      const username = `dup_${timestamp}`;
      const mobile = `98765${timestamp.toString().slice(-5)}`; // make unique number

      // Step 1: Create initial user
      await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email,
          username,
          phone: mobile,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });

      // Step 2: Try to create user with duplicate email
      const emailResponse = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email,
          username: `unique_${timestamp}`,
          phone: `98765${(timestamp + 1).toString().slice(-5)}`,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });
      expect(emailResponse.status()).toBe(400);

      // Step 3: Try to create user with duplicate username
      const usernameResponse = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `unique_${timestamp}@test.com`,
          username,
          phone: `98765${(timestamp + 2).toString().slice(-5)}`,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });
      expect(usernameResponse.status()).toBe(400);

      // Step 4: Try to create user with duplicate mobile
      const mobileResponse = await request.post(`${baseUrl}/users`, {
        headers: headers,
        data: {
          email: `unique2_${timestamp}@test.com`,
          username: `unique2_${timestamp}`,
          phone: mobile,
          firstName: "Rishabh",
          lastName: "Mishra",
        },
      });
      expect(mobileResponse.status()).toBe(400);
    });

    test.describe("Field validation - Create User", () => {
      const generateValidUser = () => {
        const timestamp = Date.now();
        return {
          username: `jhon_mith_${timestamp}`,
          firstName: "uno",
          lastName: "smith",
          pronouns: "he/him",
          pronunciationUrl: `https://example.com/pronunciation/${timestamp}`,
          extn: "+00",
          about: "I am a software engineer",
          employeeNumber: `EMP_${timestamp}`,
          coverImage: `https://example.com/cover-image/${timestamp}`,
          birthDate: "12-18",
          birthDayDay: "30",
          birthDayMonth: "10",
          timezone: "Asia/Kolkata",
          isEmailDisplayable: true,
          isMobileDisplayable: true,
          isPhoneDisplayable: true,
          zoom: `https://zoom.us/j/${1000000000 + timestamp}`,
          skype: `https://skype.com/jhon.smith${timestamp}`,
          linkedInUrl: `https://linkedin.com/in/jhon.smith${timestamp}`,
          twitterUrl: `https://twitter.com/jhon.smith${timestamp}`,
          facebookUrl: `https://facebook.com/jhon.smith${timestamp}`,
          youtubeUrl: `https://youtube.com/jhon.smith${timestamp}`,
          instagramUrl: `https://instagram.com/jhon.smith${timestamp}`,
          payCurrency: "USD",
          licenseType: "Corporate",
          addressLine1: "123 Main St",
          addressLine2: "Apt 1",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
          title: "Software Engineer",
          department: "Engineering",
          userType: "Employee",
          startDate: "2024-12-18",
          email: `user_${timestamp}@example.com`,
          managerEmail: `manager_${timestamp}@example.com`,
        };
      };

      const cases = [
        {
          field: "email",
          value: undefined,
          expectedStatus: 400,
          case: "email missing",
        },
        {
          field: "firstName",
          value: undefined,
          expectedStatus: 400,
          case: "firstName missing",
        },
        {
          field: "lastName",
          value: undefined,
          expectedStatus: 400,
          case: "lastName missing",
        },
        {
          field: "email",
          value: "invalidEmail",
          expectedStatus: 400,
          case: "bad email format",
        },
        {
          field: "username",
          value: "bad user",
          expectedStatus: 400,
          case: "username with spaces",
        },
        {
          field: "username",
          value: "",
          expectedStatus: 400,
          case: "blank username",
        },
        {
          field: "username",
          value: " ",
          expectedStatus: 400,
          case: "username as space",
        },
        {
          field: "username",
          value: undefined,
          expectedStatus: 200,
          case: "no username (email as identifier)",
        },
        {
          field: "phone",
          value: "abc123",
          expectedStatus: 400,
          case: "phone not numeric",
        },
        {
          field: "phone",
          value: "123",
          expectedStatus: 400,
          case: "phone too short",
        },
        {
          field: "phone",
          value: undefined,
          expectedStatus: 200,
          case: "phone optional",
        },
        {
          field: "employeeNumber",
          value: "",
          expectedStatus: 400,
          case: "blank employeeNumber not allowed",
        },
        {
          field: "managerEmail",
          value: "notAnEmail",
          expectedStatus: 400,
          case: "invalid managerEmail",
        },
        {
          field: "managerEmail",
          value: "",
          expectedStatus: 200,
          case: "managerEmail optional",
        },
        {
          field: "startDate",
          value: "invalid-date",
          expectedStatus: 400,
          case: "bad startDate format",
        },
        {
          field: "startDate",
          value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          expectedStatus: 400,
          case: "future startDate invalid",
        },
        {
          field: "startDate",
          value: "",
          expectedStatus: 200,
          case: "startDate optional",
        },
      ];

      // Field validation tests
      for (const { field, value, expectedStatus, case: desc } of cases) {
        test(`should return ${expectedStatus} when ${desc}`, async ({
          request,
        }) => {
          const user = generateValidUser();
          if (value === undefined) delete user[field];
          else user[field] = value;
          if (field !== "email") user.email = `case_${Date.now()}@example.com`;

          const response = await request.post(`${baseUrl}/users`, {
            headers: headers,
            data: user,
          });
          expect(response.status()).toBe(expectedStatus);
        });
      }

      // URL validation tests
      const urlFields = [
        "pronunciationUrl",
        "coverImage",
        "zoom",
        "skype",
        "linkedInUrl",
        "twitterUrl",
        "facebookUrl",
        "youtubeUrl",
        "instagramUrl",
      ];

      for (const field of urlFields) {
        test(`should fail when ${field} is not a valid URL`, async ({
          request,
        }) => {
          const user = generateValidUser();
          user[field] = "invalid-url";
          const response = await request.post(`${baseUrl}/users`, {
            headers: headers,
            data: user,
          });
          expect(response.status()).toBe(400);
        });
      }
    }); // end Field validation
  });