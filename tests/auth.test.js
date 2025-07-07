// tests/auth.test.js
const request = require("supertest");
const app = require("../src/app");

describe("Authentication Endpoints", () => {
  let authToken;
  let refreshToken;
  let testUser;

  beforeAll(async () => {
    // Create a test user first
    const userResponse = await request(app)
      .post("/api/users")
      .set("admin-token", "admin-secret-token")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "TestPass123!",
        role: "user",
      });

    testUser = userResponse.body.data;
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "TestPass123!",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user.email).toBe("test@example.com");

      // Store tokens for other tests
      authToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it("should fail with invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid email or password");
    });

    it("should fail with missing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "TestPass123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with missing password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "TestPass123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe("test@example.com");
    });

    it("should fail without token", async () => {
      const response = await request(app).get("/api/auth/profile");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail with malformed authorization header", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "InvalidFormat token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh token with valid refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken: refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    });

    it("should fail without refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({
        refreshToken: "invalid-refresh-token",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/verify", () => {
    it("should verify valid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("expiresAt");
    });

    it("should fail to verify invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should fail without token", async () => {
      const response = await request(app).get("/api/auth/verify");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully with valid token", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("Logged out successfully");
    });

    it("should fail without token", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("JWT Token Verification in Protected Routes", () => {
    let adminToken;

    beforeAll(async () => {
      // Create admin user and get token
      const adminResponse = await request(app)
        .post("/api/users")
        .set("admin-token", "admin-secret-token")
        .send({
          fullName: "Admin User",
          email: "admin@example.com",
          password: "AdminPass123!",
          role: "admin",
        });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      adminToken = loginResponse.body.data.accessToken;
    });

    it("should access admin route with valid admin JWT token", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should fail to access admin route with user JWT token", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it("should fail to access admin route without token", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  afterAll(async () => {
    // Clean up test users
    if (testUser) {
      await request(app)
        .delete(`/api/users/${testUser.id}`)
        .set("admin-token", "admin-secret-token");
    }
  });
});
