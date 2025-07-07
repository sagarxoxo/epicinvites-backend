-- database/schema.sql
-- User Role Management Schema for Supabase

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'designer', 'sales', 'user')),
    extras JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_extras ON users USING GIN (extras);

-- Add comment to document the field
COMMENT ON COLUMN users.extras IS 'JSON field for storing additional user data like preferences, settings, metadata, etc.';

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (you can modify the credentials)
-- Note: This password is 'AdminPassword123!' hashed with bcrypt
INSERT INTO users (full_name, email, password, role) 
VALUES (
    'System Administrator',
    'admin@epicinvites.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZOKtHCeT0xfxGO.',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Row Level Security (RLS) policies (optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to see all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.email = current_user_email() 
            AND admin_user.role = 'admin'
        )
    );

-- Policy to allow admins to insert users
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.email = current_user_email() 
            AND admin_user.role = 'admin'
        )
    );

-- Policy to allow admins to update users
CREATE POLICY "Admins can update users" ON users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.email = current_user_email() 
            AND admin_user.role = 'admin'
        )
    );

-- Policy to allow admins to delete users
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.email = current_user_email() 
            AND admin_user.role = 'admin'
        )
    );

-- Function to get current user email (helper function for RLS)
CREATE OR REPLACE FUNCTION current_user_email()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.current_user_email', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
