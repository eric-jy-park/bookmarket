#!/bin/bash

# Bookmarket Project Setup Script
# This script automates the initial setup for new developers

set -e  # Exit on any error

echo "🚀 Welcome to Bookmarket Setup!"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo ""
print_info "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. You have $(node --version)"
    exit 1
fi
print_status "Node.js $(node --version) is installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm@8.9.2
fi
print_status "pnpm $(pnpm --version) is installed"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi
print_status "Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker and try again"
    exit 1
fi
print_status "Docker is running"

# Install dependencies
echo ""
print_info "Installing dependencies..."
pnpm install
print_status "Dependencies installed"

# Setup environment files
echo ""
print_info "Setting up environment files..."

# Server environment
if [ ! -f "apps/server/.env" ]; then
    if [ -f "apps/server/.env.example" ]; then
        cp apps/server/.env.example apps/server/.env
        print_status "Created apps/server/.env from example"
        print_warning "Please update apps/server/.env with your specific values"
    else
        print_error "apps/server/.env.example not found!"
        exit 1
    fi
else
    print_info "apps/server/.env already exists"
fi

# Web environment  
if [ ! -f "apps/web/.env" ]; then
    if [ -f "apps/web/.env.example" ]; then
        cp apps/web/.env.example apps/web/.env
        print_status "Created apps/web/.env from example"
        print_warning "Please update apps/web/.env with your specific values"
    else
        print_error "apps/web/.env.example not found!"
        exit 1
    fi
else
    print_info "apps/web/.env already exists"
fi

# Start database
echo ""
print_info "Starting PostgreSQL database..."
docker compose up db -d

# Wait for database to be ready
echo ""
print_info "Waiting for database to be ready..."
sleep 10

# Check if database is healthy
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose ps | grep -q "healthy"; then
        break
    fi
    echo "Waiting for database... ($((MAX_RETRIES - RETRY_COUNT)) retries left)"
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_error "Database failed to start properly"
    exit 1
fi

print_status "Database is ready"

# Run migrations
echo ""
print_info "Running database migrations..."
cd apps/server
pnpm run migration:run
cd ../..
print_status "Database migrations completed"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo "================================"
echo ""
print_info "To start the development servers:"
echo "  1. Backend:  pnpm --filter bookmarket-server dev"
echo "  2. Frontend: pnpm --filter bookmarket-web dev"
echo "  3. Or both:  pnpm dev"
echo ""
print_info "Application URLs:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend:  http://localhost:8000"
echo "  • Database: localhost:5432"
echo ""
print_warning "Remember to configure OAuth credentials in your .env files for full functionality"
echo ""
print_status "Happy coding! 🚀"