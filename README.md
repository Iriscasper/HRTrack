# HRTrack

## Instalación en local
1. Clonar el repositorio: git clone <url>
2. Backend: cd backend && npm install && cp .env.example .env
3. Frontend: cd frontend && npm install && cp .env.local.example .env.local
4. Ejecutar SQL: abrir HeidiSQL y ejecutar sql/001_init.sql
5. Arrancar backend: cd backend && npm run dev
6. Arrancar frontend: cd frontend && npm run dev

## Producción en Vercel
La URL es https://hrtrack-one.vercel.app/