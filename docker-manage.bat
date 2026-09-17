@echo off
REM Gereja Digital Docker Management Script for Windows
REM This batch file provides an interactive menu for managing Docker containers

setlocal enabledelayedexpansion

:menu
cls
echo.
echo ================================
echo Gereja Digital Docker Manager
echo ================================
echo.
echo Select an option:
echo 1. Start production environment
echo 2. Start development environment
echo 3. Stop all containers
echo 4. View logs
echo 5. Build images
echo 6. Clean up containers ^& volumes
echo 7. Database backup
echo 8. Database restore
echo 9. Container status
echo 0. Exit
echo.
set /p choice="Enter your choice [0-9]: "

if "%choice%"=="1" goto start_prod
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto build
if "%choice%"=="6" goto cleanup
if "%choice%"=="7" goto backup
if "%choice%"=="8" goto restore
if "%choice%"=="9" goto status
if "%choice%"=="0" goto exit_script
echo Invalid choice. Please try again.
timeout /t 2 /nobreak
goto menu

:start_prod
cls
echo Starting Production Environment...
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo Please edit .env file with your configuration
    pause
)
docker-compose up -d
echo Production environment started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
pause
goto menu

:start_dev
cls
echo Starting Development Environment...
docker-compose -f docker-compose.dev.yml up -d
echo Development environment started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001 (Debug: 0.0.0.0:9229)
pause
goto menu

:stop_all
cls
echo Stopping all containers...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo All containers stopped!
pause
goto menu

:view_logs
cls
echo Select service for logs:
echo 1. Backend (production)
echo 2. Frontend (production)
echo 3. All (production)
echo.
set /p log_choice="Enter choice: "

if "%log_choice%"=="1" docker-compose logs -f backend
if "%log_choice%"=="2" docker-compose logs -f frontend
if "%log_choice%"=="3" docker-compose logs -f
goto menu

:build
cls
echo Building Docker Images...
docker-compose build
echo Images built successfully!
pause
goto menu

:cleanup
cls
echo This will remove stopped containers and unused volumes.
set /p confirm="Continue? (y/n): "
if /i "%confirm%"=="y" (
    docker-compose down -v
    docker system prune -f
    echo Cleanup completed!
) else (
    echo Cleanup cancelled.
)
pause
goto menu

:backup
cls
echo Creating Database Backup...
if not exist backups mkdir backups
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set backup_file=backups\database-%mydate%-%mytime%.sqlite
docker cp gereja-backend:/app/database.sqlite "%backup_file%"
echo Database backed up to: %backup_file%
pause
goto menu

:restore
cls
echo Available backups:
dir /b backups\
set /p backup_file="Enter backup filename: "
if exist "backups\%backup_file%" (
    docker cp "backups\%backup_file%" gereja-backend:/app/database.sqlite
    echo Database restored!
) else (
    echo Backup file not found!
)
pause
goto menu

:status
cls
echo Container Status:
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
pause
goto menu

:exit_script
echo Goodbye!
exit /b 0
