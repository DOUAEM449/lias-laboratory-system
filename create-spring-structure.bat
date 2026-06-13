@echo off

cd lias-backend\src\main\java\com\lias\lias_backend

mkdir config
mkdir controller
mkdir controller\auth
mkdir controller\member
mkdir controller\publication
mkdir controller\equipment
mkdir controller\event
mkdir controller\meeting
mkdir controller\team
mkdir controller\document
mkdir controller\admin

mkdir dto
mkdir dto\auth
mkdir dto\member
mkdir dto\publication
mkdir dto\equipment
mkdir dto\event
mkdir dto\meeting
mkdir dto\team
mkdir dto\document

mkdir entity
mkdir entity\enums

mkdir repository

mkdir service
mkdir service\impl

mkdir security

mkdir mapper

mkdir exception

mkdir util

echo.
echo ======================================
echo Structure Spring Boot creee avec succes
echo ======================================
pause