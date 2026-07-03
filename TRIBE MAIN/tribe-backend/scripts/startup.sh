#!/bin/bash

# Tribe Backend Startup Script

set -e

echo "🚀 Tribe Backend Startup Script"
echo "================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install/upgrade dependencies
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Check if database is running
echo "🔍 Checking database connection..."
python -c "
import asyncio
from app.config.database import db_manager
try:
    db_manager.initialize()
    print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    print('Make sure PostgreSQL is running and DATABASE_URL is correct in .env')
    exit(1)
"

echo ""
echo "🎉 Startup complete!"
echo "Start the server with: uvicorn app.main:app --reload"
echo "API documentation: http://localhost:8000/docs"
