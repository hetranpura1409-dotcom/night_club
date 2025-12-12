-- Sample table data for nightclub venues
-- Make sure to replace 'YOUR_NIGHTCLUB_ID' with an actual nightclub ID from your database

-- First, get a nightclub ID by running:
-- SELECT id, name FROM nightclubs LIMIT 5;

-- Then insert tables using that ID:

INSERT INTO tables (id, name, capacity, price, date, time, available, "nightclubId", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'VIP Table A', 8, 5000, '2024-12-13', '21:00', true, 'YOUR_NIGHTCLUB_ID', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'VIP Table B', 10, 6500, '2024-12-13', '21:00', true, 'YOUR_NIGHTCLUB_ID', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Table C', 6, 4000, '2024-12-13', '22:00', true, 'YOUR_NIGHTCLUB_ID', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Premium Table', 12, 8000, '2024-12-14', '21:00', true, 'YOUR_NIGHTCLUB_ID', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Exclusive Booth', 15, 10000, '2024-12-14', '22:00', true, 'YOUR_NIGHTCLUB_ID', NOW(), NOW());

-- To use this:
-- 1. Open your PostgreSQL client (pgAdmin, DBeaver, or psql)
-- 2. Connect to your 'nightclub_poc' database
-- 3. Run: SELECT id, name FROM nightclubs LIMIT 5;
-- 4. Copy a nightclub ID
-- 5. Replace 'YOUR_NIGHTCLUB_ID' in this SQL with the actual ID
-- 6. Execute the INSERT statements
