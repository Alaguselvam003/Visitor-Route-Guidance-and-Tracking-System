$BaseUrl = "http://localhost:8080/api"

function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Query = ""
    )

    $Url = "$BaseUrl$Endpoint$Query"
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -ErrorAction Stop
        } else {
            $headers = @{ "Content-Type" = "application/json" }
            if ($Body) {
                $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers -Body $Body -UseBasicParsing -ErrorAction Stop
            } else {
                $response = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -ErrorAction Stop
            }
        }
        Write-Host "✅ [$Method] $Endpoint -> Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($null -eq $status) {
            $status = "Connection Error"
        }
        Write-Host "❌ [$Method] $Endpoint -> Status: $status ($($_.Exception.Message))" -ForegroundColor Red
    }
}

Write-Host "--- Testing Auth Controller ---"
Test-Endpoint -Method "POST" -Endpoint "/auth/register" -Body '{"name":"User","email":"u@u.com","password":"p"}'
Test-Endpoint -Method "POST" -Endpoint "/auth/login" -Body '{"email":"u@u.com","password":"p"}'
Test-Endpoint -Method "POST" -Endpoint "/auth/verify" -Query "?email=u@u.com&otp=123456"

Write-Host "`n--- Testing Visitor Controller ---"
Test-Endpoint -Method "POST" -Endpoint "/visitor/register" -Body '{"name":"Vis","email":"v@v.com","phone":"123","purpose":"Meet"}'
Test-Endpoint -Method "GET" -Endpoint "/visitor/qr/dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/visitor/gate-scan/dummy-token"
Test-Endpoint -Method "POST" -Endpoint "/visitor/scan" -Query "?token=dummy-token"
Test-Endpoint -Method "POST" -Endpoint "/visitor/checkin" -Body '{"qrToken":"dummy-token","host":"HostName"}'
Test-Endpoint -Method "POST" -Endpoint "/visitor/checkout" -Query "?token=dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/visitor/journey" -Query "?token=dummy-token"
Test-Endpoint -Method "POST" -Endpoint "/visitor/gate-entry" -Query "?token=dummy-token&gate=Gate1"
Test-Endpoint -Method "POST" -Endpoint "/visitor/reception" -Query "?token=dummy-token&host=HostName"
Test-Endpoint -Method "POST" -Endpoint "/visitor/approve" -Query "?token=dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/visitor/dashboard"
Test-Endpoint -Method "GET" -Endpoint "/visitor/notifications" -Query "?host=HostName"
Test-Endpoint -Method "POST" -Endpoint "/visitor/meeting/complete" -Query "?token=dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/visitor/report"
Test-Endpoint -Method "GET" -Endpoint "/visitor/history"
Test-Endpoint -Method "POST" -Endpoint "/visitor/exit/dummy-token"

Write-Host "`n--- Testing Reception Controller ---"
Test-Endpoint -Method "POST" -Endpoint "/reception/checkin" -Body '{"qrToken":"t","host":"h"}'
Test-Endpoint -Method "POST" -Endpoint "/reception/host-approval" -Body '{"qrToken":"t","status":"s"}'
Test-Endpoint -Method "POST" -Endpoint "/reception/approve" -Body '{"qrToken":"t","decision":"d"}'
Test-Endpoint -Method "POST" -Endpoint "/reception/meeting/start" -Body '{"qrToken":"t","durationMinutes":30}'
Test-Endpoint -Method "POST" -Endpoint "/reception/checkout" -Query "?qrToken=t"

Write-Host "`n--- Testing Other Controllers ---"
Test-Endpoint -Method "GET" -Endpoint "/tracking" -Query "?qrToken=dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/route" -Query "?destination=MeetingRoom1"
Test-Endpoint -Method "GET" -Endpoint "/movement/1"
Test-Endpoint -Method "POST" -Endpoint "/host/approve" -Query "?qrToken=dummy-token"
Test-Endpoint -Method "GET" -Endpoint "/dashboard"
Test-Endpoint -Method "GET" -Endpoint "/analytics"

Write-Host "`nTesting Complete."
