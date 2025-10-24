#!/bin/bash

echo "🚀 Setting up Leave Request Workflow..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ All dependencies installed successfully!"
echo ""
echo "🎉 Setup complete! You can now start the application:"
echo ""
echo "  npm run dev          # Start both backend and frontend"
echo "  npm run backend:dev  # Start backend only (port 3001)"
echo "  npm run frontend:dev # Start frontend only (port 3000)"
echo ""
echo "🌐 Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3001/api"
echo ""
echo "🔐 Demo credentials:"
echo "  Employee: username=employee, password=password123"
echo "  Manager: username=manager, password=manager123"
echo ""
echo "🧪 Run tests:"
echo "  npm test             # Run all tests"
echo "  npm run backend:test # Run backend tests only"
echo "  npm run frontend:test # Run frontend tests only"
