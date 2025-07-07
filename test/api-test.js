// test/api-test.js
// Simple test script to verify API endpoints
// Run with: node test/api-test.js

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

async function testAPI() {
  try {
    console.log("🧪 Testing Epic Invites API...\n");

    // Test 1: Create a Designer user
    console.log("1. Creating a Designer user...");
    const createResponse = await api.post("/api/users", {
      fullName: "Test Designer",
      email: "designer@test.com",
      password: "TestPass123!",
      role: "designer",
    });
    console.log("✅ Designer created:", createResponse.data);
    const userId = createResponse.data.data.id;

    // Test 2: Get all users
    console.log("\n2. Getting all users...");
    const usersResponse = await api.get("/api/users");
    console.log("✅ Users retrieved:", usersResponse.data.count, "users found");

    // Test 3: Get user by ID
    console.log("\n3. Getting user by ID...");
    const userResponse = await api.get(`/api/users/${userId}`);
    console.log("✅ User retrieved:", userResponse.data.data.full_name);

    // Test 4: Update user
    console.log("\n4. Updating user...");
    const updateResponse = await api.put(`/api/users/${userId}`, {
      fullName: "Updated Designer Name",
      role: "sales",
    });
    console.log("✅ User updated:", updateResponse.data.data.full_name);

    // Test 5: Delete user
    console.log("\n5. Deleting user...");
    const deleteResponse = await api.delete(`/api/users/${userId}`);
    console.log("✅ User deleted:", deleteResponse.data.message);

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run tests
testAPI();
