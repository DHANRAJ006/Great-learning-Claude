@echo off
echo Starting LearnFlow (Learning Demo Main)...
cd /d "%~dp0"
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
echo Servers are starting in new windows...
pause
