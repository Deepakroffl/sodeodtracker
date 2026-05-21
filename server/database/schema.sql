-- ============================================
-- SOD & EOD Daily Tracker — Database Schema
-- PostgreSQL
-- ============================================

-- Create database (run manually)
-- CREATE DATABASE sod_eod_tracker;

-- Enable UUID extension (optional, we use SERIAL here)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT DEFAULT '',
    status          VARCHAR(20) NOT NULL DEFAULT 'planned'
                    CHECK (status IN ('planned', 'completed', 'pending', 'carried_forward')),
    task_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    eod_notes       TEXT DEFAULT '',
    carried_from_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_task_date ON tasks(task_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_date_status ON tasks(task_date, status);
CREATE INDEX idx_tasks_carried_from ON tasks(carried_from_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample seed data (optional)
-- INSERT INTO tasks (title, description, task_date, status) VALUES
--     ('Set up project structure', 'Initialize PERN stack application', CURRENT_DATE, 'planned'),
--     ('Design database schema', 'Create PostgreSQL tables and indexes', CURRENT_DATE, 'planned'),
--     ('Build REST API', 'Express routes and controllers', CURRENT_DATE, 'planned');
