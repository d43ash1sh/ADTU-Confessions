#!/bin/bash

# Assam Down Town University Confessions - Local Development Startup Script

echo "🚀 Starting Assam Down Town University Confessions..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your database configuration"
    exit 1
fi

# Load environment variables
export $(cat .env.local | xargs)

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "  PostgreSQL is not running. Starting it..."
    brew services start postgresql@14
    sleep 3
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw adtu_confessions; then
    echo "📊 Creating database..."
    createdb adtu_confessions
fi

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

# Start the development server
echo "🌐 Starting development server on http://localhost:3000"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API: http://localhost:3000/api"
echo "👨‍💼 Admin: http://localhost:3000/admin"
echo ""
echo "Admin credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev 