$baseUrl = "http://localhost:3001"

Write-Host "=== Creando usuario testeditor ===" -ForegroundColor Cyan

# 1. Login as superadmin
Write-Host "`n1. Haciendo login como superadmin..." -ForegroundColor Yellow
$loginBody = @{
    username = "superadmin"
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.token
    Write-Host "   Login exitoso!" -ForegroundColor Green
} catch {
    Write-Host "   Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Create testeditor user
Write-Host "`n2. Creando usuario testeditor..." -ForegroundColor Yellow
$headers = @{Authorization = "Bearer $token"}

$userBody = @{
    nombre = "Test"
    apellido = "Editor"
    email = "test@demo.com"
    username = "testeditor"
    password = "123456"
    rol_id = 3
    pais_id = 1
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body $userBody -ContentType "application/json" -Headers $headers -ErrorAction Stop
    Write-Host "   Usuario creado exitosamente!" -ForegroundColor Green
    Write-Host "   Datos: $($userResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error al crear usuario: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Detalles: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n=== Proceso completado ===" -ForegroundColor Green
Write-Host "Usuario: testeditor" -ForegroundColor Cyan
Write-Host "Contraseña: 123456" -ForegroundColor Cyan
Write-Host "`nPuedes hacer login con estas credenciales ahora." -ForegroundColor Yellow