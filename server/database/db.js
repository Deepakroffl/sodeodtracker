// Database Connection Pool
// Supports both local PostgreSQL and Neon (production)

const { Pool } = require('pg');

// Use DATABASE_URL for production (Neon), fallback to individual vars for local
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'sod_eod_tracker',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

const pool = new Pool({
  ...connectionConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✓ Database connected');
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✓ Database connection verified'))
  .catch((err) => console.error('✗ Database connection failed:', err.message));

module.exports = pool;
