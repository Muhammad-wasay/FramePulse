@echo off
setlocal enabledelayedexpansion
REM Compile all Java files from src into the out folder, then run the app
if not exist out mkdir out

REM Check if default javac is working
set "JAVAC_CMD=javac"
javac -version >nul 2>&1
if errorlevel 1 (
    set "JAVAC_CMD="
)

if "%JAVAC_CMD%"=="" (
    if defined JAVA_HOME (
        if exist "%JAVA_HOME%\bin\javac.exe" set "JAVAC_CMD=%JAVA_HOME%\bin\javac.exe"
    )
)

if "%JAVAC_CMD%"=="" (
    for /d %%D in ("%ProgramFiles%\Java\jdk*") do (
        if exist "%%D\bin\javac.exe" set "JAVAC_CMD=%%D\bin\javac.exe"
    )
)

if "%JAVAC_CMD%"=="" set "JAVAC_CMD=javac"

REM Check if default java is working
set "JAVA_CMD=java"
java -version >nul 2>&1
if errorlevel 1 (
    set "JAVA_CMD="
)

if "%JAVA_CMD%"=="" (
    if defined JAVA_HOME (
        if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
    )
)

if "%JAVA_CMD%"=="" (
    for /d %%D in ("%ProgramFiles%\Java\jdk*") do (
        if exist "%%D\bin\java.exe" set "JAVA_CMD=%%D\bin\java.exe"
    )
)

if "%JAVA_CMD%"=="" set "JAVA_CMD=java"

echo Compiling FramePulse with %JAVAC_CMD%...
"%JAVAC_CMD%" -d out src\*.java
if errorlevel 1 (
    echo.
    echo Compilation failed. Fix the errors above.
    pause
    exit /b 1
)
echo Launching FramePulse with %JAVA_CMD%...
start "" "%JAVA_CMD%" -cp out Main
