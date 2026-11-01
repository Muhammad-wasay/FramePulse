@echo off
REM Compile all Java files from src into the out folder, then run the app
if not exist out mkdir out
javac -d out src\*.java
if errorlevel 1 (
    echo.
    echo Compilation failed. Fix the errors above.
    pause
    exit /b 1
)
java -cp out Main
