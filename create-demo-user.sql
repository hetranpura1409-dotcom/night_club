-- Create demo user for booking functionality
INSERT INTO users (id, "firstName", "lastName", email, mobile, password, "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo', 'User', 'demo@nightclub.app', '+1234567890', 'demo123', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
