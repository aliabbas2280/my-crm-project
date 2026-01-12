@echo off
echo Starting Mini CRM Application...
echo.

echo 1. Starting JSON Server on port 5000...
start "JSON Server" cmd /k "cd /d %~dp0 && npm run server"

timeout /t 3 /nobreak >nul

echo 2. Starting React Development Server...
start "React App" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo JSON Server: http://localhost:5000
echo React App: http://localhost:5173
echo.
echo Login with: admin@crm.com / password
echo.
pause