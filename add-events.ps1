# Add Sample Events to Nightclubs
# Run this script from PowerShell

Write-Host "Fetching nightclubs..." -ForegroundColor Cyan

# Get all nightclubs
$nightclubs = Invoke-RestMethod -Uri 'http://localhost:3000/api/nightclubs'
Write-Host "Found $($nightclubs.Count) nightclubs" -ForegroundColor Green

$baseUrl = "http://localhost:3000/api/events"
$eventCount = 0

# Add 2-3 events for each nightclub
foreach ($club in $nightclubs) {
    Write-Host "`nAdding events for: $($club.name)" -ForegroundColor Yellow
    
    # Event 1: DJ Night
    $event1 = @{
        name = "DJ Night featuring Top Artists"
        description = "Experience the best electronic music with internationally renowned DJs spinning all night long"
        date = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        price = 50.00
        imageUrl = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
        nightclubId = $club.id
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $event1 -ContentType "application/json" | Out-Null
    Write-Host "  Added: DJ Night" -ForegroundColor Green
    $eventCount++
    
    # Event 2: Ladies Night
    $event2 = @{
        name = "Ladies Night - Free Entry"
        description = "Special night featuring complimentary drinks for ladies and amazing music"
        date = (Get-Date).AddDays(10).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        price = 30.00
        imageUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
        nightclubId = $club.id
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $event2 -ContentType "application/json" | Out-Null
    Write-Host "  Added: Ladies Night" -ForegroundColor Green
    $eventCount++
    
    # Event 3: Live Performance
    $event3 = @{
        name = "Live Band Performance"
        description = "Exclusive live performance by popular artists with special guest appearances"
        date = (Get-Date).AddDays(14).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        price = 75.00
        imageUrl = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800"
        nightclubId = $club.id
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $event3 -ContentType "application/json" | Out-Null
    Write-Host "  Added: Live Band Performance" -ForegroundColor Green
    $eventCount++
}

Write-Host "`nSuccessfully added $eventCount events across $($nightclubs.Count) nightclubs!" -ForegroundColor Cyan
Write-Host "Visit http://localhost:3001/events to view them" -ForegroundColor Yellow
