// scripts/create-admin.js
// Script to create an admin user in Supabase
// Run with: node scripts/create-admin.js

const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function createAdminUser() {
  try {
    console.log("🔐 Creating admin user...\n");

    // Admin user data
    const adminEmail = "admin@epicinvites.com";
    const adminPassword = "Admin123!@#"; // Change this to your desired password
    const adminName = "System Administrator";

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from("users")
      .select("id")
      .eq("email", adminEmail)
      .single();

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", adminEmail);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating admin user:", error.message);
      return;
    }

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("👤 Name:", adminName);
    console.log("🎭 Role:", "admin");
    console.log("🆔 User ID:", data.id);
    console.log(
      "\n⚠️  IMPORTANT: Please change the password after first login!"
    );
    console.log(
      "🔗 You can now login at: http://localhost:8080/api/auth/login"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
createAdminUser().catch(console.error);
