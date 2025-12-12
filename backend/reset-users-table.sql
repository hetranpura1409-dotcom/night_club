-- Drop old users table to allow TypeORM to recreate with new structure
DROP TABLE IF EXISTS users CASCADE;

-- TypeORM will automatically recreate the users table when backend starts
