-- CorruMap Database Schema
-- Create tables for corruption tracking platform

-- Reports table for storing corruption incidents
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    coordinates POINT,
    estimated_amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'pending',
    anonymous BOOLEAN DEFAULT true,
    blockchain_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    verification_score INTEGER DEFAULT 0
);

-- Evidence table for storing supporting documents
CREATE TABLE IF NOT EXISTS evidence (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size INTEGER,
    encrypted_path VARCHAR(500),
    hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification table for tracking verification process
CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    verifier_id VARCHAR(100),
    verification_type VARCHAR(50),
    status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dead man's switch table for administrator protection
CREATE TABLE IF NOT EXISTS dead_mans_switch (
    id SERIAL PRIMARY KEY,
    admin_id VARCHAR(100) UNIQUE NOT NULL,
    last_checkin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checkin_interval INTEGER DEFAULT 24, -- hours
    emergency_contacts TEXT[],
    encrypted_data TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain records for immutable audit trail
CREATE TABLE IF NOT EXISTS blockchain_records (
    id SERIAL PRIMARY KEY,
    record_type VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    block_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_hash VARCHAR(64) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(location);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_blockchain_records_type_id ON blockchain_records(record_type, record_id);
