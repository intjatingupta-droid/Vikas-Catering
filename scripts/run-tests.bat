@echo off
REM Test Runner Script for Vikas Caterings (Windows)
REM This script runs automated tests for the admin panel

echo ================================================================
echo         VIKAS CATERINGS - TEST EXECUTION SCRIPT
echo ================================================================
echo.

REM Check if backend is running
echo Checking if backend server is running...
curl -s http://localhost:5001/api/sitedata >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend server is running on port 5001
) else (
    echo [ERROR] Backend server is not running!
    echo    Please start the backend server first:
    echo    cd server ^&^& npm start
    exit /b 1
)

echo.
echo Running automated tests...
echo.

REM Run the test script
cd /d "%~dp0.."
node scripts/test-admin-panel.js

REM Capture exit code
set TEST_EXIT_CODE=%errorlevel%

echo.
if %TEST_EXIT_CODE% equ 0 (
    echo [OK] All tests passed!
) else (
    echo [ERROR] Some tests failed. Please review the output above.
)

exit /b %TEST_EXIT_CODE%
