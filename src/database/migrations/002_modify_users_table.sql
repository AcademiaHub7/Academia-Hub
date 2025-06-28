-- Migration: Modify Users Table
-- Date: 2025-06-27

-- Up Migration
-- First check if users table exists, if not create it
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add new columns if they don't exist
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS tenant_id BIGINT COMMENT 'Reference to the school this user belongs to',
    ADD COLUMN IF NOT EXISTS role ENUM('promoter', 'admin', 'teacher', 'student', 'parent', 'staff') DEFAULT 'student',
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
    ADD CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES schools(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Down Migration
/*
ALTER TABLE users
    DROP FOREIGN KEY IF EXISTS fk_users_tenant,
    DROP COLUMN IF EXISTS tenant_id,
    DROP COLUMN IF EXISTS role,
    DROP COLUMN IF EXISTS status,
    DROP COLUMN IF EXISTS kyc_verified,
    DROP COLUMN IF EXISTS profile_image,
    DROP COLUMN IF EXISTS phone,
    DROP COLUMN IF EXISTS last_login_at;

DROP INDEX IF EXISTS idx_users_tenant_id ON users;
DROP INDEX IF EXISTS idx_users_role ON users;
DROP INDEX IF EXISTS idx_users_status ON users;
*/
