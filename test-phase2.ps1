# Test 1: Signup
Write-Host "`n=== TEST 1: USER SIGNUP ===" -ForegroundColor Cyan
$signupBody = @'
{
    "name": "Your Name",
    "mobile": "9999888877"
}
'@

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -ContentType "application/json" -Body $signupBody
    Write-Host "✅ Signup Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $signupResponse | ConvertTo-Json
    
    # Test 2: Verification
    Write-Host "`n=== TEST 2: VERIFICATION ===" -ForegroundColor Cyan
    $verifyBody = @'
{
    "mobile": "9999888877",
    "code": "123456"
}
'@
    
    $verifyResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/verify" -Method POST -ContentType "application/json" -Body $verifyBody
    Write-Host "✅ Verification Success!" -ForegroundColor Green
    Write-Host "JWT Token Generated:" -ForegroundColor Yellow
    $verifyResponse | ConvertTo-Json
    
    $token = $verifyResponse.accessToken
    
    # Test 3: Get Profile with Token
    Write-Host "`n=== TEST 3: GET PROFILE (Protected Route) ===" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ Profile Retrieved!" -ForegroundColor Green
    Write-Host "User Profile:" -ForegroundColor Yellow
    $profileResponse | ConvertTo-Json
    
    Write-Host "`n🎉 ALL BACKEND TESTS PASSED!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
}
