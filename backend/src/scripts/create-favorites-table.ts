import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function createFavoritesTable() {
    const dataSource = new DataSource(typeOrmConfig as any);

    try {
        await dataSource.initialize();
        console.log('📡 Connected to database');

        // Create favorites table
        await dataSource.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" VARCHAR NOT NULL,
        "nightclubId" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        UNIQUE("userId", "nightclubId")
      );
    `);

        console.log('✅ Favorites table created successfully!');

        // Verify table exists
        const result = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'favorites'
    `);

        if (result.length > 0) {
            console.log('✅ Verified: favorites table exists');
        }

    } catch (error) {
        console.error('❌ Error creating favorites table:', error);
    } finally {
        await dataSource.destroy();
    }
}

createFavoritesTable();
