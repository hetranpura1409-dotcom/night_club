$baseUrl = "http://localhost:3000/api"

# 1. Create a Nightclub
Write-Host "Creating Nightclub..." -ForegroundColor Cyan
$clubBody = @{
    name = "Club Galaxy"
    description = "The best nightclub in the universe"
    location = "123 Space Way"
    imageUrl = "https://example.com/club-galaxy.jpg"
} | ConvertTo-Json

try {
    $club = Invoke-RestMethod -Uri "$baseUrl/nightclubs" -Method Post -Body $clubBody -ContentType "application/json"
    Write-Host "✅ Nightclub Created: $($club.name) (ID: $($club.id))" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create nightclub: $_" -ForegroundColor Red
    exit
}

# 2. Create an Event
Write-Host "`nCreating Event..." -ForegroundColor Cyan
$eventBody = @{
    name = "Neon Party"
    description = "Glow in the dark party"
    date = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ssZ")
    price = 25.00
    imageUrl = "https://example.com/neon-party.jpg"
    nightclubId = $club.id
} | ConvertTo-Json

try {
    $event = Invoke-RestMethod -Uri "$baseUrl/events" -Method Post -Body $eventBody -ContentType "application/json"
    Write-Host "✅ Event Created: $($event.name) (ID: $($event.id))" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create event: $_" -ForegroundColor Red
    exit
}

# 3. List Nightclubs
Write-Host "`nListing Nightclubs..." -ForegroundColor Cyan
$clubs = Invoke-RestMethod -Uri "$baseUrl/nightclubs" -Method Get
$clubs | Format-Table id, name, location -AutoSize

# 4. List Events
Write-Host "`nListing Events..." -ForegroundColor Cyan
$events = Invoke-RestMethod -Uri "$baseUrl/events" -Method Get
$events | Format-Table id, name, date, price, nightclubId -AutoSize
