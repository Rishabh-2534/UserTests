/*import { test, expect, request } from '@playwright/test';

test.describe('B2B Users API', () => {
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: 'https://platform.dev.simpplr.xyz/v1/b2b/identity',
      extraHTTPHeaders: {
        // you’ll need to fetch a token first dynamically
        Authorization: `Bearer <ACCESS_TOKEN>`,
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // --- Create User ---
  test.describe('Create User', () => {
   test('email as identifier field', async () => {
      const response = await apiContext.post('/users', {
        data: {
          email: `Rishabh_001@Simpplr.com`,
          firstName: 'Rishabh1',
          lastName: 'Mishra1',
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('id');
   });
   test('username as identifier field', async () => {
      const response = await apiContext.post('/users', {
        data: {
          username: 'Rishabh2',
          firstName: 'Rishabh2',
          lastName: 'Mishra2',
        },
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('id');
   });

   test('fail when identifier field missing', async () => {
      const response = await apiContext.post('/users', {
        data: {
          firstName: 'Rishabh3',
          lastName: 'Mishra3',
        },
      });
      expect(response.status()).toBe(400);
   });

   test('should not allow duplicate identifiers', async () => {
    const timestamp = Date.now();
  
    const email = `dup_${timestamp}@test.com`;
    const username = `dup_${timestamp}`;
    const mobile = `98765${timestamp.toString().slice(-5)}`; // make unique number
  
    // Step 1: Create initial user
    await apiContext.post('/users', {
      data: {
        email,
        username,
        phone: mobile,
        firstName: 'Rishabh',
        lastName: 'Mishra',
      },
    });
  
    // Step 2: Try to create user with duplicate email
    const emailResponse = await apiContext.post('/users', {
      data: {
        email,
        username: `unique_${timestamp}`,
        phone: `98765${(timestamp + 1).toString().slice(-5)}`,
        firstName: 'Rishabh',
        lastName: 'Mishra',
      },
    });
    expect(emailResponse.status()).toBe(400);
  
    // Step 3: Try to create user with duplicate username
    const usernameResponse = await apiContext.post('/users', {
      data: {
        email: `unique_${timestamp}@test.com`,
        username,
        phone: `98765${(timestamp + 2).toString().slice(-5)}`,
        firstName: 'Rishabh',
        lastName: 'Mishra',
      },
    });
    expect(usernameResponse.status()).toBe(400);
  
    // Step 4: Try to create user with duplicate mobile
    const mobileResponse = await apiContext.post('/users', {
      data: {
        email: `unique2_${timestamp}@test.com`,
        username: `unique2_${timestamp}`,
        phone: mobile,
        firstName: 'Rishabh',
        lastName: 'Mishra',
      },
    });
    expect(mobileResponse.status()).toBe(400);
   });

   test.describe('Field validation - Create User', () => {
    
        const generateValidUser = () => {
          const timestamp = Date.now();
          return {
            username: `jhon_mith_${timestamp}`,
            firstName: 'uno',
            lastName: 'smith',
            pronouns: 'he/him',
            pronunciationUrl: `https://example.com/pronunciation/${timestamp}`,
            extn: '+00',
            about: 'I am a software engineer',
            employeeNumber: `EMP_${timestamp}`,
            coverImage: `https://example.com/cover-image/${timestamp}`,
            birthDate: '12-18',
            birthDayDay: '30',
            birthDayMonth: '10',
            timezone: 'Asia/Kolkata',
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
            payCurrency: 'USD',
            licenseType: 'Corporate',
            addressLine1: '123 Main St',
            addressLine2: 'Apt 1',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            title: 'Software Engineer',
            department: 'Engineering',
            userType: 'Employee',
            startDate: '2024-12-18',
            email: `user_${timestamp}@example.com`,
            managerEmail: `manager_${timestamp}@example.com`,
          };
        };
    
        const cases = [
          { field: 'email', value: undefined, expectedStatus: 400, case: 'email missing' },
          { field: 'firstName', value: undefined, expectedStatus: 400, case: 'firstName missing' },
          { field: 'lastName', value: undefined, expectedStatus: 400, case: 'lastName missing' },
          { field: 'email', value: 'invalidEmail', expectedStatus: 400, case: 'bad email format' },
          { field: 'username', value: 'bad user', expectedStatus: 400, case: 'username with spaces' },
          { field: 'username', value: '', expectedStatus: 400, case: 'blank username' },
          { field: 'username', value: ' ', expectedStatus: 400, case: 'username as space' },
          { field: 'username', value: undefined, expectedStatus: 200, case: 'no username (email as identifier)' },
          { field: 'phone', value: 'abc123', expectedStatus: 400, case: 'phone not numeric' },
          { field: 'phone', value: '123', expectedStatus: 400, case: 'phone too short' },
          { field: 'phone', value: undefined, expectedStatus: 201, case: 'phone optional' },
          { field: 'employeeNumber', value: '', expectedStatus: 400, case: 'blank employeeNumber not allowed' },
          { field: 'employeeNumber', value: undefined, expectedStatus: 201, case: 'employeeNumber optional' },
          { field: 'managerEmail', value: 'notAnEmail', expectedStatus: 400, case: 'invalid managerEmail' },
          { field: 'managerEmail', value: undefined, expectedStatus: 201, case: 'managerEmail optional' },
          { field: 'startDate', value: 'invalid-date', expectedStatus: 400, case: 'bad startDate format' },
          { field: 'startDate', value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], expectedStatus: 400, case: 'future startDate invalid' },
          { field: 'startDate', value: undefined, expectedStatus: 201, case: 'startDate optional' },
          { field: 'customAttributes', value: { level: '' }, expectedStatus: 201, case: 'customAttributes blank value allowed' },
          { field: 'customAttributes', value: 'stringInsteadOfObject', expectedStatus: 400, case: 'customAttributes must be object' },
          { field: 'customAttributes', value: undefined, expectedStatus: 201, case: 'customAttributes optional' },
        ];
    
        // Field validation tests
        for (const { field, value, expectedStatus, case: desc } of cases) {
          test(`should return ${expectedStatus} when ${desc}`, async () => {
            const user = generateValidUser();
            if (value === undefined) delete user[field];
            else user[field] = value;
            if (field !== 'email') user.email = `case_${Date.now()}@example.com`;
    
            const response = await apiContext.post('/users', { data: user });
            expect(response.status()).toBe(expectedStatus);
          });
        }
    
        // URL validation tests
        const urlFields = [
          'pronunciationUrl',
          'coverImage',
          'zoom',
          'skype',
          'linkedInUrl',
          'twitterUrl',
          'facebookUrl',
          'youtubeUrl',
          'instagramUrl',
        ];
    
        for (const field of urlFields) {
          test(`should fail when ${field} is not a valid URL`, async () => {
            const user = generateValidUser();
            user[field] = 'invalid-url';
            const response = await apiContext.post('/users', { data: user });
            expect(response.status()).toBe(400);
          });
        }
    
   }); // end Field validation
  });

  // --- Get Users ---
  test.describe('GET all users', () => {
  
    test('should fetch users with default params', async () => {
      const response = await apiContext.get('/users');
      expect(response.ok()).toBeTruthy();
  
      const body = await response.json();
      expect(body).toHaveProperty('items'); // assuming API returns { users: [...] }
    });
  
    test('should respect pageSize parameter', async () => {
      const response = await apiContext.get('/users?pageSize=5');
      const body = await response.json();
  
      expect(body.items.length).toBeLessThanOrEqual(5);
    });
  
    test('should support pagination with pageToken', async () => {
      // First page
      const firstResponse = await apiContext.get('/users?pageSize=2');
      const firstBody = await firstResponse.json();
  
      expect(firstBody).toHaveProperty('nextPageToken');
  
      // Next page
      const nextResponse = await apiContext.get(`/users?pageSize=2&pageToken=${firstBody.nextPageToken}`);
      const nextBody = await nextResponse.json();
  
      expect(nextBody).toHaveProperty('users');
      expect(nextBody.items.length).toBeLessThanOrEqual(2);
    });
  
    test('should filter by modifiedAfter', async () => {
      const response = await apiContext.get('/users?modifiedAfter=2025-04-09T18:30:00.000Z');
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
  
      // Every returned user must have modifiedDate > provided date
      for (const user of body.items || []) {
        expect(new Date(user.modifiedDate).getTime()).toBeGreaterThan(new Date('2025-04-09T18:30:00.000Z').getTime());
      }
    });
  
    test('should sort results by firstName DESC', async () => {
      const response = await apiContext.get('/users?sortBy=firstName:DESC');
      const body = await response.json();
  
      const names = body.items.map(u => u.firstName);
      const sorted = [...names].sort().reverse(); // DSC order
      expect(names).toEqual(sorted);
    });
  
    test('should include total count when includeTotal=true', async () => {
      const response = await apiContext.get('/users?includeTotal=true');
      const body = await response.json();
  
      expect(body).toHaveProperty('total');
      expect(typeof body.total).toBe('number');
    });
  });
  
  // --- Get User by ID ---
  test.describe('Get User by ID ', () => {
    test('should return a user by ID', async () => {
      const createResp = await apiContext.post('/users', {
        data: {
          email: `Rishabh_${Date.now()}@simpplr.com`,
          firstName: 'Rishabh',
          lastName: 'Mishra',
        },
      });
      const { id } = await createResp.json();

      const response = await apiContext.get(`/users/${id}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('id', id);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await apiContext.get('/users/999999');
      expect(response.status()).toBe(404);
    });
  });

  // --- Upload File API ---
  test.describe('Upload File API', () => {
    let userId;

    test.beforeAll(async ({ playwright }) => {

      // Create a fresh user to get UUID
      const timestamp = Date.now();
      const createUserResp = await apiContext.post('/users', {
        data: {
          email: `Rishabh_${timestamp}@simpplr.com`,
          firstName: 'Rishabh',
          lastName: 'Mishra',
        },
      });

      expect(createUserResp.status()).toBe(201);
      const body = await createUserResp.json();
      userId = body.id; // UUID for upload tests
    });

    test('should upload a valid photo successfully', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'photo',
          userId,
          mimeType: 'image/png',
          size: 500000, // ~500 KB
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body).toHaveProperty('fileId');
    });

    test('should fail if useFor is invalid', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'invalidValue',
          userId,
          mimeType: 'image/png',
          size: 500000,
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should fail if mimeType is unsupported', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'photo',
          userId,
          mimeType: 'application/pdf',
          size: 500000,
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should fail if photo exceeds 2MB', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'photo',
          userId,
          mimeType: 'image/jpeg',
          size: 3000000, // 3 MB
        },
      });

      expect(response.status()).toBe(400);
    });

    test('should allow coverImage up to 4MB', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'coverImage',
          userId,
          mimeType: 'image/jpeg',
          size: 4000000, // 4 MB exact
        },
      });

      expect(response.ok()).toBeTruthy();
    });

    test('should fail if coverImage exceeds 4MB', async () => {
      const response = await apiContext.post('/upload', {
        data: {
          useFor: 'coverImage',
          userId,
          mimeType: 'image/jpeg',
          size: 5000000, // 5 MB
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  // --- Update User ---
  test.describe('PUT Update User API', () => {
    let userId;
    let baseUser;
  
    const fullPayload = (overrides = {}) => {
      const timestamp = Date.now();
      return {
        username: `put_user_${timestamp}`,
        status: 'Active',
        firstName: 'Put',
        lastName: 'User',
        pronouns: 'He/Him',
        pronunciationUrl: 'https://example.com/pronunciation.mp3',
        email: `put_user_${timestamp}@example.com`,
        mobile: `99999${timestamp.toString().slice(-5)}`,
        phone: `88888${timestamp.toString().slice(-5)}`,
        extn: '123',
        about: 'Test user about field',
        photo: 'https://example.com/photo.png',
        employeeNumber: `EMP${timestamp}`,
        coverImage: 'https://example.com/cover.png',
        peopleCategory: 'Employee',
        timezone: 'Asia/Kolkata',
        locale: 'en-IN',
        managerId: 'manager-uuid',
        assistantId: 'assistant-uuid',
        isEmailDisplayable: true,
        isMobileDisplayable: true,
        isPhoneDisplayable: true,
        zoom: 'https://zoom.us/my/putuser',
        skype: 'putuser_skype',
        linkedInUrl: 'https://linkedin.com/in/putuser',
        twitterUrl: 'https://twitter.com/putuser',
        facebookUrl: 'https://facebook.com/putuser',
        youtubeUrl: 'https://youtube.com/putuser',
        instagramUrl: 'https://instagram.com/putuser',
        payCurrency: 'USD',
        licenseType: 'Full',
        addressLine1: '123 Street',
        addressLine2: 'Suite 4',
        city: 'TestCity',
        state: 'TestState',
        postalCode: '123456',
        country: 'India',
        title: 'Engineer',
        department: 'QA',
        division: 'Tech',
        businessUnit: 'Platform',
        companyName: 'Simpplr',
        startDate: '2023-01-01',
        userType: 'Employee',
        birthDate: '1995-05-15', // OR birthDayDay + birthDayMonth
        ...overrides,
      };
    };
  
    test.beforeAll(async () => {
      // Create a user
      const resp = await apiContext.post('/users', {
        data: {
          email: `put_base_${Date.now()}@example.com`,
          username: `put_base_user_${Date.now()}`,
          firstName: 'Base',
          lastName: 'User',
          phone: `77777${Date.now().toString().slice(-5)}`,
        },
      });
      expect(resp.status()).toBe(201);
      baseUser = await resp.json();
      userId = baseUser.id;
    });
  
    test('should update user with valid full payload (birthDate variant)', async () => {
      const payload = fullPayload({ birthDate: '2000-01-01' });
  
      const response = await apiContext.put(`/users/${userId}`, { data: payload });
      expect(response.status()).toBe(200);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.firstName).toBe(payload.firstName);
      expect(body.email).toBe(payload.email);
    });
  
    test('should update user with valid full payload (birthDayDay + birthDayMonth variant)', async () => {
      const payload = fullPayload({
        birthDayDay: '15',
        birthDayMonth: '06',
      });
      delete payload.birthDate;
  
      const response = await apiContext.put(`/users/${userId}`, { data: payload });
      expect(response.status()).toBe(200);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.birthDayDay).toBe('15');
      expect(body.birthDayMonth).toBe('06');
    });
  
    test('should reject request with missing required field', async () => {
      const payload = fullPayload();
      delete payload.email; // required field
  
      const response = await apiContext.put(`/users/${userId}`, { data: payload });
      expect(response.status()).toBe(400);
    });
  
    test('should reject request with invalid email format', async () => {
      const payload = fullPayload({ email: 'invalidEmail' });
  
      const response = await apiContext.put(`/users/${userId}`, { data: payload });
      expect(response.status()).toBe(400);
    });
  
    test('should not allow duplicate username', async () => {
      // Create another user
      const otherResp = await apiContext.post('/users', {
        data: {
          email: `dup_put_${Date.now()}@example.com`,
          username: `dup_put_user_${Date.now()}`,
          firstName: 'Another',
          lastName: 'User',
          phone: `66666${Date.now().toString().slice(-5)}`,
        },
      });
      const otherUser = await otherResp.json();
  
      const payload = fullPayload({ username: otherUser.username });
  
      const response = await apiContext.put(`/users/${userId}`, { data: payload });
      expect(response.status()).toBe(400);
    });
  });
  
  // --- Patch User ---
  test.describe('patch Update User API', () => {
    let userId;
    let existingUser;
  
    test.beforeAll(async () => {
      // Create a base user 
      const timestamp = Date.now();
      const resp = await apiContext.post('/users', {
        data: {
          email: `update_${timestamp}@example.com`,
          username: `update_user_${timestamp}`,
          phone: `99999${timestamp.toString().slice(-5)}`,
          firstName: 'Base',
          lastName: 'User',
        },
      });
  
      expect(resp.status()).toBe(201);
      existingUser = await resp.json();
      userId = existingUser.id;
    });
  
    test('should successfully update user firstName and lastName', async () => {
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { firstName: 'Updated', lastName: 'User' },
      });
      expect(response.status()).toBe(200);
  
      // follow-up GET
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.firstName).toBe('Updated');
      expect(body.lastName).toBe('User');
    });
  
    test('should not allow duplicate email', async () => {
      const timestamp = Date.now();
      const otherResp = await apiContext.post('/users', {
        data: {
          email: `dup_update_${timestamp}@example.com`,
          firstName: 'Another',
          lastName: 'User',
        },
      });
      const otherUser = await otherResp.json();
  
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { email: otherUser.email },
      });
      expect(response.status()).toBe(400);
  
      // confirm old value remains
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.email).toBe(existingUser.email);
    });
  
    test('should not allow duplicate username', async () => {
      const timestamp = Date.now();
      const otherResp = await apiContext.post('/users', {
        data: {
          username: `dup_username_${timestamp}`,
          email: `dup_username_${timestamp}@example.com`,
          firstName: 'Another',
          lastName: 'User',
        },
      });
      const otherUser = await otherResp.json();
  
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { username: otherUser.username },
      });
      expect(response.status()).toBe(400);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.username).toBe(existingUser.username);
    });
  
    test('should not allow duplicate mobile', async () => {
      const timestamp = Date.now();
      const otherResp = await apiContext.post('/users', {
        data: {
          phone: `88888${timestamp.toString().slice(-5)}`,
          email: `dup_mobile_${timestamp}@example.com`,
          firstName: 'Another',
          lastName: 'User',
        },
      });
      const otherUser = await otherResp.json();
  
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { phone: otherUser.phone },
      });
      expect(response.status()).toBe(400);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.phone).toBe(existingUser.phone);
    });
  
    test('should reject invalid email format', async () => {
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { email: 'badEmailFormat' },
      });
      expect(response.status()).toBe(400);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.email).toBe(existingUser.email);
    });
  
    test('should reject invalid phone number', async () => {
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { phone: 'abc123' },
      });
      expect(response.status()).toBe(400);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.phone).toBe(existingUser.phone);
    });
  
    test('should reject invalid URL in linkedin field', async () => {
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { linkedInUrl: 'not-a-url' },
      });
      expect(response.status()).toBe(400);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.linkedInUrl ?? null).toBeNull(); // still unset
    });
  
    test('should update status field correctly', async () => {
      const response = await apiContext.patch(`/users/${userId}`, {
        data: { status: 'Inactive' },
      });
      expect(response.status()).toBe(200);
  
      const getResp = await apiContext.get(`/users/${userId}`);
      const body = await getResp.json();
      expect(body.status).toBe('Inactive');
    });
  });



});
*/