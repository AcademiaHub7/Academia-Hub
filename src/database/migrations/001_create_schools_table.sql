-- Migration: Create Schools Table
-- Date: 2025-06-27

-- Up Migration
CREATE TABLE IF NOT EXISTS schools (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending_payment', 'pending_kyc', 'active', 'suspended', 'expired') DEFAULT 'pending_payment',
    subscription_plan_id BIGINT,
    payment_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    kyc_status ENUM('pending', 'under_review', 'verified', 'rejected') DEFAULT 'pending',
    fedapay_transaction_id VARCHAR(255),
    promoter_user_id BIGINT,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subdomain (subdomain),
    INDEX idx_status (status),
    INDEX idx_subscription_plan_id (subscription_plan_id)
);

-- Down Migration
-- DROP TABLE IF EXISTS schools;
