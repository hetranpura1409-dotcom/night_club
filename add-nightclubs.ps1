# Add Sample Nightclubs to Database
# Run this script from PowerShell

$baseUrl = "http://localhost:3000/api/nightclubs"

# Nightclub 1: Club Velvet
$club1 = @{
    name = "Club Velvet"
    description = "Premium nightlife experience with world-class DJs and VIP service"
    location = "Downtown Los Angeles, CA"
    imageUrl = "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Body $club1 -ContentType "application/json"
Write-Host "✅ Added Club Velvet" -ForegroundColor Green

# Nightclub 2: Neon Pulse
$club2 = @{
    name = "Neon Pulse"
    description = "Electronic music paradise with state-of-the-art sound system and lighting"
    location = "Miami Beach, FL"
    imageUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Body $club2 -ContentType "application/json"
Write-Host "✅ Added Neon Pulse" -ForegroundColor Green

# Nightclub 3: Skyline Lounge
$club3 = @{
    name = "Skyline Lounge"
    description = "Rooftop nightclub with panoramic city views and sophisticated atmosphere"
    location = "New York, NY"
    imageUrl = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Body $club3 -ContentType "application/json"
Write-Host "✅ Added Skyline Lounge" -ForegroundColor Green

# Nightclub 4: The Underground
$club4 = @{
    name = "The Underground"
    description = "Industrial-chic venue featuring underground techno and house music"
    location = "Chicago, IL"
    imageUrl = "https://images.unsplash.com/photo-1571266028243-d220c6fa6e13?w=800"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Body $club4 -ContentType "application/json"
Write-Host "✅ Added The Underground" -ForegroundColor Green

# Nightclub 5: Paradise Club
$club5 = @{
    name = "Paradise Club"
    description = "Tropical-themed nightclub with exotic cocktails and island vibes"
    location = "Las Vegas, NV"
    imageUrl = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Body $club5 -ContentType "application/json"
Write-Host "✅ Added Paradise Club" -ForegroundColor Green

Write-Host "`n🎉 Successfully added 5 nightclubs!" -ForegroundColor Cyan
Write-Host "Visit http://localhost:3001/nightclubs to view them in the Admin Dashboard" -ForegroundColor Yellow
