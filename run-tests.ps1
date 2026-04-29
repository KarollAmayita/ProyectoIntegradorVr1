$job = Start-Job -ScriptBlock {
    Set-Location 'C:\Users\zanyllect68\Documents\TrabajoFinalFullStack\ProyectoIntegradorVr1'
    npm run dev
} -Name "BackendServer"

Start-Sleep 5

$baseUrl = "http://localhost:3001"

Write-Host "=== TEST 1: Login ===" -ForegroundColor Cyan
$body = @{username="superadmin"; password="123456"} | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    $login | ConvertTo-Json -Depth 3
    $token = $login.token

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
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Stop-Job -Name "BackendServer" -ErrorAction SilentlyContinue
Remove-Job -Name "BackendServer" -Force