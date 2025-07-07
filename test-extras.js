// Test the extras field functionality
// Run with: node test-extras.js

const axios = require("axios");
require("dotenv").config();

const BASE_URL = "http://localhost:8080";
const ADMIN_TOKEN = "admin-secret-token";

async function testExtrasField() {
  console.log("🧪 Testing extras field functionality...\n");

  try {
    // 1. Create a user with extras data
    console.log("1. Creating user with extras data...");
    const userData = {
      fullName: "Test User With Extras",
      email: `extrastest${Date.now()}@example.com`,
      password: "TestPass123!",
      role: "user",
      extras: {
        inviteData: {},
      },
    };

    const createResponse = await axios.post(`${BASE_URL}/api/users`, userData, {
      headers: {
        "admin-token": ADMIN_TOKEN,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ User created successfully");
    console.log("User ID:", createResponse.data.data.id);
    console.log(
      "Extras:",
      JSON.stringify(createResponse.data.data.extras, null, 2)
    );

    const userId = createResponse.data.data.id;

    // 2. Get user by ID and verify extras
    console.log("\n2. Getting user by ID to verify extras...");
    const getUserResponse = await axios.get(`${BASE_URL}/api/users/${userId}`, {
      headers: {
        "admin-token": ADMIN_TOKEN,
      },
    });

    console.log("✅ User retrieved successfully");
    console.log(
      "Extras from GET:",
      JSON.stringify(getUserResponse.data.data.extras, null, 2)
    );

    // 3. Update user extras
    console.log("\n3. Updating user extras...");
    const updateData = {
      extras: {
        inviteData: {},
        metadata: {
          source: "api_test",
          created_by: "test_script",
          updated_by: "test_script",
          last_updated: new Date().toISOString(),
        },
        customData: {
          favoriteColor: "blue",
          age: 25,
        },
      },
    };

    const updateResponse = await axios.put(
      `${BASE_URL}/api/users/${userId}`,
      updateData,
      {
        headers: {
          "admin-token": ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ User updated successfully");
    console.log(
      "Updated extras:",
      JSON.stringify(updateResponse.data.data.extras, null, 2)
    );

    // 4. Login and verify extras in profile
    console.log("\n4. Testing login and profile with extras...");
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userData.email,
      password: userData.password,
    });

    console.log("✅ Login successful");

    const token = loginResponse.data.data.accessToken;
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Profile retrieved successfully");
    console.log(
      "Profile extras:",
      JSON.stringify(profileResponse.data.data.extras, null, 2)
    );

    // 5. Test with empty extras
    console.log("\n5. Testing user creation with empty extras...");
    const userWithEmptyExtras = {
      fullName: "User Empty Extras",
      email: `emptyextras${Date.now()}@example.com`,
      password: "TestPass123!",
      role: "designer",
      // No extras field
    };

    const emptyExtrasResponse = await axios.post(
      `${BASE_URL}/api/users`,
      userWithEmptyExtras,
      {
        headers: {
          "admin-token": ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ User with empty extras created successfully");
    console.log(
      "Default extras:",
      JSON.stringify(emptyExtrasResponse.data.data.extras, null, 2)
    );

    // 6. Clean up - delete test users
    console.log("\n6. Cleaning up test users...");
    await axios.delete(`${BASE_URL}/api/users/${userId}`, {
      headers: {
        "admin-token": ADMIN_TOKEN,
      },
    });

    await axios.delete(
      `${BASE_URL}/api/users/${emptyExtrasResponse.data.data.id}`,
      {
        headers: {
          "admin-token": ADMIN_TOKEN,
        },
      }
    );

    console.log("✅ Test users deleted successfully");

    console.log("\n🎉 All extras field tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testExtrasField();
