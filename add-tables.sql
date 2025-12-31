-- Add tables to all nightclubs that don't have tables
INSERT INTO tables (id, name, capacity, price, date, time, available, "nightclubId")
SELECT 
    gen_random_uuid(),
    'VIP Table',
    4,
    200.00,
    '2025-01-15',
    '20:00',
    true,
    n.id
FROM nightclubs n
LEFT JOIN tables t ON n.id = t."nightclubId"
WHERE t.id IS NULL;

-- Add more table types
INSERT INTO tables (id, name, capacity, price, date, time, available, "nightclubId")
SELECT 
    gen_random_uuid(),
    'Premium Booth',
    6,
    350.00,
    '2025-01-15',
    '21:00',
    true,
    n.id
FROM nightclubs n
WHERE n.id NOT IN (SELECT "nightclubId" FROM tables WHERE name = 'Premium Booth');

-- Add party tables
INSERT INTO tables (id, name, capacity, price, date, time, available, "nightclubId")
SELECT 
    gen_random_uuid(),
    'Party Section',
    10,
    500.00,
    '2025-01-15',
    '22:00',
    true,
    n.id
FROM nightclubs n
WHERE n.id NOT IN (SELECT "nightclubId" FROM tables WHERE name = 'Party Section');
