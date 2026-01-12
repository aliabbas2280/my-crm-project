@echo off
echo Starting CRM Pro Application...
echo.

echo Starting JSON Server on port 5000...
start "JSON Server" cmd /k "npm run server"

echo Waiting for JSON Server to start...
timeout /t 3 /nobreak > nul

echo Starting React Development Server...
start "React App" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo JSON Server: http://localhost:5000
echo React App: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul