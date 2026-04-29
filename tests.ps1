$baseUrl = "http://localhost:3001"

function Test-Login {
    $body = @{
        username = "superadmin"
        password = "123456"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    return $response
}

function Test-Profile {
    param($token)
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/profile/me" -Method Get -Headers $headers
    return $response
}

function Test-Countries {
    param($token)
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/countries" -Method Get -Headers $headers
    return $response
}

function Test-CountriesActive {
    param($token)
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/countries/active" -Method Get -Headers $headers
    return $response
}

function Test-AdminPanel {
    param($token)
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/panel" -Method Get -Headers $headers
    return $response
}

function Test-Users {
    param($token)
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $headers
    return $response
}

Write-Host "=== TEST 1: Login ===" -ForegroundColor Cyan
$login = Test-Login
$login | ConvertTo-Json -Depth 3
$token = $login.token

if ($token) {
    Write-Host "`n=== TEST 2: Profile ===" -ForegroundColor Cyan
    Test-Profile -token $token | ConvertTo-Json -Depth 3

    Write-Host "`n=== TEST 3: Countries ===" -ForegroundColor Cyan
    Test-Countries -token $token | ConvertTo-Json -Depth 3

    Write-Host "`n=== TEST 4: Countries Active ===" -ForegroundColor Cyan
    Test-CountriesActive -token $token | ConvertTo-Json -Depth 3

    Write-Host "`n=== TEST 5: Admin Panel ===" -ForegroundColor Cyan
    Test-AdminPanel -token $token | ConvertTo-Json -Depth 3

    Write-Host "`n=== TEST 6: Users ===" -ForegroundColor Cyan
    Test-Users -token $token | ConvertTo-Json -Depth 3
} else {
    Write-Host "Login failed, cannot test other endpoints" -ForegroundColor Red
}