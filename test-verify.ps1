$body = @'
{"mobile":"5551234567","code":"123456"}
'@
try { 
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/verify' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Success! JWT Token received:"
    $response | ConvertTo-Json -Depth 10
    
    # Store token for next test
    $env:AUTH_TOKEN = $response.accessToken
} catch { 
    Write-Host "Error:"
    $_.ErrorDetails.Message 
}
