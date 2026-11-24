# Frontend Auth Flow - pasar de Render a VPS

Se modifican `AuthService` y los entornos; se conserva la UI V1 completa.
En produccion todas las solicitudes se hacen al mismo origen: `/api/...`.
En desarrollo se usa `http://127.0.0.1:3004/api` con `CORS_ORIGIN=http://localhost:4200` en backend.

No tocar los componentes de login y registro del refactor V1.
El proyecto requiere su package.json/angular.json propios y build para deploy:
`npm ci && npm run build` tras incorporar estos cambios.
Para validar, en el bundle compilado no deben existir URLs de `onrender.com`.

Advertencia: esta version conserva JWT en `localStorage` por compatibilidad;
antes de usarla como sistema central de autenticacion de aplicaciones reales
hay que planificar cookies HttpOnly, CSRF y validacion de token/sesiones.
