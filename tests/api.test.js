// tests/api.test.js
// Comprehensive API test suite
// Run with: node tests/api.test.js

const axios = require("axios");

const BASE_URL = "http://localhost:8080";
const ADMIN_TOKEN = "admin-secret-token";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "admin-token": ADMIN_TOKEN,
    "Content-Type": "application/json",
  },
});

// Create separate instance for auth tests (without admin token)
const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiTester {
  constructor() {
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.testData = [];
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n🧪 Testing: ${testName}`);
      await testFunction();
      console.log(`✅ ${testName} - PASSED`);
      this.testsPassed++;
    } catch (error) {
      console.log(`❌ ${testName} - FAILED`);
      console.error("Error:", error.response?.data || error.message);
      this.testsFailed++;
    }
  }

  async testHealthEndpoint() {
    const response = await axios.get(`${BASE_URL}/api/health`);
    if (response.data.success !== true) {
      throw new Error("Health check failed");
    }
  }

  async testCreateUser() {
    const userData = {
      fullName: "Test Designer",
      email: `designer${Date.now()}@test.com`,
      password: "TestPass123!",
      role: "designer",
    };

    const response = await api.post("/api/users", userData);

    if (response.status !== 201) {
      throw new Error(`Expected status 201, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error("Response success should be true");
    }

    const user = response.data.data;
    this.testData.push({ type: "user", id: user.id, email: userData.email });

    return user;
  }

  async testGetAllUsers() {
    const response = await api.get("/api/users");

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error("Response success should be true");
    }

    if (!Array.isArray(response.data.data.users)) {
      throw new Error("Users should be an array");
    }

    if (!response.data.data.pagination) {
      throw new Error("Pagination data should be present");
    }
  }

  async testGetUserById() {
    const user = this.testData.find((item) => item.type === "user");
    if (!user) {
      throw new Error("No test user found");
    }

    const response = await api.get(`/api/users/${user.id}`);

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (response.data.data.id !== user.id) {
      throw new Error("User ID mismatch");
    }
  }

  async testUpdateUser() {
    const user = this.testData.find((item) => item.type === "user");
    if (!user) {
      throw new Error("No test user found");
    }

    const updateData = {
      fullName: "Updated Test Designer",
      role: "sales",
    };

    const response = await api.put(`/api/users/${user.id}`, updateData);

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (response.data.data.fullName !== updateData.fullName) {
      throw new Error("Full name was not updated");
    }

    if (response.data.data.role !== updateData.role) {
      throw new Error("Role was not updated");
    }
  }

  async testPagination() {
    const response = await api.get("/api/users?page=1&limit=2");

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    const { pagination } = response.data.data;

    if (pagination.page !== 1) {
      throw new Error("Page should be 1");
    }

    if (pagination.limit !== 2) {
      throw new Error("Limit should be 2");
    }
  }

  async testGetUsersByRole() {
    const response = await api.get("/api/users/role/sales");

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!Array.isArray(response.data.data)) {
      throw new Error("Response should be an array");
    }
  }

  async testValidationErrors() {
    try {
      await api.post("/api/users", {
        fullName: "Test",
        email: "invalid-email",
        password: "weak",
        role: "invalid-role",
      });
      throw new Error("Should have thrown validation error");
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected status 400, got ${error.response?.status}`);
      }
    }
  }

  async testUnauthorizedAccess() {
    try {
      await axios.get(`${BASE_URL}/api/users`);
      throw new Error("Should have thrown unauthorized error");
    } catch (error) {
      if (error.response?.status !== 401) {
        throw new Error(`Expected status 401, got ${error.response?.status}`);
      }
    }
  }

  async testDeleteUser() {
    const user = this.testData.find((item) => item.type === "user");
    if (!user) {
      throw new Error("No test user found");
    }

    const response = await api.delete(`/api/users/${user.id}`);

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error("Response success should be true");
    }
  }

  // Authentication Tests
  async testUserLogin() {
    // First create a test user for login
    const userData = {
      fullName: "Auth Test User",
      email: `authuser${Date.now()}@test.com`,
      password: "TestPass123!",
      role: "user",
    };

    const createResponse = await api.post("/api/users", userData);
    if (createResponse.status !== 201) {
      throw new Error("Failed to create test user for login");
    }

    // Test login
    const loginResponse = await authApi.post("/api/auth/login", {
      email: userData.email,
      password: userData.password,
    });

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    if (!loginResponse.data.data.accessToken) {
      throw new Error("No access token returned");
    }

    if (!loginResponse.data.data.refreshToken) {
      throw new Error("No refresh token returned");
    }

    // Store for other tests
    this.testData.push({
      type: "authUser",
      ...createResponse.data.data,
      accessToken: loginResponse.data.data.accessToken,
      refreshToken: loginResponse.data.data.refreshToken,
    });
  }

  async testInvalidLogin() {
    const response = await authApi.post("/api/auth/login", {
      email: "nonexistent@test.com",
      password: "wrongpassword",
    });

    if (response.status !== 401) {
      throw new Error(`Expected status 401, got ${response.status}`);
    }
  }

  async testGetProfile() {
    const authUser = this.testData.find((item) => item.type === "authUser");
    if (!authUser) {
      throw new Error("No authenticated user found");
    }

    const response = await authApi.get("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${authUser.accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (response.data.data.id !== authUser.id) {
      throw new Error("Profile ID mismatch");
    }
  }

  async testRefreshToken() {
    const authUser = this.testData.find((item) => item.type === "authUser");
    if (!authUser) {
      throw new Error("No authenticated user found");
    }

    const response = await authApi.post("/api/auth/refresh", {
      refreshToken: authUser.refreshToken,
    });

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.data.accessToken) {
      throw new Error("No new access token returned");
    }
  }

  async testTokenVerification() {
    const authUser = this.testData.find((item) => item.type === "authUser");
    if (!authUser) {
      throw new Error("No authenticated user found");
    }

    const response = await authApi.get("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${authUser.accessToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    if (!response.data.data.valid) {
      throw new Error("Token should be valid");
    }
  }

  async testJwtAdminAccess() {
    // Create admin user
    const adminData = {
      fullName: "JWT Admin Test",
      email: `jwtadmin${Date.now()}@test.com`,
      password: "AdminPass123!",
      role: "admin",
    };

    const createResponse = await api.post("/api/users", adminData);
    if (createResponse.status !== 201) {
      throw new Error("Failed to create admin user");
    }

    // Login as admin
    const loginResponse = await authApi.post("/api/auth/login", {
      email: adminData.email,
      password: adminData.password,
    });

    if (loginResponse.status !== 200) {
      throw new Error("Admin login failed");
    }

    // Test admin access with JWT token
    const adminToken = loginResponse.data.data.accessToken;
    const response = await authApi.get("/api/users", {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`JWT admin access failed with status ${response.status}`);
    }

    this.testData.push({
      type: "jwtAdmin",
      ...createResponse.data.data,
      accessToken: adminToken,
    });
  }

  async testJwtUserDeniedAccess() {
    const authUser = this.testData.find((item) => item.type === "authUser");
    if (!authUser) {
      throw new Error("No authenticated user found");
    }

    try {
      const response = await authApi.get("/api/users", {
        headers: {
          Authorization: `Bearer ${authUser.accessToken}`,
        },
      });

      if (response.status !== 403) {
        throw new Error(`Expected status 403, got ${response.status}`);
      }
    } catch (error) {
      if (error.response?.status !== 403) {
        throw error;
      }
    }
  }

  async cleanupAuthUsers() {
    const authUser = this.testData.find((item) => item.type === "authUser");
    const jwtAdmin = this.testData.find((item) => item.type === "jwtAdmin");

    if (authUser) {
      await api.delete(`/api/users/${authUser.id}`);
    }

    if (jwtAdmin) {
      await api.delete(`/api/users/${jwtAdmin.id}`);
    }
  }

  async runAllTests() {
    console.log("🚀 Starting Epic Invites API Test Suite...\n");

    await this.runTest("Health Check", () => this.testHealthEndpoint());
    await this.runTest("Create User", () => this.testCreateUser());
    await this.runTest("Get All Users", () => this.testGetAllUsers());
    await this.runTest("Get User by ID", () => this.testGetUserById());
    await this.runTest("Update User", () => this.testUpdateUser());
    await this.runTest("Pagination", () => this.testPagination());
    await this.runTest("Get Users by Role", () => this.testGetUsersByRole());
    await this.runTest("Validation Errors", () => this.testValidationErrors());
    await this.runTest("Unauthorized Access", () =>
      this.testUnauthorizedAccess()
    );
    await this.runTest("Delete User", () => this.testDeleteUser());
    await this.runTest("User Login", () => this.testUserLogin());
    await this.runTest("Invalid Login", () => this.testInvalidLogin());
    await this.runTest("Get Profile", () => this.testGetProfile());
    await this.runTest("Refresh Token", () => this.testRefreshToken());
    await this.runTest("Token Verification", () =>
      this.testTokenVerification()
    );
    await this.runTest("JWT Admin Access", () => this.testJwtAdminAccess());
    await this.runTest("JWT User Denied Access", () =>
      this.testJwtUserDeniedAccess()
    );
    await this.runTest("Cleanup Auth Users", () => this.cleanupAuthUsers());

    console.log("\n📊 Test Results:");
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(
      `📈 Success Rate: ${(
        (this.testsPassed / (this.testsPassed + this.testsFailed)) *
        100
      ).toFixed(1)}%`
    );

    if (this.testsFailed === 0) {
      console.log("\n🎉 All tests passed! Your API is working correctly.");
    } else {
      console.log("\n⚠️  Some tests failed. Please check the errors above.");
    }
  }
}

// Run the tests
const tester = new ApiTester();
tester.runAllTests().catch(console.error);
