$job = Start-Job -ScriptBlock {
    Set-Location 'C:\Users\hotel\OneDrive\Documentos\TRABAJO ANDRES\ProyectoIntegradorVr1'
    npm run dev
} -Name "BackendServer"

Start-Sleep 5

$baseUrl = "http://localhost:3001"

Write-Host "=== PRE-TEST: Create SuperAdmin if not exists ===" -ForegroundColor Yellow
node src/scripts/createSuperAdmin.js

Write-Host "`n=== TEST 1: Login ===" -ForegroundColor Cyan
$body = @{username="superadmin"; password="123456"} | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    $login | ConvertTo-Json -Depth 3
    $token = $login.token
    $refreshToken = $login.refreshToken

    if ($token) {
        $headers = @{Authorization = "Bearer $token"}

        Write-Host "`n=== TEST 2: Profile ===" -ForegroundColor Cyan
        Invoke-RestMethod -Uri "$baseUrl/api/profile/me" -Method Get -Headers $headers | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 3: Countries ===" -ForegroundColor Cyan
        Invoke-RestMethod -Uri "$baseUrl/api/countries" -Method Get -Headers $headers | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 4: Admin Panel ===" -ForegroundColor Cyan
        Invoke-RestMethod -Uri "$baseUrl/api/admin/panel" -Method Get -Headers $headers | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 5: Users ===" -ForegroundColor Cyan
        Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $headers | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 6: Register New User ===" -ForegroundColor Cyan
        $registerBody = @{
            nombre = "Test"
            apellido = "User"
            email = "test@example.com"
            username = "testuser"
            password = "test123"
            rol_id = 3
            pais_id = 1
        } | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json" | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 7: Refresh Token ===" -ForegroundColor Cyan
        $refreshBody = @{refreshToken = $refreshToken} | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/api/auth/refresh-token" -Method Post -Body $refreshBody -ContentType "application/json" | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 8: Logout ===" -ForegroundColor Cyan
        $logoutBody = @{refreshToken = $refreshToken} | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/api/auth/logout" -Method Post -Body $logoutBody -ContentType "application/json" -Headers $headers | ConvertTo-Json -Depth 3

        Write-Host "`n=== TEST 9: Logout All ===" -ForegroundColor Cyan
        Invoke-RestMethod -Uri "$baseUrl/api/auth/logout-all" -Method Post -Headers $headers | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Stop-Job -Name "BackendServer" -ErrorAction SilentlyContinue
Remove-Job -Name "BackendServer" -Force