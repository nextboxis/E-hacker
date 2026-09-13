-- E-HACKER Core Relational Database Schema (PostgreSQL / SQLite compatible)
-- Database: ehacker_sec_db
-- Version: 3.0.0
-- Generated: 2026-09-13

-- 1. Users Table (Authentication Credentials & Roles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'operative',
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table (Operative Dossier & Skill Progression)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    callsign VARCHAR(255) NOT NULL,
    clearance VARCHAR(64) NOT NULL,
    domain VARCHAR(64) DEFAULT 'full',
    avatar VARCHAR(32) DEFAULT '01',
    github_handle VARCHAR(255),
    github_avatar VARCHAR(512),
    bio TEXT,
    api_key VARCHAR(128) UNIQUE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    completed_projects JSONB DEFAULT '[]'::jsonb,
    checked_skills JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Targets Table (Assigned Target Infrastructure & Scopes)
CREATE TABLE IF NOT EXISTS targets (
    id VARCHAR(64) PRIMARY KEY,
    host VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    scope VARCHAR(32) DEFAULT 'In-Scope',
    ports VARCHAR(128),
    os VARCHAR(128),
    severity VARCHAR(32) DEFAULT 'MEDIUM',
    status VARCHAR(64) DEFAULT 'Active Audit',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vulnerability Findings Table
CREATE TABLE IF NOT EXISTS findings (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    cvss NUMERIC(3, 1) DEFAULT 7.5,
    status VARCHAR(64) DEFAULT 'Open',
    poc TEXT,
    remediation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Field Notes & Engagement Artifacts Table
CREATE TABLE IF NOT EXISTS field_notes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) DEFAULT 'Operative Field Notes',
    content TEXT,
    updated_by VARCHAR(64),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Telemetry & Security Activity Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(255) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid indexing & search
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_targets_host ON targets(host);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
