@echo off
echo Installing required 3D packages for Team Wolv...
echo.

cd /d "%~dp0"

echo Installing @react-three/drei...
npm install @react-three/drei

echo Installing @react-three/fiber...
npm install @react-three/fiber

echo Installing three...
npm install three

echo Installing @types/three...
npm install @types/three --save-dev

echo.
echo Installation complete!
echo You can now run: npm run dev
echo.
pause


