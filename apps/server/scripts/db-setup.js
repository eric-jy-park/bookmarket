#!/usr/bin/env node

const { execSync } = require('child_process');
const { config } = require('dotenv');

// Load environment variables
config();

const DB_USER = process.env.POSTGRES_USER;
const DB_NAME = process.env.POSTGRES_NAME;
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_PORT = process.env.POSTGRES_PORT || '5432';

console.log('🔄 Setting up database...');

// Function to check if Docker container is running and start it if needed
function ensureDockerContainer() {
  try {
    // Check if any PostgreSQL container is running on port 5432
    const result = execSync(`docker ps --format "table {{.Names}}\t{{.Ports}}" | grep :5432`, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    if (result.trim()) {
      console.log('✅ PostgreSQL container is already running on port 5432');
      return;
    }
  } catch (error) {
    // No container running on port 5432
  }
  
  console.log('🐳 Starting PostgreSQL container...');
  try {
    execSync('cd ../.. && docker-compose up -d db', { stdio: 'inherit' });
    console.log('✅ PostgreSQL container started');
    // Give it a moment to initialize
    require('child_process').execSync('sleep 3');
  } catch (error) {
    // If it fails due to port conflict, the container might already be running
    if (error.message.includes('port is already allocated')) {
      console.log('⚠️  Port 5432 is already in use - checking if PostgreSQL is accessible...');
      return; // Continue with connection check
    }
    console.error('❌ Failed to start PostgreSQL container:', error.message);
    console.log('💡 Make sure Docker is running and docker-compose.yml exists');
    process.exit(1);
  }
}

async function setupDatabase() {
  try {
    // Ensure Docker container is running
    ensureDockerContainer();
    
    // Check if PostgreSQL server is responding (connect to default postgres db first)
    console.log('⏳ Waiting for PostgreSQL server to be ready...');
    
    let retries = 30;
    while (retries > 0) {
      try {
        execSync(`pg_isready -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER}`, { 
          stdio: 'pipe' 
        });
        console.log('✅ PostgreSQL server is ready!');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('❌ PostgreSQL server is not responding. Make sure Docker container is running.');
          console.log('💡 Try running: docker-compose up -d db');
          process.exit(1);
        }
        console.log(`⏳ Waiting for server... (${retries} retries left)`);
        await sleep(2000);
      }
    }

    // Drop and recreate database to ensure clean state
    console.log(`🔍 Checking if database '${DB_NAME}' exists...`);
    try {
      const result = execSync(`docker exec bookmarket-db-1 psql -U ${DB_USER} -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'"`, {
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      if (result.trim() === '1') {
        console.log(`🗑️  Dropping existing database '${DB_NAME}' for clean setup...`);
        execSync(`docker exec bookmarket-db-1 dropdb -U ${DB_USER} ${DB_NAME}`, {
          stdio: 'pipe'
        });
        console.log(`✅ Database '${DB_NAME}' dropped`);
      }
    } catch (error) {
      // Database doesn't exist, which is fine
    }

    console.log(`🔧 Creating database '${DB_NAME}'...`);
    try {
      execSync(`docker exec bookmarket-db-1 createdb -U ${DB_USER} ${DB_NAME}`, {
        stdio: 'pipe'
      });
      console.log(`✅ Database '${DB_NAME}' created successfully`);
    } catch (createError) {
      console.error(`❌ Failed to create database '${DB_NAME}':`, createError.message);
      process.exit(1);
    }

    // Final check that we can connect to the target database
    try {
      execSync(`pg_isready -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}`, { 
        stdio: 'pipe' 
      });
      console.log(`✅ Database '${DB_NAME}' is ready for connections!`);
    } catch (error) {
      console.error(`❌ Cannot connect to database '${DB_NAME}':`, error.message);
      process.exit(1);
    }

    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('💡 Make sure Docker is running and try: docker-compose up -d db');
    process.exit(1);
  }
}

setupDatabase();

// Helper function for async/await in older Node versions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
