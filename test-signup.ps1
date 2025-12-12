$body = @'
{"name":"Jane Doe","mobile":"5551234567"}
'@
try { 
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/signup' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Success!" 
    $response | ConvertTo-Json -Depth 10
} catch { 
    Write-Host "Error Details:"
    $_.Exception | Format-List * -Force
    Write-Host ""
    Write-Host "Response:"
    $_.ErrorDetails.Message 
}
