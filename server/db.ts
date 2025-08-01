import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon with WebSocket constructor
neonConfig.webSocketConstructor = ws;

// Add connection pooling and error handling configuration
neonConfig.poolQueryViaFetch = true;
neonConfig.useSecureWebSocket = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with better error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle({ client: pool, schema });

// Add error handling but don't crash the app
pool.on('error', (err) => {
  console.warn('Database pool warning:', err.message);
});

// Test connection with retry logic
let connectionRetries = 0;
const maxRetries = 3;

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection established successfully');
    client.release();
  } catch (error) {
    connectionRetries++;
    console.warn(`Database connection attempt ${connectionRetries}/${maxRetries} failed:`, error.message);
    
    if (connectionRetries < maxRetries) {
      console.log('Retrying database connection in 2 seconds...');
      setTimeout(testConnection, 2000);
    } else {
      console.warn('Database connection failed after all retries. Application will use fallback storage.');
    }
  }
}

// Start connection test after a delay
setTimeout(testConnection, 1000);

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    console.log('Closing database connections...');
    await pool.end();
  } catch (error) {
    console.warn('Error closing database connections:', error);
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);