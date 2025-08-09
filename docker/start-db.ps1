# Script para iniciar la base de datos PostgreSQL con Docker
# Uso: .\docker\start-db.ps1

Write-Host "🚀 Iniciando base de datos PostgreSQL..." -ForegroundColor Green

# Verificar si Docker está ejecutándose
try {
    docker version | Out-Null
} catch {
    Write-Host "❌ Docker no está ejecutándose. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar si existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env desde env.example..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Archivo .env creado. Revisa las variables de entorno si es necesario." -ForegroundColor Green
}

# Construir e iniciar los servicios
Write-Host "🔨 Construyendo imagen de PostgreSQL..." -ForegroundColor Yellow
docker-compose build --no-cache

Write-Host "📦 Iniciando servicios..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que PostgreSQL esté listo
Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar el estado de los servicios
Write-Host "🔍 Verificando estado de los servicios..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✅ Base de datos iniciada correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Información de conexión:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host "   Base de datos: tasks_db" -ForegroundColor White
Write-Host "   Usuario: postgres" -ForegroundColor White
Write-Host "   Contraseña: postgres" -ForegroundColor White
Write-Host ""
Write-Host "🌐 pgAdmin (opcional):" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:8080" -ForegroundColor White
Write-Host "   Email: admin@tasks.com" -ForegroundColor White
Write-Host "   Password: admin" -ForegroundColor White
Write-Host ""
Write-Host "📝 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   Ver logs: docker-compose logs -f postgres" -ForegroundColor Gray
Write-Host "   Detener: docker-compose down" -ForegroundColor Gray
Write-Host "   Acceder a PostgreSQL: docker exec -it tasks-postgres psql -U postgres -d tasks_db" -ForegroundColor Gray
