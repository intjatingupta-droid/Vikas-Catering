#!/bin/bash

# Test Runner Script for Vikas Caterings
# This script runs automated tests for the admin panel

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        VIKAS CATERINGS - TEST EXECUTION SCRIPT            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if backend is running
echo "🔍 Checking if backend server is running..."
if curl -s http://localhost:5001/api/sitedata > /dev/null 2>&1; then
    echo "✅ Backend server is running on port 5001"
else
    echo "❌ Backend server is not running!"
    echo "   Please start the backend server first:"
    echo "   cd server && npm start"
    exit 1
fi

echo ""
echo "🧪 Running automated tests..."
echo ""

# Run the test script
cd "$(dirname "$0")/.."
node scripts/test-admin-panel.js

# Capture exit code
TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Please review the output above."
fi

exit $TEST_EXIT_CODE
